import {
  BadRequestException, HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection, DataSource, Like, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { google, youtube_v3, oauth2_v2} from 'googleapis';
import {YoutubeAccountEntity} from "../entities/youtube-account.entity";
import {UserEntity} from "../entities/user.entity";
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import {NUMBER_PAGE, RULE_LEVEL_USER} from "../common/constant";
import { CustomLogger } from './logger.service';
import {SORTBY} from "../common/base.enum";
import { Readable } from 'node:stream';
import {createReadStream, writeFileSync, unlinkSync} from "fs";
import {join} from 'path';
import {CaptionEntity} from "../entities/caption.entity";
import {VideoEntity} from "../entities/video.entity";
import {VideoPushEntity} from "../entities/video-push.entity";
import {updateVideo, getVideoPushHistory, translationCaption, getCaptionPushHistory} from "../dtos/youtube.dto";
import {CaptionPushEntity} from "../entities/caption-push.entity";

@Injectable()
export class YoutubeService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectRepository(YoutubeAccountEntity) private youtubeAccountEntity: Repository<YoutubeAccountEntity>,
    @InjectRepository(CaptionEntity) private captionEntity: Repository<CaptionEntity>,
    @InjectRepository(UserEntity) private UserEntity: Repository<UserEntity>,
    @InjectRepository(VideoEntity) private VideoEntity: Repository<VideoEntity>,
    @InjectRepository(VideoPushEntity) private VideoPushEntity: Repository<VideoPushEntity>,
    @InjectRepository(CaptionPushEntity) private CaptionPushEntity: Repository<CaptionPushEntity>,
    private dataSource: DataSource,
    private configService: ConfigService,
    private readonly httpService: HttpService,
    private logger: CustomLogger,
  ) {}
  readonly oauth2Client = new google.auth.OAuth2(
      this.configService.get('CLIENT_ID_YOUTUBE'),
      this.configService.get('CLIENT_SECRET_YOUTUBE'),
      this.configService.get('CALLBACK_FE_YOUTUBE')
  );

  readonly scopes = [
    'https://www.googleapis.com/auth/youtube.force-ssl',
    'profile',
    'email'
  ];

  async getAuthorizationUrl(req) {
    req.session.user_id = req.account.user_id;
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: this.scopes,
      include_granted_scopes: true,
      state: req.account.user_id,
      prompt: "select_account",
    });
  }

  async callback(data) {
    if (data.error) { // An error response e.g. error=access_denied
      this.logger.log('Error:' + data.error);
      throw new HttpException("Error-auth-google", 452);
    }
    const userId = data.state;
    await this.checkLevelUser(userId);
    let { tokens } = await this.oauth2Client.getToken(data.code);
    if (!tokens.scope.includes("https://www.googleapis.com/auth/youtube.force-ssl")) {
      throw new HttpException("This-YouTube-account-does-not-have-permission-to-connect.Please-try-again-to-automatically-grant-full-permissions.", 452);
    }
    let infoAccount = await this.getInfoYoutubeAccount(tokens.access_token);
    await this.checkEmailAccountYoutube(infoAccount.email);
    const dataAccount: any = {
      user_id: userId,
      email: infoAccount.email,
      name: infoAccount.name,
    };
    const youtubeAccountOld = await this.youtubeAccountEntity.findOne({ where: { email: infoAccount.email }, withDeleted: true })
    if (!tokens.refresh_token) {
      if (!youtubeAccountOld) {
        this.logger.log('Error: youtubeAccountOld Not found-'+userId+'-'+infoAccount.email);
        throw new HttpException("Please-revoke-permissions-in-your-google-account-and-try-again", 452);
      }
      dataAccount.total_video = await this.getTotalVideo(youtubeAccountOld.refresh_token, true);
      dataAccount.deletedAt = null;

      return await this.youtubeAccountEntity.update({id : youtubeAccountOld.id}, dataAccount)
    }

    if (youtubeAccountOld) {
      await this.youtubeAccountEntity.update({id : youtubeAccountOld.id}, { email: "delete+"+youtubeAccountOld.email })
    }

    const totalVideo = await this.getTotalVideo(tokens.refresh_token, true);
    if (totalVideo === false) {
      dataAccount.refresh_token = tokens.refresh_token;
      dataAccount.deletedAt = new Date();
      await this.youtubeAccountEntity.save(dataAccount);
      throw new HttpException("This-action-can-not-be-done-because-you-have-ran-out-of-points.Please-try-again-later!", 452);
    }

    const infoChannel: any = await this.getInfoChannel(tokens.refresh_token);
    dataAccount.refresh_token = tokens.refresh_token;
    dataAccount.total_video = totalVideo;
    dataAccount.id_channel = infoChannel.id;
    dataAccount.name_channel = infoChannel.snippet.title;
    dataAccount.description = infoChannel.snippet.description;
    dataAccount.custom_url = infoChannel.snippet.customUrl;
    dataAccount.picture = infoChannel.snippet.thumbnails.default.url;
    return await this.youtubeAccountEntity.save(dataAccount);
  }

  async checkLevelUser(userId) {
    const user = await this.UserEntity.findOne({
      where: { id: userId },
      relations: ['youtubeAccounts'],
    });
    const rule = await this.getRuleLevelUser(user.level);
    if (user.youtubeAccounts.length >= rule.account && rule.account !== null) {
      this.logger.log('Error:User reaches account maximum.');
      throw new HttpException("User-reaches-account-maximum", 452);
    }
  }

  async checkEmailAccountYoutube(email) {
    const accounts = await this.youtubeAccountEntity.find({
      where: { email: email },
    });
    if (accounts.length > 0) {
      this.logger.log('Error:Youtube account already exists.');
      throw new HttpException("This-YouTube-account-has-been-connected-to-another-account.", 452);
    }
  }

  async getYoutubeAccountById(userId, id) {
    const entity = await this.youtubeAccountEntity.findOne({
      where: { id: id, user_id: userId }
    });
    if (!entity) {
      throw new BadRequestException("Not found Youtube Account");
    }

    return entity;
  }

  // ✅ 수정된 부분: 파라미터 바인딩 적용
  async getYoutubeAccountByUserId(query, userId) {
    const page = query.page ?? NUMBER_PAGE.PAGE;
    const pageSize = query.pageSize ?? NUMBER_PAGE.PAGE_SIZE;
    const orderBy = {
      "ya.name": SORTBY[query.sortBy],
    };

    return await this.youtubeAccountEntity.createQueryBuilder('ya')
      .select(["ya.id", "ya.email", "ya.name_channel", "ya.picture", "ya.user_id", "ya.total_video"])
      // 🚀 수정: :userId 파라미터 사용
      .where('ya.user_id = :userId', { userId: userId }) 
      .orderBy(orderBy)
      .take(pageSize)
      .skip((page - 1) * pageSize)
      .getManyAndCount();
  }

  async deleteYoutubeAccount(userId, youtubeAccountId) {
    let youtubeAccount = await this.youtubeAccountEntity.findOne({
      where: { id: youtubeAccountId, user_id: userId }
    });
    if (!youtubeAccount) {
      this.logger.log("Error: The Youtube Account not found.");
      throw new NotFoundException('The Youtube Account not found.');
    }

    return await this.youtubeAccountEntity.softDelete(youtubeAccountId);
  }

  async getInfoYoutubeAccount(accessToken) {
    try {
      const request = this.httpService.get(
          `https://www.googleapis.com/oauth2/v1/userinfo?alt=json`,
          {headers: {
              'Authorization': 'Bearer '+ accessToken,
              'Accept': 'application/json'}
          }
      );
      const res = await lastValueFrom(request);
      return res.data;
    } catch (error) {
      this.logger.log("Error getInfoYoutubeAccount: "+error.response.data);
      throw new HttpException(error.message, 500);
    }
  }

  async getRuleLevelUser(level) {
    if (!level) {
      this.logger.log("Error: User level not found.");
      throw new NotFoundException('USER_LEVEL_NOT_FOUND', 'USER_LEVEL_NOT_FOUND');
    }
    for (let index = 0; index < RULE_LEVEL_USER.length; ++index) {
      if (RULE_LEVEL_USER[index].level == level) {
        return RULE_LEVEL_USER[index];
      }
    }
  }

  async getVideos(param, refreshToken, auth?) {
    let listParams: youtube_v3.Params$Resource$Search$List = {
      forMine: true,
      part: ["snippet"],
      type: ["video"],
    };

    if (param.text) {
      listParams.q = param.text;
    }

    if (param.page_token) {
      listParams.pageToken = param.page_token;
    }

    // default max = 50
    listParams.maxResults = 10;

    let yt = await this.authYoutube(refreshToken);
    return await yt.search.list(listParams).then((response) => {
      return response.data;
    }).catch((error) => {
      // ✅ [로그 추가] 진짜 에러 원인을 백엔드 터미널에 출력
      console.error("🔥 YouTube API Error (getVideos):", error.message);
      if (error.response) {
         console.error("🔥 Error Response:", JSON.stringify(error.response.data, null, 2));
      }
      if (auth) {
        if (Array.isArray(error.errors) && error.errors.length > 0) {
          let message = error.errors[0].message;
          if (message.indexOf("quota") != -1) {
            return { pageInfo: {
                totalResults: false
              }
            };
          }
        }
        throw new HttpException("This-account-is-Invalid.", 452);
      }
      throw new HttpException(error.message || "YouTube API Error", 499);
    });
  }

  async detailVideo(videoId, refreshToken) {
    let listParams: youtube_v3.Params$Resource$Videos$List = {
      part: ["snippet", "id", "localizations"],
      id: [videoId]
    };
    let yt = await this.authYoutube(refreshToken);
    return await yt.videos.list(listParams).then((response) => {
      return response.data.items[0];
    }).catch((error) => {
      throw new HttpException(error, 499);
    });
  }

  async updateTitleAndDesVideo(param, refreshToken, userId) {
    const detailVideoById: any = await this.detailVideo(param.video_id, refreshToken)
    let localizations = {};
    if (detailVideoById.localizations) {
      localizations = detailVideoById.localizations;
    }
    let title = "";
    let description = "";
    for (let localization of JSON.parse(param.localizations)) {
      if (!localization.lang || !localization.title) {
        throw new BadRequestException('Localization is missing param');
      }

      if (localization.title.length > 100) {
        throw new BadRequestException('Title is too long: '+localization.lang);
      }

      if (localization.description.length > 5000) {
        throw new BadRequestException('Description is too long: '+localization.lang);
      }

      if (localization.lang == param.default_lang) {
        title = localization.title;
        description = localization.description;
      }
      Object.assign(localizations, {
        [localization.lang]: {
          title: localization.title,
          description: localization.description
        }
      });
    }

    let listParams: youtube_v3.Params$Resource$Videos$Update = {
      part: ["snippet", "id", "localizations"],
      requestBody: {
        id : param.video_id,
        localizations : localizations,
        snippet: {
          title: title,
          description: description,
          defaultLanguage: param.default_lang,
          categoryId: param.category_id,
          defaultAudioLanguage: detailVideoById.snippet.defaultAudioLanguage
        }
      }
    }

    let yt = await this.authYoutube(refreshToken);
    return await yt.videos.update(listParams).then((response) => {
      this.videoPushHistory(param, userId)
      return response.data;
    }).catch((error) => {
      this.logger.log(error);
      throw new HttpException(error, 499);
    });
  }

  async detailCaptionById(refreshToken, videoId, defaultLang, originalLang) {
    const captions = await this.getCaptionsByVideoId(videoId, refreshToken);
    if (captions.length < 1) {
      throw new BadRequestException("This video does not have captions.");
    }
    let translationCaption = false;
    let captionId = '';
    let lang = originalLang;
    for (let i = 0; i < captions.length; i++) {
      if (captions[i].snippet.language == lang && captions[i].snippet.status == "serving") {
        captionId = captions[i].id;
      }
    }

    if (captionId == '' && defaultLang != originalLang) {
      lang = defaultLang;
      for (let i = 0; i < captions.length; i++) {
        if (captions[i].snippet.language == lang && captions[i].snippet.status == "serving") {
          captionId = captions[i].id;
          translationCaption = true;
        }
      }
    }

    if (captionId == '') {
      for (let i = 0; i < captions.length; i++) {
        if (captions[i].snippet.status == "serving") {
          captionId = captions[i].id;
          translationCaption = true;
          lang = captions[i].snippet.language;
        }
      }
    }

    // Convert the captions into this format. Supported options are sbv, srt, vtt, scc, ttml
    let listParams: youtube_v3.Params$Resource$Captions$Download = {
      id: captionId,
      tfmt: "ttml"
    }
    let yt = await this.authYoutube(refreshToken);
    const caption: any = await yt.captions.download(listParams).then((response) => {
      return response;
    }).catch((error) => {
      throw new HttpException(error, 499);
    });

    let blob = caption.data;
    const arr = Object.getOwnPropertySymbols(blob);
    let text = caption.data[arr[1]].toString('utf8');
    await this.createOrUpdateCaptionToDB({
      caption_id: captionId,
      video_id: videoId,
      lang: lang,
      text: text
    });
    let content = text.slice(text.indexOf("<p begin"), text.lastIndexOf("</p>")+4);
    let items = content.split("</p>");
    let data = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].indexOf("<p begin=\"") == -1) {
        continue;
      }
      let indexBegin = items[i].indexOf("<p begin=\"");
      let begin = items[i].slice(indexBegin + 10, indexBegin + 22);
      let indexEnd = items[i].indexOf("end=\"");
      let end = items[i].slice(indexEnd + 5, indexEnd + 17);
      let textItem = items[i].slice(items[i].indexOf("style=\"s2\">") + 11, items[i].length);
      textItem = textItem.replace(/\n/g, '');
      data.push({
        begin: begin,
        end: end,
        text: textItem,
      });
    }

    return [data, translationCaption];
  }

  async getCaptionsByVideoId(videoId, refreshToken) {
    let listParams: youtube_v3.Params$Resource$Captions$List = {
      part: ["snippet", "id"],
      videoId: videoId
    }

    let yt = await this.authYoutube(refreshToken);
    return await yt.captions.list(listParams).then((response) => {
      return response.data.items;
    }).catch((error) => {
      throw new HttpException(error, 499);
    });
  }

  async deleteCaption(captionId, refreshToken) {
    let listParams: youtube_v3.Params$Resource$Captions$Delete = {
      id: captionId
    }

    let yt = await this.authYoutube(refreshToken);
    return await yt.captions.delete(listParams).then((response) => {
      return response.data;
    }).catch((error) => {
      throw new HttpException(error, 499);
    });
  }

  async addCaptionToVideo(path: string, videoId, lang, refreshToken) {
    let fileBuffer = createReadStream(join(path));
    const listParams: youtube_v3.Params$Resource$Captions$Insert = {
      part: ['id', 'snippet'],
      requestBody: {
        snippet: {
          language: lang,
          name: "",
          videoId: videoId
        },
      },
      media: {
        mimeType: 'application/octet-stream',
        body: Readable.from(fileBuffer)
      }
    };
    let yt = await this.authYoutube(refreshToken);
    return await yt.captions.insert(listParams).then((response) => {
      unlinkSync(path);
      return response.data;
    }).catch((error) => {
      throw new HttpException(error, 499);
    });
  }

  async updateCaptionToVideo(path: string, captionId, refreshToken) {
    let fileBuffer = createReadStream(join(path));
    const listParams: youtube_v3.Params$Resource$Captions$Update = {
      part: ['id', 'snippet'],
      requestBody: {
        id: captionId,
      },
      media: {
        mimeType: 'application/octet-stream',
        body: Readable.from(fileBuffer)
      }
    };
    let yt = await this.authYoutube(refreshToken);
    return await yt.captions.update(listParams).then((response) => {
      unlinkSync(path);
      return response.data;
    }).catch((error) => {
      throw new HttpException(error, 499);
    });
  }

  async authYoutube(refreshToken) {
    this.oauth2Client.setCredentials({refresh_token: refreshToken});
    return new youtube_v3.Youtube({auth: this.oauth2Client});
  }

  async getTotalVideo(refreshToken, auth?) {
    const data: any = await this.getVideos({}, refreshToken, auth);
    return data.pageInfo.totalResults;
  }

  async getInfoAccountYoutube(refreshToken) {
    this.oauth2Client.setCredentials({refresh_token: refreshToken});
    let authYoutube = new oauth2_v2.Oauth2({auth: this.oauth2Client});
    return await authYoutube.userinfo.get().then((response) => {
      return response.data;
    }).catch((error) => {
      throw new HttpException(error, 499);
    });
  }

  async refreshAccount(youtubeAccountId, refreshToken) {
    const infoAccount: any = await this.getInfoAccountYoutube(refreshToken);
    const totalVideo = await this.getTotalVideo(refreshToken);
    const infoChannel: any = await this.getInfoChannel(refreshToken);
    return await this.youtubeAccountEntity.update({id : youtubeAccountId}, {
      total_video: totalVideo,
      email: infoAccount.email,
      name: infoAccount.name,
      id_channel: infoChannel.id,
      picture: infoChannel.snippet.thumbnails.default.url,
      name_channel: infoChannel.snippet.title,
      description: infoChannel.snippet.description,
      custom_url: infoChannel.snippet.customUrl,
    });
  }

  async translationCaptionToVideo(data, refreshToken, userId) {
    const caption = await this.findCaptionByVideoId(data.video_id);
    const captionsOfVideo: any = await this.getCaptionsByVideoId(data.video_id, refreshToken)
    let content = JSON.parse(data.content);
    for (let i = 0; i < captionsOfVideo.length; i++) {
      if (data.lang == captionsOfVideo[i].snippet.language) {
        await this.deleteCaption(captionsOfVideo[i].id, refreshToken);
      }
    }

    let path = await this.createFileUploadCaption(content, caption.text, data.video_id, data.lang);
    await this.addCaptionToVideo(path, data.video_id, data.lang, refreshToken)

    if (data.is_default_lang == true) {
      await this.updateAudioLangDefault(refreshToken, data.video_id, data.lang)
    }

    await this.captionPushHistory(data, userId);
    return true;
  }

  async createOrUpdateCaptionToDB(data) {
    const caption = await this.findCaptionByVideoId(data.video_id);
    if (caption) {
      return await this.captionEntity.update({id : caption.id}, data)
    }

    return await this.captionEntity.save(data)
  }

  async findCaptionByVideoId(videoId) {
    return await this.captionEntity.findOne({
      where: { video_id: videoId }
    })
  }

  async createFileUploadCaption(data, text, videoId, lang) {
    let content = text.slice(text.indexOf("<p begin"), text.lastIndexOf("</p>")+4);
    let items = content.split("</p>");
    for (let i = 0; i < items.length; i++) {
      if (items[i].indexOf("<p begin=\"") == -1) {
        continue;
      }
      let indexBegin = items[i].indexOf("<p begin=\"");
      let begin = items[i].slice(indexBegin + 10, indexBegin + 22);

      for (let j = 0; j < data.length; j++) {
        if (data[i].begin == begin) {
          items[i] = items[i].slice(0, items[i].indexOf("style=\"s2\">") + 11) + data[i].text + "</p>";
        }
      }
    }

    let newContent = items.reduce((sum, num) => sum + num);
    let newText = text.replace(content, newContent)
    let path = "publish/caption-"+videoId+"-"+lang+"-"+ Date.now() +".txt";
    writeFileSync(path, newText);
    return path;
  }

  // ✅ 수정된 부분: getVideosYoutubeCache 함수
  async getVideosYoutubeCache(param, refreshToken) {
    const queryBuilder = this.VideoEntity.createQueryBuilder('v')
      // 🚀 수정: :accountId 파라미터 사용
      .where('v.youtube_account_id = :accountId', { accountId: param.youtube_account_id });

    if (param.text) {
      // 🚀 수정: :text 파라미터 사용
      queryBuilder.andWhere('v.text = :text', { text: param.text });
    }

    if (param.page_token) {
       // 🚀 수정: :pageToken 파라미터 사용
      queryBuilder.andWhere('v.page_token = :pageToken', { pageToken: param.page_token });
    }

    const entityVideo = await queryBuilder.getOne();

    if (entityVideo) {
      return JSON.parse(entityVideo.content);
    }

    const data = await this.getVideos(param, refreshToken);
    await this.VideoEntity.save({
      youtube_account_id: param.youtube_account_id,
      text: param.text ?? null,
      page_token: param.page_token ?? null,
      content: JSON.stringify(data),
    });
    return data;
  }

  async deleteCacheVideo(youtubeAccountId) {
    return await this.VideoEntity.update({youtube_account_id : youtubeAccountId}, {deletedAt: new Date()});
  }

  async getInfoChannel(refreshToken) {
    const listParams: youtube_v3.Params$Resource$Channels$List = {
      part: ['id', 'snippet'],
      mine: true
    };
    let yt = await this.authYoutube(refreshToken);
    return await yt.channels.list(listParams).then((response) => {
      if (response.data.items) {
        return response.data.items[0];
      }
      throw new HttpException("Google-account-has-no-channel", 452);
    }).catch((error) => {
      throw new HttpException(error.response, error.status);
    });
  }

  async videoPushHistory(content: updateVideo, userId) {
      const videoPushHistory = await this.VideoPushEntity.findOne({
          where: { video_id: content.video_id, user_id: userId, youtube_account_id: content.youtube_account_id}
      });

      if (videoPushHistory) {
        return await this.VideoPushEntity.update({id : videoPushHistory.id}, {
          localizations: content.localizations,
          default_lang: content.default_lang,
          exclude_title: content.exclude_title,
          exclude_description: content.exclude_description,
          category_id: content.category_id
        })
      }

      return await this.VideoPushEntity.save({
        user_id: userId,
        video_id: content.video_id,
        youtube_account_id: content.youtube_account_id,
        localizations: content.localizations,
        default_lang: content.default_lang,
        exclude_title: content.exclude_title,
        exclude_description: content.exclude_description,
        category_id: content.category_id
      });
  }

  async getVideoPushHistory(query: getVideoPushHistory, userId) {
    return await this.VideoPushEntity.findOne({
      where: { video_id: query.video_id, user_id: userId, youtube_account_id: query.youtube_account_id}
    });
  }

  async getListVideoPushHistory(youtubeAccountId, userId) {
    return await this.VideoPushEntity.find({
      where: { user_id: userId, youtube_account_id: youtubeAccountId}
    });
  }

  async handleCheckPushVideo(data, listVideoPush, listCaptionPush) {
    let videosIdPush = listVideoPush.map(item => item.video_id);
    let captionsIdPush = listCaptionPush.map(item => item.video_id);
    let items = data.items;
    for (let i = 0; i < items.length; ++i) {
      items[i].is_push = false;
      items[i].is_push_caption = false;
      if (videosIdPush.includes(items[i].id.videoId)) {
        items[i].is_push = true;
      }

      if (captionsIdPush.includes(items[i].id.videoId)) {
        items[i].is_push_caption = true;
      }
    }
    data.items = items;
    return data;
  }

  async getLanguagesYoutube(refreshToken) {
    const listParams: youtube_v3.Params$Resource$I18nlanguages$List = {
      part: ['id', 'snippet']
    };
    let yt = await this.authYoutube(refreshToken);
    return await yt.i18nLanguages.list(listParams).then((response) => {
        return response.data;
    }).catch((error) => {
      throw new HttpException(error.response, error.status);
    });
  }

  async captionPushHistory(content: translationCaption, userId) {
    const captionPushHistory = await this.CaptionPushEntity.findOne({
      where: { video_id: content.video_id, user_id: userId, youtube_account_id: content.youtube_account_id, lang: content.lang}
    });

    if (captionPushHistory) {
      return await this.CaptionPushEntity.update({id : captionPushHistory.id}, {
        content: content.content,
        lang: content.lang,
        exclude_text: content.exclude_text,
        is_default_lang: content.is_default_lang
      })
    }

    return await this.CaptionPushEntity.save({
      user_id: userId,
      video_id: content.video_id,
      youtube_account_id: content.youtube_account_id,
      lang: content.lang,
      exclude_text: content.exclude_text,
      content: content.content,
      is_default_lang: content.is_default_lang
    });
  }

  async getCaptionPushHistory(query: getCaptionPushHistory, userId) {
    return await this.CaptionPushEntity.find({
      where: { video_id: query.video_id, user_id: userId, youtube_account_id: query.youtube_account_id}
    });
  }

  async getListCaptionPushHistory(youtubeAccountId, userId) {
    return await this.CaptionPushEntity.find({
      where: { user_id: userId, youtube_account_id: youtubeAccountId}
    });
  }

  async updateAudioLangDefault(refreshToken, videoId, lang) {
    const detailVideo: any = await this.detailVideo(videoId, refreshToken);
    let snippet = detailVideo.snippet;
    if (snippet.defaultAudioLanguage == lang) {
      return true;
    }
    snippet.defaultAudioLanguage = lang;
    let listParams: youtube_v3.Params$Resource$Videos$Update = {
      part: ["snippet", "id"],
      requestBody: {
        id : videoId,
        snippet: snippet
      }
    }
    let yt = await this.authYoutube(refreshToken);
    return await yt.videos.update(listParams).then((response) => {
      return response.data;
    }).catch((error) => {
      this.logger.log(error);
      throw new HttpException(error, 499);
    });
  }

  // ✅ 수정된 부분: getTotalTranslationCaptionByUserId 함수
  async getTotalTranslationCaptionByUserId(userId, youtubeAccountIds) {
    if (!youtubeAccountIds || youtubeAccountIds.length === 0) {
      return 0;
    }

    const items = await this.CaptionPushEntity.createQueryBuilder('c')
        .select(["c.video_id"])
        // 🚀 수정: :userId 파라미터 사용
        .where('c.user_id = :userId', { userId })
        // 🚀 수정: IN (:...ids) 문법 사용 (배열을 안전하게 처리)
        .andWhere('c.youtube_account_id IN (:...ids)', { ids: youtubeAccountIds })
        .getMany();
    return await this.totalItemInValueOfObject(items);
  }

  // ✅ 수정된 부분: getTotalTranslationVideoByUserId 함수
  async getTotalTranslationVideoByUserId(userId, youtubeAccountIds) {
     if (!youtubeAccountIds || youtubeAccountIds.length === 0) {
      return 0;
    }
    
    const items = await this.VideoPushEntity.createQueryBuilder('v')
        .select(["v.video_id"])
        // 🚀 수정: :userId 파라미터 사용
        .where('v.user_id = :userId', { userId })
        // 🚀 수정: IN (:...ids) 문법 사용
        .andWhere('v.youtube_account_id IN (:...ids)', { ids: youtubeAccountIds })
        .getMany();
    return await this.totalItemInValueOfObject(items);
  }
  
  // ✅ 수정된 부분: getAllAccountYoutubeByUserId 함수
  async getAllAccountYoutubeByUserId(userId) {
    return await this.youtubeAccountEntity.createQueryBuilder('ya')
        .select(["ya.id", "ya.user_id", "ya.total_video"])
        // 🚀 수정: :userId 파라미터 사용
        .where('ya.user_id = :userId', { userId: userId }) 
        .getManyAndCount();
  }

  async totalItemInValueOfObject(object) {
    let result = object.map(a => a.video_id);
    let uniqueValue = result.filter((value, index, array) => array.indexOf(value) === index);
    return uniqueValue.length;
  }
}
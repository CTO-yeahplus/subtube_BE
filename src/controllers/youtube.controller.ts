import {
  Controller,
  Get,
  Post,
  Delete,
  Request,
  Param,
  UseGuards,
  Query,
  UsePipes,
  ValidationPipe, Body,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthenUserGuard } from 'src/utils/guard';
import {YoutubeService} from "../services/youtube.service";
import {
  translationCaption,
  detailVideo,
  getCaptions,
  getDetailCaption, listAccount,
  SearchVideoReq,
  updateVideo,
  YoutubeAccountRes, refreshVideo, getVideoPushHistory, getLanguagesYoutube, getCaptionPushHistory
} from "../dtos/youtube.dto";
import {responseHelper} from "../utils";
import {NUMBER_PAGE} from "../common/constant";
import {TranslateGoogleService} from "../services/translateGoogle.service";


@ApiTags('Youtube')
@Controller('/youtube')
@ApiBearerAuth()
@UseGuards(AuthenUserGuard)
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class YoutubeController {
  constructor(
      private youtubeService: YoutubeService,
      private translateGoogleService: TranslateGoogleService
  ) {}

  @Get('/connect')
  @ApiOperation({ summary: 'Youtube' })
  @ApiOkResponse()
  async connect(@Request() req) {
    return responseHelper(await this.youtubeService.getAuthorizationUrl(req));
  }

  @Get('/list')
  @ApiOperation({ summary: 'Youtube' })
  @ApiOkResponse({ type: YoutubeAccountRes })
  async list(@Query() query: listAccount, @Request() req: { account: { user_id :number }}) {
    query.page = query.page ?? NUMBER_PAGE.PAGE;
    query.pageSize = query.pageSize ?? NUMBER_PAGE.PAGE_SIZE;
    let [entities, total] = await this.youtubeService.getYoutubeAccountByUserId(query, req.account.user_id);
    return responseHelper({
      entities,
      pagination: {
        total,
        current_page: query.page,
        per_page: query.pageSize,
        last_page: Math.ceil(total / query.pageSize),
      },
    });
  }

  @Get('/refresh-total-video/:youtube_account_id')
  @ApiOperation({ summary: 'Youtube' })
  @ApiOkResponse({ type: YoutubeAccountRes })
  async refreshTotalVideo(@Param('youtube_account_id') youtubeAccountId: number, @Request() req: { account: { user_id :number }}) {
    const youtubeAccount = await this.youtubeService.getYoutubeAccountById(req.account.user_id, youtubeAccountId);
    return responseHelper(await this.youtubeService.refreshAccount(youtubeAccountId, youtubeAccount.refresh_token));
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Youtube' })
  @ApiOkResponse()
  async delete(@Param('id') id: number, @Request() req: { account: { user_id :number }}) {
    return responseHelper(await this.youtubeService.deleteYoutubeAccount(req.account.user_id, id));
  }

  @Get('/videos')
  @ApiOperation({ summary: 'Youtube' })
  @ApiOkResponse()
  async getVideos(@Query() query: SearchVideoReq, @Request() req: { account: { user_id :number }}) {
    const youtubeAccount = await this.youtubeService.getYoutubeAccountById(req.account.user_id, query.youtube_account_id);
    let data = await this.youtubeService.getVideosYoutubeCache(query, youtubeAccount.refresh_token)
    const listVideoPush = await this.youtubeService.getListVideoPushHistory(query.youtube_account_id, req.account.user_id)
    const listCaptionPush = await this.youtubeService.getListCaptionPushHistory(query.youtube_account_id, req.account.user_id)
    return responseHelper(await this.youtubeService.handleCheckPushVideo(data, listVideoPush, listCaptionPush));
  }

  @Get('/detail-video')
  @ApiOperation({ summary: 'Youtube' })
  @ApiOkResponse()
  async getDetailVideo(@Query() query: detailVideo, @Request() req: { account: { user_id :number }}) {
    const youtubeAccount = await this.youtubeService.getYoutubeAccountById(req.account.user_id, query.youtube_account_id);
    return responseHelper(await this.youtubeService.detailVideo(query.video_id, youtubeAccount.refresh_token));
  }

  @Post('/translation-video')
  @ApiOperation({ summary: 'Youtube' })
  @ApiOkResponse()
  async updateTitleAndDesVideo(@Body() query: updateVideo, @Request() req: { account: { user_id :number }}) {
    const youtubeAccount = await this.youtubeService.getYoutubeAccountById(req.account.user_id, query.youtube_account_id);
    return responseHelper(await this.youtubeService.updateTitleAndDesVideo(query, youtubeAccount.refresh_token, req.account.user_id));
  }

  @Get('/detail-caption')
  @ApiOperation({summary: 'Youtube'})
  @ApiOkResponse()
  async detailCaption(@Query() query: getDetailCaption, @Request() req: { account: { user_id: number } }) {
    const youtubeAccount = await this.youtubeService.getYoutubeAccountById(req.account.user_id, query.youtube_account_id);
    const [data, translation] = await this.youtubeService.detailCaptionById(youtubeAccount.refresh_token, query.video_id, query.default_lang, query.original_lang)
    if (!translation) {
      return responseHelper(data);
    }

    let body = {
      "languages": [query.original_lang],
      "exclude_captions": []
    }
    const result = await Promise.all(await this.translateGoogleService.captionForLanguage(body, data));
    return responseHelper(result[0].content);
  }

  @Get('/captions-by-video')
  @ApiOperation({summary: 'Youtube'})
  @ApiOkResponse()
  async getCaptionsByVideoId(@Query() query: getCaptions, @Request() req: { account: { user_id: number } }) {
    const youtubeAccount = await this.youtubeService.getYoutubeAccountById(req.account.user_id, query.youtube_account_id);
    return responseHelper(await this.youtubeService.getCaptionsByVideoId(query.video_id, youtubeAccount.refresh_token));
  }

  @Post('/translation-caption')
  @ApiOperation({summary: 'Youtube'})
  @ApiOkResponse()
  async translationCaption(@Body() query: translationCaption, @Request() req: { account: { user_id: number } }) {
    const youtubeAccount = await this.youtubeService.getYoutubeAccountById(req.account.user_id, query.youtube_account_id);
    return responseHelper(await this.youtubeService.translationCaptionToVideo(query, youtubeAccount.refresh_token, req.account.user_id));
  }

  @Post('/refresh-video')
  @ApiOperation({ summary: 'Youtube' })
  @ApiOkResponse()
  async refreshVideoYoutube(@Body() query: refreshVideo, @Request() req: { account: { user_id :number }}) {
    return responseHelper(await this.youtubeService.deleteCacheVideo(query.youtube_account_id));
  }

  @Get('/video-push-history')
  @ApiOperation({ summary: 'Youtube' })
  @ApiOkResponse()
  async getVideoPushHistory(@Query() query: getVideoPushHistory, @Request() req: { account: { user_id :number }}) {
    return responseHelper(await this.youtubeService.getVideoPushHistory(query, req.account.user_id));
  }

  @Get('/caption-push-history')
  @ApiOperation({ summary: 'Youtube' })
  @ApiOkResponse()
  async getCaptionPushHistory(@Query() query: getCaptionPushHistory, @Request() req: { account: { user_id :number }}) {
    return responseHelper(await this.youtubeService.getCaptionPushHistory(query, req.account.user_id));
  }

  @Get('/languages-youtube')
  @ApiOperation({ summary: 'Youtube' })
  @ApiOkResponse()
  async getLanguagesYoutube(@Query() query: getLanguagesYoutube, @Request() req: { account: { user_id :number }}) {
    const youtubeAccount = await this.youtubeService.getYoutubeAccountById(req.account.user_id, query.youtube_account_id);
    return responseHelper(await this.youtubeService.getLanguagesYoutube(youtubeAccount.refresh_token));
  }

  @Get('/total-translation-of-video')
  @ApiOperation({ summary: 'Youtube' })
  @ApiOkResponse()
  async totalTranslationOfVideo(@Request() req: { account: { user_id :number }}) {
    let [youtubeAccounts, total] = await this.youtubeService.getAllAccountYoutubeByUserId(req.account.user_id);
    const totalVideo = youtubeAccounts.map(item => item.total_video).reduce((prev, curr) => prev + curr, 0);
    let youtubeAccountIds = youtubeAccounts.map(a => a.id);

    let totalTranslatedCaption = 0;
    let totalTranslatedVideo = 0;
    if (youtubeAccountIds.length > 0) {
      totalTranslatedCaption = await this.youtubeService.getTotalTranslationCaptionByUserId(req.account.user_id, youtubeAccountIds);
      totalTranslatedVideo = await this.youtubeService.getTotalTranslationVideoByUserId(req.account.user_id, youtubeAccountIds);
    }
    return responseHelper({
      total_translated_Caption: totalTranslatedCaption,
      total_translated_video: totalTranslatedVideo,
      total_video: totalVideo,
      total_account_youtube: total
    });
  }
}

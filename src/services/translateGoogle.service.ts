import { Translate } from '@google-cloud/translate/build/src/v2';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ReqBodyDetectTranslateDto, ReqBodyTranslateCaptionDto, ReqBodyTranslateDto } from 'src/dtos/translate.dto';
import { I18nService } from 'nestjs-i18n';
import { CREDENTIALS_GG, STATUS_TRANSLATE } from 'src/common/constant';
import { STATUS_TO_TRANSLATE } from 'src/common/base.enum';
import { YoutubeService } from './youtube.service';
import { CustomLogger } from './logger.service';
import { language } from 'googleapis/build/src/apis/language';

@Injectable()
export class TranslateGoogleService {
  constructor(
    private youtubeService: YoutubeService,
    private readonly i18n: I18nService,
    private logger: CustomLogger,
  ) {}
  readonly Translate = new Translate({
    credentials: CREDENTIALS_GG,
    projectId: CREDENTIALS_GG.project_id,
  })

  async listLanguages(lang: string, userId: number, youtubeAccountId: number) {
    try {
      const nameMap = {};
      const youtubeAccount = await this.youtubeService.getYoutubeAccountById(userId, youtubeAccountId);
      const languagesYoutube = await this.youtubeService.getLanguagesYoutube(youtubeAccount.refresh_token)
      const [languages] = await this.Translate.getLanguages();
      let result = languagesYoutube.items.map(item  => item.id)
      var newLanguages = languages.filter(function (item) {
        return result.includes(item.code);
      });
      newLanguages.forEach(language => {
        if (!nameMap[language.name]) {
          // If this is the first occurrence of this name, just store it in the map
          nameMap[language.name] = language.code;
        } else {
          // If this name has already occurred, concatenate with underscore
          language.name = `${language.name}_${language.code}`;
        }
      });

      return newLanguages
    } catch (error) {
      this.logger.error(
        'Call List Languages Error: ', error
      );
      
      throw new BadRequestException(this.i18n.t('error.BAD_REQUEST_EXCEPTION'));
    }
  }

  async detectLanguage(body: ReqBodyDetectTranslateDto) {
    try {
      let response = await this.Translate.detect(body.text);
      console.log(response);
      response.forEach(item => {

      })
      return response[0].language;
    } catch (error) {
      console.log(`Error at detectLanguage --> ${error}`);
      return 0;
    }
  }

  async translateText(body: ReqBodyTranslateDto, lang: string, userId: number) {
    try {
      const data = [];
      for (const language of body.languages) {
        const titlePromise = await this.excludeReplaceTexts(body.title, body.exclude_titles, language);
        const descriptionPromise = await this.excludeReplaceTexts(body.description, body.exclude_descriptions, language);
        const [title, description] = await Promise.all([titlePromise, descriptionPromise]);
        data.push({title, description, language});
      }

      return data
    } catch (error) {
      this.logger.error(
        'Call Translate Language Error: ', error
      );

      throw new BadRequestException(this.i18n.t('error.BAD_REQUEST_EXCEPTION'));
    }
  }

  async translateCaption(body: ReqBodyTranslateCaptionDto, lang: string, userId: number) {
    try {
      const convertCaptions = JSON.parse(JSON.stringify(body.captions));
    
      return Promise.all(await this.captionForLanguage(body, convertCaptions));
    } catch (error) {
      this.logger.error(
        'Call Translate Language Error: ', error
      );

      throw new BadRequestException(this.i18n.t('error.BAD_REQUEST_EXCEPTION'));
    }
  }

  async excludeReplaceTexts(text: string, excludeTexts: any, language: string){
    try {
      let markers: { [key: string]: string } = {};
      if (excludeTexts && excludeTexts.length > 0) {
        excludeTexts.sort((a: string, b: string) => b.length - a.length);
        let modifiedString = excludeTexts.reduce((str: string, excludeText: string, index: number) => {
          const marker = `_%f${index}@_`;
          markers[marker] = excludeText;
          return str.replace(new RegExp(excludeText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), marker);
        }, text);
        const translationWithExcludeResponse  = await this.Translate.translate(modifiedString, language)
        if (translationWithExcludeResponse && translationWithExcludeResponse.length > 0) {
          excludeTexts.forEach((str: string, index: number) => {
            const pattern = new RegExp(`_%f${index}@_`, 'g');
            const matches = translationWithExcludeResponse[0].match(pattern);
            if (matches) {
              translationWithExcludeResponse[0] = translationWithExcludeResponse[0].replace(pattern, excludeTexts[index])
            }
          });

          return translationWithExcludeResponse[0]
        }
      }
  
      const translationResponse  = await this.Translate.translate(text, language)
      if (translationResponse && translationResponse.length > 0) {
        return translationResponse[0]
      }
    } catch (err) {
      this.logger.error(
        'Call Translate Language excludeReplaceTexts Error: ', err
      );

      throw new BadRequestException(this.i18n.t('error.BAD_REQUEST_EXCEPTION'));
    }
  };

  async captionForLanguage(body: any, convertCaptions: any) {
    return body.languages.map(async (lang: any) => {
      // Process each caption for the current language
      const contentPromises = convertCaptions.map(async (caption: any) => {
        const text = await this.excludeReplaceTexts(
          caption.text,
          body.exclude_captions,
          lang,
        );
        return {
          begin: caption.begin,
          end: caption.end,
          text,
        };
      });

      const content = await Promise.all(contentPromises);
      return {
        lang,
        content,
      };
    });
  }
}

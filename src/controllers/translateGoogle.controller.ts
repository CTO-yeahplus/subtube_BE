import { Body, Controller, Delete, Get, Head, Param, Post, Query, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { IncomingHttpHeaders } from 'http';
import { I18nService } from 'nestjs-i18n';
import { ReqBodyDetectTranslateDto, ReqBodyTranslateCaptionDto, ReqBodyTranslateDto, translateRes } from 'src/dtos/translate.dto';
import { getLanguagesYoutube } from 'src/dtos/youtube.dto';
import { TranslateGoogleService } from 'src/services/translateGoogle.service';
import { responseHelper } from 'src/utils';
import { AuthJwtUserGuard } from 'src/utils/guard';

@ApiTags('Translate')
@Controller('/translate')
@ApiBearerAuth()
@UseGuards(AuthJwtUserGuard)
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class TranslateGoogleController {
  constructor(
    private translateGoogleService: TranslateGoogleService,
    private readonly i18n: I18nService,
  ) {}

  // @Post('/detect-language')
  async detectLanguage(@Body() body: ReqBodyDetectTranslateDto, @Request() req: { headers: IncomingHttpHeaders, account: { user_id :number } } ) {
    const lang = req.headers['language'] as string;
    return responseHelper(
      await this.translateGoogleService.detectLanguage(body),
    );
  }

  @Get('/list-language')
  async listLanguages(@Request() req: { headers: IncomingHttpHeaders, account: { user_id :number } }, @Query() query: getLanguagesYoutube) {
    const lang = req.headers['language'] as string;
    return responseHelper(
      await this.translateGoogleService.listLanguages(lang, +req.account.user_id, +query.youtube_account_id),
    );
  }

  @Post('/translate-text')
  @ApiCreatedResponse({ type: translateRes })
  async translateText(@Body() body: ReqBodyTranslateDto, @Request() req: { headers: IncomingHttpHeaders, account: { user_id :number } }) {
    const lang = req.headers['language'] as string;
    return responseHelper(
      await this.translateGoogleService.translateText(body, lang, +req.account.user_id),
      true,
      this.i18n.t('success.FINISHED_TRANSLATING', { lang })
    );
  }

  @Post('/translate-text-caption')
  @ApiCreatedResponse({ type: translateRes })
  async translateTextCaption(@Body() body: ReqBodyTranslateCaptionDto, @Request() req: { headers: IncomingHttpHeaders, account: { user_id :number } }) {
    const lang = req.headers['language'] as string;
    return responseHelper(
      await this.translateGoogleService.translateCaption(body, lang, +req.account.user_id),
      true,
      this.i18n.t('success.FINISHED_TRANSLATING', { lang })
    );
  }
}

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException, BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { I18nService } from 'nestjs-i18n';
import { ConfigService } from "@nestjs/config";

@Catch()
export class ExceptionError implements ExceptionFilter {
  constructor(private i18n: I18nService,private configService: ConfigService) {}
  catch(exception: HttpException | any, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse();
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const lang = ctx.getRequest().language;
    let status = 500;
    if (exception.response) {
      if (exception.getStatus) {
        status = exception.getStatus();
      }
    }
    if (exception instanceof HttpException) {
      const err: any = exception.getResponse();
      //show error when connect youtube
      if (status == 452) {
          let url = this.configService.get('REDIRECT_FE_LIST_ACCOUNT_YOUTUBE') + '?code=400&message=' + err;
          res.redirect(url);
      }

      if (status == 499) {
        let message = err;
        if (Array.isArray(err.errors) && err.errors.length > 0) {
          message = err.errors[0].message;
          if (message && message.indexOf("quota") != -1) {
            message = "This action can not be done because you have ran out of points. Please try again later!"
          }
        }
        return response.status(status).json({
          success: false,
          code: status,
          message: message,
        });
      }

      if (Array.isArray(err.message) && err.message.length > 0) {
        err.message = err.message[0];
      }
      if (err?.error) {
        const err_mess = this.i18n.t(`error.${err.error}`, { lang });
        if (!err_mess.includes('error.')) {
          err.message = this.i18n.t(`error.${err.error}`, { lang });
        }
      }
      return response.status(status).json({
        success: false,
        ...err,
      });
    }
    response.status(status).json({
      success: false,
      code: status,
      message: exception.error
        ? this.i18n.t(`error.${exception.error}`, { lang })
        : exception.message,
    });
  }
}

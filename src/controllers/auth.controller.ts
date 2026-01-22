import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post, Query,
  Request,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe
} from "@nestjs/common";
import {
  RefreshTokenReq,
  AuthDto,
  SignInRes,
  SignUpReq,
  VerifyAccount,
} from '../dtos/auth.dto';
import {
  UserRes,
  AuthResetPasswordDto,
  ForgetPasswordReq,
  VerifyForgetPasswordReq,
  VerifyUserReq,
  VerifyForgetPasswordSmsReq,
} from '../dtos/user.dto';
import { AuthService } from '../services/auth.service';
import { responseHelper } from '../utils';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { SuccessResDto } from 'src/common/base.dto';
import { OptService } from '../services/otp.service';
import { METHOD_VERIFY_USER, OTPTYPE } from 'src/common/base.enum';
import { TokenService } from '../services/token.service';
import { Response } from 'express';
import { LocalAuthGuard, RefreshJwtGuard } from "src/utils/guard";
import { I18nService } from "nestjs-i18n";
import { IncomingHttpHeaders } from "http";

@ApiTags('auth')
@Controller('auth')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private otpService: OptService,
    private tokenService: TokenService,
    private readonly i18n: I18nService,
  ) { }

  @Post('sign-up')
  @HttpCode(200)
  @ApiCreatedResponse({ type: UserRes })
  async signUp(@Body() body: SignUpReq, @Request() req: { headers: IncomingHttpHeaders }) {     
    const lang = req.headers['language'] as string; 
    return responseHelper(await this.authService.signUpJwt(body, lang));
  }

  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  @HttpCode(200)
  @ApiOkResponse({ type: SignInRes })
  async login(@Body() body: AuthDto) {
    return responseHelper(await this.authService.loginJwt(body));
  }

  @Get('/verify')
  @HttpCode(200)
  @ApiOkResponse({ type: SuccessResDto })
  async verify(
    @Query() query: VerifyAccount,
    @Res() res: Response,
  ) {
    const url = await this.authService.verifyAccount(query);

    return res.redirect(url);
  }

  @Post('/resend-email-verify')
  @ApiOkResponse({ type: SuccessResDto })
  @ApiOperation({ summary: 'Resend verify user' })
  async resendVerify(@Body() query: VerifyUserReq, @Request() req: { headers: IncomingHttpHeaders }) {
    const lang = req.headers['language'] as string;
    return responseHelper(await this.authService.resendVerify(query, lang));
  }

  @Get('/verify-forgot-password')
  @HttpCode(200)
  @ApiOkResponse({ type: SuccessResDto })
  async verifyForgotPass(
    @Query() query: VerifyForgetPasswordReq,
    @Res() res: Response,
  ) {
    const url = await this.authService.verifyAccountForgotPassword(query);

    return res.redirect(url);
  }

  @Get('/verify-forgot-password-sms')
  @HttpCode(200)
  @ApiOkResponse({ type: SuccessResDto })
  async verifyForgotPassSms(
    @Query() query: VerifyForgetPasswordSmsReq
  ) {
    return responseHelper(await this.authService.verifyAccountForgotPasswordSms(query));
  }

  @Post('/forgot-password')
  @ApiOkResponse({ type: SuccessResDto })
  @ApiOperation({ summary: 'Send email forgot password' })
  async forgotPassword(@Body() body: ForgetPasswordReq, @Request() req: { headers: IncomingHttpHeaders }) {
    const lang = req.headers['language'] as string;
    const email = body.email
    const checkOtp = await this.otpService.findOne({
      email: email || '',
      type: OTPTYPE.FORGOT_PASSWORD,
    }, false);
    
    if (!checkOtp) {
      if (body.method == METHOD_VERIFY_USER.EMAIL) {
        await this.otpService.create({
          email,
          type: OTPTYPE.FORGOT_PASSWORD,
          is_resend: true,
        });
      }
    }else{
      const current = new Date().getTime();

      if (current - checkOtp.createdAt.getTime() <= 30000) {
        throw new BadRequestException('err', 'NOT_ENOUGH_TIME_30S');
      }
    }

    return responseHelper( await this.authService.sendAndCheckResetPass(body, lang));
  }

  @Post('/reset-password')
  @ApiOkResponse({ type: SuccessResDto })
  @ApiOperation({ summary: 'Reset Password' })
  async resetPassword(@Body() body: AuthResetPasswordDto) {
    const { password, code, method } = body;
    if (method === METHOD_VERIFY_USER.PHONE_NUMBER) { 
      await this.authService.resetPasswordWithPhoneNumber(body.phone, body.phone_code, password, code);
    }else{
      const checkOtp = await this.otpService.findOne({
        code: code,
        type: OTPTYPE.FORGOT_PASSWORD,
      });
      await this.authService.resetPassword(checkOtp.email, password);
      await this.otpService.deleteBy({
        email: checkOtp.email,
        code: code,
        type: OTPTYPE.FORGOT_PASSWORD,
      });
    }

    return responseHelper(true, true, this.i18n.t('success.UPDATE_PASS_SUCCESS'));
  }

  @Delete('/sign-out/:id')
  @ApiOkResponse({ type: SuccessResDto })
  @ApiOperation({ summary: 'Sign Out' })
  async signOut(@Param('id') id: number) {
    return responseHelper(await this.tokenService.deleteToken(id));
  }

  @UseGuards(RefreshJwtGuard)
  @Post('/refresh-token-jwt')
  @ApiOkResponse({ type: SignInRes })
  async refreshNewTokenJwt(@Body() body: RefreshTokenReq, @Request() req) {
    return responseHelper( await this.authService.refreshTokenJwt(body.refreshToken, req) );
  }
}

import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { encryptHashedEmail } from 'src/utils';
import { ConfigService } from '@nestjs/config';

@Injectable()

export class MailService {
  
  constructor(
    private mailerService: MailerService, 
    private configService: ConfigService,
  ) {}
 
  async sendMail(email: string, userActiveUrl: string, fullName: string, lang: string =  'en', checkSns: boolean = false) {
    const confirmation_url = userActiveUrl;
    const customerName = fullName;
    return this.mailerService.sendMail({
      to: email,
      subject: 'SubTube Translation account activation',
      template: './welcome',
      context: {
        name: email,
        confirmation_url,
        customerName,
        checkSns
      },
    });
  }

  async sendMailResetPass(fullName: string, email: string, code: string, lang: string =  'en') {
    const contac_us = process.env.CONTACTS_US;
    const term = process.env.TERMS_OF_USE;
    const privacy = process.env.PRIVACY_POLICY;
    const hashedEmail = await encryptHashedEmail(email);
    let userResetUrl = `${process.env.APP_DOMAIN}auth/verify-forgot-password?email=${hashedEmail}&token=${code}`
    const confirmation= userResetUrl
    return this.mailerService.sendMail({
      to: email,
      subject: 'Reset Password for SubTube Translation',
      template: './resetpass',
      context: { 
        name: email,
        fullName: fullName,
        confirmation,
        contac_us,
        term,
        privacy
      },
    });
  }

  async sendAdminEmailPaymentError(data: any) {
    return this.mailerService.sendMail({
      to: this.configService.get('EMAIL_ADMIN_RECEIVE'),
      subject: `The transaction #${data.payment_capture_id} has been disputed/canceled/requested to refund by Paypal`,
      template: './sendAdminPaymentError',
      context: { 
        name: data.name,
        email: data.email,
        user_id: data.user_id,
        first_name: data.first_name,
        last_name: data.last_name,
        payment_capture_id: data.payment_capture_id,
        start_date: data.start_date,
        expire_date: data.expire_date,
        total: data.total,
        rank: data.rank,
        currency: data.currency,
        statusPaymentWebhook: data.statusPaymentWebhook ?? null
      },
    });
  }

  async sendEmailExpiredPlan(data: any) {
    return this.mailerService.sendMail({
      to: data.email,
      subject: data.subjectDay,
      template: './subscriptionPlanExpire',
      context: { 
        customerName: data.fullName,
        expireDate: data.expire_date,
        planName: data.rank,
        adminEmail: this.configService.get('EMAIL_ADMIN_RECEIVE'),
        loginUrl: this.configService.get('LOGIN_URL')
      },
    });
  }
} 

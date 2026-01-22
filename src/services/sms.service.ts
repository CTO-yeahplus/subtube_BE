import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SNS } from 'aws-sdk';
import { CustomLogger } from './logger.service';

@Injectable()
export class SmsService {
  private sns: SNS;

  constructor(
    private configService: ConfigService,
    private logger: CustomLogger,
  ) {
    this.sns = new SNS({
      region: this.configService.get('REGION_SMS'),
      accessKeyId: this.configService.get('ACCESS_KEY_AWS'),
      secretAccessKey: this.configService.get('SECRET_ACCESS_KEY_AWS'),
      apiVersion: '2010-03-31',
    });
  }

  async sendSMSResetPassword(
    phoneNumber: string,
    name: string,
    link: string,
  ): Promise<any> {
    try {
      const params = {
        Message: `Hi ${name}, your password can be reset by clicking this link ${link}. If you did not request a new password, please ignore this message.
This link will expire within 48 hours.
Regards!`,
        PhoneNumber: phoneNumber,
        MessageAttributes: {
          'AWS.SNS.SMS.SenderID': {
            DataType: 'String',
            StringValue: 'reset-pass',
          },
          'AWS.SNS.SMS.SMSType': {
            DataType: 'String',
            StringValue: 'Transactional'
          }
        },
      };
      this.logger.log(`send success SMS ResetPassword Log: ${JSON.stringify( await this.sns.publish(params).promise())}`);

      return await this.sns.publish(params).promise();
    } catch (error) {
      this.logger.error(`send SMS ResetPassword Error: ${JSON.stringify(error)}`, error);
      this.logger.log(`send SMS ResetPassword Log: ${error}`);
      
      throw new BadRequestException('BAD_REQUEST_EXCEPTION', 'BAD_REQUEST_EXCEPTION');
    }
  }
}

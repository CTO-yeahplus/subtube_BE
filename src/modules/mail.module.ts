import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { MailController } from '../controllers/mail.controller';
import { MailService } from '../services/mail.service';
@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule.forRoot({
        isGlobal: true, // no need to import into other modules
      }),],
      useFactory: async (config: ConfigService) => {
        return {
          transport: {
            host: config.get('EMAIL_HOST'),
            port: config.get('EMAIL_PORT'),
            secure: false,
            ignoreTLS: false,
            auth: {
              user: config.get('EMAIL_ADMIN'),
              pass: config.get('EMAIL_PASSWORD'),
            },
          },
          defaults: {
            from: `"NOREPLY" <${config.get('EMAIL_FROM')}>`,
          },
          template: {
            dir: join(__dirname, 'mail/templates'),
            adapter: new EjsAdapter(),
            options: {
              strict: false,
            },
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}

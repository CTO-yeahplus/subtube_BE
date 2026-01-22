import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth.module';
import { UserModule } from './modules/user.module';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import * as path from 'path';
import { FileModule } from './modules/file.module';
import { OtpModule } from './modules/opt.module';
import { MulterModule } from '@nestjs/platform-express';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import { MailModule } from './modules/mail.module';
import {YoutubeModule} from "./modules/youtube.module";
import { TranslateGoogleModule } from './modules/translateGoogle.module';
import { PaymentModule } from './modules/payment.module';

@Module({
  imports: [
    MulterModule.register({ dest: 'image' }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        autoLoadEntities: true,
        // entities: [__dirname + '/**/*.entity{.ts,.js}'],`
        entities: ['dist/**/*.entity.js'],
        synchronize: true,
        extra: {
          charset: 'utf8mb4_unicode_ci',
        },
      }),
      async dataSourceFactory(options) {
        if (!options) {
          throw new Error('Invalid options passed');
        }

        return addTransactionalDataSource(new DataSource(options));
      },
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
      ],
    }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    ServeStaticModule.forRoot({
      serveRoot: '/publish',
      rootPath: join(__dirname, '..', 'publish'),
    }),
    GoogleRecaptchaModule.forRoot({
      response: (request) => request.body.recaptchaToken,
      secretKey: process.env.SECRET_KEY_CAPTCHA,
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    MailModule,
    UserModule,
    OtpModule,
    YoutubeModule,
    TranslateGoogleModule,
    PaymentModule,
  ],
})
export class AppModule {}

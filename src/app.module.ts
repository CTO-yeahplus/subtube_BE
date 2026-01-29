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
import { MailModule } from './modules/mail.module';
import { YoutubeModule } from "./modules/youtube.module";
import { TranslateGoogleModule } from './modules/translateGoogle.module';
import { PaymentModule } from './modules/payment.module';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource, deleteDataSourceByName } from 'typeorm-transactional';

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
      useFactory: (configService: ConfigService) => {
        const dbUrl = configService.get<string>('DATABASE_URL');
      
        // 👇 [추가] DB 주소가 없으면 명확한 에러 메시지를 띄우고 멈춥니다.
        if (!dbUrl) {
          console.error('❌ [Fatal Error] DATABASE_URL is missing in .env file!');
          throw new Error('DATABASE_URL environment variable is not defined.');
        }
      
        // 주소가 로컬인지 확인 (이제 dbUrl이 있다고 확신하므로 에러 안 남)
        const isLocal = dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1');
      
        console.log(`[Database] Connecting to ${isLocal ? 'Localhost (No SSL)' : 'Remote (SSL)'}...`);
      
        return {
          type: 'postgres',
          url: dbUrl,
          autoLoadEntities: true,
          synchronize: true, 
          ssl: isLocal ? false : { rejectUnauthorized: false },
          // 👇👇 [핵심 추가] 이 코드가 "IPv4만 써!" 라고 강제합니다.
          extra: {
            family: 4, 
          },
        };
      },
      
      // 👇 아까 추가했던 트랜잭션 충돌 방지 코드는 그대로 유지해야 합니다!
      dataSourceFactory: async (options) => {
        const { DataSource } = await import('typeorm');
        const { addTransactionalDataSource, deleteDataSourceByName } = await import('typeorm-transactional');

        if (!options) {
          throw new Error('Invalid options passed');
        }

        try {
          deleteDataSourceByName('default');
        } catch (e) {
          // 처음 실행이라 삭제할 게 없으면 에러 무시
        }

        const dataSource = new DataSource(options);
        return addTransactionalDataSource(dataSource);
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
export class AppModule { }

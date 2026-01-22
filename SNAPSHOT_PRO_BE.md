# 🧠 Deep Context Snapshot (Backend)

**Generated at:** 2026-01-22 07:38:03
**Target:** AI Context Understanding & Code Preservation

> **🛑 INSTRUCTION FOR AI:**
> 1. This document contains the **entire backend source code**.
> 2. Look at the **Context Summary** above each file content first. It summarizes API routes, DB models, and core logic.
> 3. Use this context to identify relationships between `Schemas` (Pydantic), `Endpoints` (FastAPI), and `Services` (Business Logic).
> 4. Do not hallucinate files or functions not listed here.

---

## 🗺️ File Map
**Total Files:** 83

```text
.
│   ├── nest-cli.json
│   ├── package.json
│   ├── tsconfig.build.json
│   ├── .eslintrc.js
│   ├── tsconfig.json
│   test/
│   │   ├── app.e2e-spec.ts
│   │   ├── jest-e2e.json
│   publish/
│   src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   utils/
│   │   │   ├── lang.middleware.ts
│   │   │   ├── guard.ts
│   │   │   ├── helper.ts
│   │   │   ├── multer.ts
│   │   │   ├── utils.ts
│   │   │   ├── index.ts
│   │   │   ├── error.exception.ts
│   │   schedules/
│   │   │   ├── payment.schedule.ts
│   │   dtos/
│   │   │   ├── translate.dto.ts
│   │   │   ├── youtube.dto.ts
│   │   │   ├── file.dto.ts
│   │   │   ├── user.dto.ts
│   │   │   ├── payment.dto.ts
│   │   │   ├── otp.dto.ts
│   │   │   ├── auth.dto.ts
│   │   │   ├── payment_card.dto.ts
│   │   common/
│   │   │   ├── validation.body.input.ts
│   │   │   ├── constant.ts
│   │   │   ├── enviroment.ts
│   │   │   ├── base.dto.ts
│   │   │   ├── base.enum.ts
│   │   │   ├── generation.xlsx.const.ts
│   │   │   ├── error.ts
│   │   i18n/
│   │   │   ko/
│   │   │   │   ├── error.json
│   │   │   │   ├── success.json
│   │   │   en/
│   │   │   │   ├── error.json
│   │   │   │   ├── success.json
│   │   modules/
│   │   │   ├── mail.module.ts
│   │   │   ├── user.module.ts
│   │   │   ├── payment.module.ts
│   │   │   ├── opt.module.ts
│   │   │   ├── file.module.ts
│   │   │   ├── youtube.module.ts
│   │   │   ├── translateGoogle.module.ts
│   │   │   ├── logger.module.ts
│   │   │   ├── auth.module.ts
│   │   │   serializer/
│   │   │   │   ├── session.serializer.ts
│   │   │   mail/
│   │   │   │   templates/
│   │   controllers/
│   │   │   ├── youtube.controller.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── translateGoogle.controller.ts
│   │   │   ├── file.controller.ts
│   │   │   ├── user.controller.ts
│   │   │   ├── mail.controller.ts
│   │   │   ├── payment.controller.ts
│   │   │   ├── payment-webhook.controller.ts
│   │   │   ├── youtubeCallBack.controller.ts
│   │   assets/
│   │   services/
│   │   │   ├── firebase.service.ts
│   │   │   ├── sms.service.ts
│   │   │   ├── file.service.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── payment.service.ts
│   │   │   ├── otp.service.ts
│   │   │   ├── logger.service.ts
│   │   │   ├── user.service.ts
│   │   │   ├── youtube.service.ts
│   │   │   ├── mail.service.ts
│   │   │   ├── translateGoogle.service.ts
│   │   │   ├── token.service.ts
│   │   entities/
│   │   │   ├── token-key-admin.entity.ts
│   │   │   ├── youtube-account.entity.ts
│   │   │   ├── role.entity.ts
│   │   │   ├── file-import.entity.ts
│   │   │   ├── payment.entity.ts
│   │   │   ├── video.entity.ts
│   │   │   ├── change_rank.entity.ts
│   │   │   ├── user.entity.ts
│   │   │   ├── caption.entity.ts
│   │   │   ├── otp.entity.ts
│   │   │   ├── video-push.entity.ts
│   │   │   ├── caption-push.entity.ts
│   │   │   ├── base.entity.ts
│   │   │   ├── token-key.entity.ts
│   │   strategy/
│   │   │   ├── local-strategy.ts
│   │   │   ├── auth-jwt.strategy.ts
```

---

## 💻 Source Details

        ### 📄 nest-cli.json
        > **Context Summary**
        * (No structural elements detected)

        ```json
        {
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "deleteOutDir": true,
    "assets": [
      { "include": "i18n/**/*"},
      { "include": "modules/mail/templates/**/*" }
    ],
    "watchAssets": true
  }
}

        ### 📄 package.json
        > **Context Summary**
        * (No structural elements detected)

        ```json
        {
  "name": "youtube_translation",
  "version": "0.0.1",
  "description": "",
  "author": "",
  "private": true,
  "license": "UNLICENSED",
  "scripts": {
    "build": "nest build",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "test:e2e": "jest --config ./test/jest-e2e.json"
  },
  "dependencies": {
    "@aws-sdk/client-s3": "^3.489.0",
    "@google-cloud/translate": "^8.2.0",
    "@hapi/joi": "^17.1.1",
    "@nestjs-modules/mailer": "^1.9.1",
    "@nestjs/axios": "^3.0.2",
    "@nestjs/bull": "^10.0.1",
    "@nestjs/common": "^10.2.8",
    "@nestjs/config": "^3.1.1",
    "@nestjs/core": "^10.2.8",
    "@nestjs/passport": "^10.0.3",
    "@nestjs/platform-express": "^10.2.8",
    "@nestjs/schedule": "^4.0.0",
    "@nestjs/serve-static": "^4.0.1",
    "@nestjs/swagger": "^7.1.15",
    "@nestjs/typeorm": "^10.0.0",
    "@nestlab/google-recaptcha": "^3.7.0",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/passport-twitter": "^1.0.40",
    "aws-sdk": "^2.1628.0",
    "bcrypt": "^5.1.1",
    "bull": "^4.12.1",
    "cheerio": "^1.0.0-rc.12",
    "class-transformer": "^0.5.1",
    "country-code-lookup": "^0.1.2",
    "cron": "^3.1.6",
    "crypto": "^1.0.1",
    "css-inline": "^0.11.2",
    "dotenv": "^16.3.1",
    "ejs": "^3.1.9",
    "excel": "^1.0.1",
    "exceljs": "^4.4.0",
    "express": "^4.19.2",
    "express-session": "^1.18.0",
    "firebase": "^10.12.3",
    "firebase-admin": "^12.2.0",
    "google-auth-library": "^9.2.0",
    "googleapis": "^137.1.0",
    "jsonwebtoken": "^9.0.2",
    "macaddress-local-machine": "^1.0.7",
    "moment": "^2.30.1",
    "nest-csv-parser": "^2.0.4",
    "nestjs-i18n": "^10.3.7",
    "nestjs-real-ip": "^3.0.1",
    "nestjs-session": "^3.0.1",
    "passport": "^0.7.0",
    "passport-local": "^1.0.0",
    "passport-twitter": "^1.0.4",
    "reflect-metadata": "^0.1.13",
    "request-ip": "^3.3.0",
    "rxjs": "^7.8.1",
    "stripe": "^14.25.0",
    "twilio": "^5.0.4",
    "typeorm": "^0.3.17",
    "typeorm-transactional": "^0.5.0",
    "uuid": "^9.0.1",
    "winston": "^3.11.0",
    "xlsx": "^0.18.5"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.2.1",
    "@nestjs/jwt": "^10.2.0",
    "@nestjs/schematics": "^10.0.3",
    "@nestjs/testing": "^10.2.8",
    "@types/bcrypt": "^5.0.2",
    "@types/express": "^4.17.21",
    "@types/express-session": "^1.18.0",
    "@types/jest": "^29.5.8",
    "@types/multer": "^1.4.10",
    "@types/node": "^20.9.0",
    "@types/nodemailer": "^6.4.14",
    "@types/passport-jwt": "^3.0.13",
    "@types/passport-local": "^1.0.38",
    "@types/request-ip": "^0.0.41",
    "@types/supertest": "^2.0.16",
    "@typescript-eslint/eslint-plugin": "^6.10.0",
    "@typescript-eslint/parser": "^6.10.0",
    "axios": "^1.6.8",
    "bcrypt": "^5.1.1",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.1",
    "eslint": "^8.53.0",
    "eslint-config-prettier": "^9.0.0",
    "eslint-plugin-prettier": "^5.0.1",
    "google-auth-library": "^9.2.0",
    "jest": "^29.7.0",
    "lodash": "^4.17.21",
    "mysql2": "^3.6.3",
    "nestjs-i18n": "^10.3.7",
    "nodemailer": "^6.9.7",
    "passport-jwt": "^4.0.1",
    "prettier": "^3.1.0",
    "source-map-support": "^0.5.21",
    "supertest": "^6.3.3",
    "ts-jest": "^29.1.1",
    "ts-loader": "^9.5.0",
    "ts-node": "^10.9.1",
    "tsconfig-paths": "^4.2.0",
    "tslib": "^2.6.2",
    "typescript": "^5.2.2",
    "uuidv4": "^6.2.13"
  },
  "jest": {
    "moduleFileExtensions": [
      "js",
      "json",
      "ts"
    ],
    "rootDir": "src",
    "testRegex": ".*\\.spec\\.ts$",
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    "collectCoverageFrom": [
      "**/*.(t|j)s"
    ],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node",
    "moduleNameMapper": {
      "^src/(.*)$": "<rootDir>/$1"
    }
  }
}

        ### 📄 tsconfig.build.json
        > **Context Summary**
        * (No structural elements detected)

        ```json
        {
  "extends": "./tsconfig.json",
  "exclude": ["node_modules", "test", "dist", "**/*spec.ts"]
}

        ### 📄 .eslintrc.js
        > **Context Summary**
        * (No structural elements detected)

        ```js
        module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    "prettier/prettier": [
      "error",
      {
        "endOfLine": "auto"
      }
    ]
  },
};

        ### 📄 tsconfig.json
        > **Context Summary**
        * (No structural elements detected)

        ```json
        {
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2021",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": false,
    "noImplicitAny": false,
    "strictBindCallApply": false,
    "forceConsistentCasingInFileNames": false,
    "noFallthroughCasesInSwitch": false,
  }
}

        ### 📄 test/app.e2e-spec.ts
        > **Context Summary**
        * (No structural elements detected)

        ```ts
        import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});

        ### 📄 test/jest-e2e.json
        > **Context Summary**
        * (No structural elements detected)

        ```json
        {
  "moduleFileExtensions": ["js", "json", "ts"],
  "rootDir": ".",
  "testEnvironment": "node",
  "testRegex": ".e2e-spec.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  }
}

        ### 📄 src/main.ts
        > **Context Summary**
        * 𝑓 Functions: bootstrap...

        ```ts
        /**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { NestFactory } from '@nestjs/core';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ExceptionError } from './utils/error.exception';
import { I18nService } from 'nestjs-i18n';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import { LanguageMiddleware } from './utils/lang.middleware';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  initializeTransactionalContext();
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalFilters(new ExceptionError(app.get(I18nService), app.get(ConfigService)));
  app.use(bodyParser.json({limit: '100mb'}));
  app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));
  app.use(new LanguageMiddleware().use);
  // app.useGlobalPipes(
  //   new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  // );
  app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

  const config = new DocumentBuilder()
    .setTitle(process.env.APP_NAME)
    .setDescription(`The ${process.env.APP_NAME} description`)
    .addBearerAuth()
    .addGlobalParameters(
      {
        in: 'header',
        required: false,
        name: 'language',
        example: 'en',
      },
      {
        in: 'header',
        required: false,
        name: 'currency',
        example: 'JPY',
      },
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'Authorization', 'Language', 'Currency'],
  });

  await app.listen(process.env.PORT, () => {
    console.log(
      `🚀 Application is running on: http://localhost:${process.env.PORT}/${globalPrefix}`,
    );
  });
}

bootstrap();

        ### 📄 src/app.module.ts
        > **Context Summary**
        * 📦 Classes: AppModule

        ```ts
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

        ### 📄 src/utils/lang.middleware.ts
        > **Context Summary**
        * 📦 Classes: LanguageMiddleware

        ```ts
        import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class LanguageMiddleware implements NestMiddleware {
  use(req: Request, res: any, next: (error?: any) => void) {
    const lang = req.headers['language'];
    req['language'] = lang;
    next();
  }
}

        ### 📄 src/utils/guard.ts
        > **Context Summary**
        * 📦 Classes: AuthenUserGuard, AuthenAdminGuard, AuthenSuperAdminGuard, AuthJwtUserGuard, LocalAuthGuard, RefreshJwtGuard

        ```ts
        import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { verifyToken } from './utils';
import { ConfigService } from '@nestjs/config';
import { I18nService } from 'nestjs-i18n';
import { UserService } from 'src/services/user.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/services/auth.service';

@Injectable()
export class AuthenUserGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private readonly i18n: I18nService,
    private userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (type !== 'Bearer') {
      throw new UnauthorizedException('UNAUTHORIZED', 'UNAUTHORIZED');
    }
    try {
      const payload: any = verifyToken(
        token,
        this.configService.get('JWT_KEY'),
      );
      if (payload?.key) {
        throw new UnauthorizedException('UNAUTHORIZED', 'UNAUTHORIZED');
      }
      await this.userService.findById(+payload.user_id);
      request['account'] = payload;
      const language = request.headers.language;
      if (!language) request['language'] = payload.language;
    } catch (error) {
      if (error.message === 'jwt expired') {
        throw new UnauthorizedException(
          'Your login session has been expired. Please login again !',
          'TOKEN_EXPIRED',
        );
      }
      throw new UnauthorizedException('UNAUTHORIZED', 'UNAUTHORIZED');
    }
    return true;
  }
}

@Injectable()
export class AuthenAdminGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private readonly i18n: I18nService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (type !== 'Bearer') {
      throw new UnauthorizedException('UNAUTHORIZED', 'UNAUTHORIZED');
    }
    try {
      const payload = verifyToken(token, this.configService.get('JWT_KEY')) as {
        id: number;
        email: string;
        type: string;
        key: string;
      };
      if (payload?.key) {
        throw new UnauthorizedException('UNAUTHORIZED', 'UNAUTHORIZED');
      }
      if (!['admin', 'superadmin'].includes(payload.type)) {
        throw new UnauthorizedException('UNAUTHORIZED', 'UNAUTHORIZED');
      }
      request['admin'] = payload;
    } catch (error) {
      if (error.message === 'jwt expired') {
        throw new UnauthorizedException(
          'Your login session has been expired. Please login again !',
          'TOKEN_EXPIRED',
        );
      }
      throw new UnauthorizedException('UNAUTHORIZED', 'UNAUTHORIZED');
    }
    return true;
  }
}

@Injectable()
export class AuthenSuperAdminGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (type !== 'Bearer') {
      throw new UnauthorizedException('UNAUTHORIZED', 'UNAUTHORIZED');
    }
    try {
      const payload = verifyToken(token, this.configService.get('JWT_KEY')) as {
        id: number;
        email: string;
        type: string;
        key: string;
      };
      if (payload?.key) {
        throw new UnauthorizedException('UNAUTHORIZED', 'UNAUTHORIZED');
      }
      if (payload.type !== 'superadmin') {
        throw new ForbiddenException('FORBIDDEN_ROLE', 'FORBIDDEN_ROLE');
      }
      request['admin'] = payload;
    } catch (error) {
      if (error.message === 'jwt expired') {
        throw new UnauthorizedException(
          'Your login session has been expired. Please login again !',
          'TOKEN_EXPIRED',
        );
      }
      throw new UnauthorizedException('UNAUTHORIZED', 'UNAUTHORIZED');
    }
    return true;
  }
}

@Injectable()
export class AuthJwtUserGuard extends AuthGuard('jwt')  {
  private readonly logger = new Logger(AuthJwtUserGuard.name);
  constructor(
    private configService: ConfigService,
    private readonly i18n: I18nService,
    private userService: UserService,
  ) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (type !== 'Bearer') {
      throw new UnauthorizedException('UNAUTHORIZED', 'UNAUTHORIZED');
    }
    try {
      const payload: any = verifyToken(
        token,
        this.configService.get('JWT_KEY'),
      );
      await this.userService.findByEmailOrPhoneNumber(payload.email_or_phone);
      request['account'] = payload;
      const language = request.headers.language;
      if (!language) request['language'] = payload.language;
    } catch (error) {
      if (error.message === 'jwt expired') {
        throw new UnauthorizedException(
          'Your login session has been expired. Please login again !',
          'TOKEN_EXPIRED',
        );
      }
      throw new UnauthorizedException('UNAUTHORIZED', 'UNAUTHORIZED');
    }

    return true;
  }
}

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  private readonly logger = new Logger(LocalAuthGuard.name);
  constructor(private authService: AuthService) {
    super();
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    this.logger.error(err, user, info);
    
    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    return user;
  }

  async canActivate(context: ExecutionContext) {
    const result = (await super.canActivate(context)) as boolean;
    const request = context.switchToHttp().getRequest();
    await super.logIn(request);

    return result;
  }
}

@Injectable()
export class RefreshJwtGuard extends AuthGuard('jwt-refresh') {
  private readonly logger = new Logger(RefreshJwtGuard.name);
  constructor(
    private configService: ConfigService,
    private readonly i18n: I18nService,
    private userService: UserService,
  ) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.body.refreshToken;
    try {
      const payload: any = verifyToken(
        token,
        this.configService.get('JWT_KEY'),
      );
      await this.userService.findByEmailOrPhoneNumber(payload.email_or_phone.toLowerCase());
      request['account'] = payload;
      const language = request.headers.language;
      if (!language) request['language'] = payload.language;
    } catch (error) {
      throw new UnauthorizedException('UNAUTHORIZED', 'UNAUTHORIZED');
    }

    return true;
  }
}

        ### 📄 src/utils/helper.ts
        > **Context Summary**
        * 𝑓 Functions: responseHelper, genFileName, genEndNameS3, isURL, isValidProductName...

        ```ts
        import { ERROR_INFO } from '../common/constant';
import * as lookup from "country-code-lookup";
import { BadRequestException } from '@nestjs/common';
import {BaseResDto} from "../common/base.dto";

/**
 * create common response object for application
 * @param data
 * @param metadata
 * @returns
 */
export function responseHelper<T>(
  data: T,
  success?: boolean,
  message?: string,
  code?: number,
): BaseResDto {
  const res = { code: 200, success: true, message: ERROR_INFO.SUCCESS, data: null };
  res.data = data;
  if (code) {
    res.code = code;
  }

  if (success) {
    res.success = success;
  }

  if (message) {
    res.message = message;
  }

  return res;
}

export function genFileName(name: string) {
  name = name.replaceAll(' ', '+');
  return Date.now() + '_' + Math.round(Math.random() * 1e9) + '_' + name;
}

export function genEndNameS3(name: string) {
  name = name.replaceAll(' ', '');
  name = name.replaceAll('+', '');
  name = name.replaceAll('%', '');
  name = name.replaceAll('*', '');
  return name;
}

export function isURL(str: string) {
  // Regular expression for a URL pattern
  str = str.split(' ').join('%20');
  const urlPattern = /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})(\/\S*)?$/i;
  // Test the string against the pattern
  return urlPattern.test(str);
}

export function isValidProductName(input: string): boolean {
  // Define the regular expression pattern
  const pattern = /^[\u4E00-\u9FA5a-zA-Z0-9()\/,_\-\s]*$/;

  // Test the input against the pattern
  return pattern.test(input);
}

export function convertToUpperCase(value: any): any {
  if (typeof value === 'string') {
    return value.toUpperCase();
  }
  // If it's not a string, just return the original value for numbers
  return value;
}
export function isImageUrl(url: any): any {
  // Get the file extension from the URL
  const extension = url.split('.').pop();

  // List of common image file extensions
  const imageExtensions = ['jpg', 'jpeg', 'png'];

  // Check if the extension is in the list of image extensions
  return imageExtensions.includes(extension.toLowerCase());
}

export function slugify(str: any) {
  return String(str)
    .normalize('NFKD') // split accented characters into their base characters and diacritical marks
    .replace(/[\đĐ]/g, 'd') // convert đ to d
    .replace(/[\u0300-\u036f]/g, '') // remove all the accents, which happen to be all in the \u03xx UNICODE block.
    .trim() // trim leading or trailing whitespace
    .toLowerCase() // convert to lowercase
    .replace(/[^a-z0-9 -]/g, '') // remove non-alphanumeric characters
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/-+/g, '-'); // remove consecutive hyphens
}

export function formatPrice(price: number, digits: number) {
  return !Number.isInteger(price) ? Number(price.toFixed(digits)) : price;
}

export const getPaginationResponse = (
  entities: any[],
  total: number,
  limit = 10,
  currentPage: number,
) => {
  return {
    entities,
    pagination: {
      total,
      current_page: currentPage,
      per_page: limit,
      last_page: Math.ceil(total / limit),
    },
  };
};

export const convertFromCountryToCountryCode = (country: any) => {
  try {
    const countryCode = lookup?.byCountry(country)?.internet;
    return countryCode || 'JP'
  } catch (error) {
    throw new BadRequestException('Your country is not exist')
  }
}

export const convertToArray = (value: any) => (Array.isArray(value) ? value : [value]);

export const splitLongStrings = (arr: any) => {
  const result = [];
  for (const str of arr) {
      if (str.length > 35) {
          let commaIndex = str.lastIndexOf(",");
          if (commaIndex === -1) {
              commaIndex = 35;
          }
          const firstPart = str.slice(0, commaIndex).trim();
          const secondPart = str.slice(commaIndex + 1).trim();
          result.push(firstPart, secondPart);
      } else {
          result.push(str);
      }
  }
  return result;
}

export const convertDate = (date: Date) => {
  return (
      date?.getFullYear() +
      '-' +
      ('0' + (date?.getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + date?.getDate()).slice(-2)
  );
};
        ### 📄 src/utils/multer.ts
        > **Context Summary**
        * (No structural elements detected)

        ```ts
        import { diskStorage } from 'multer';
import * as path from 'path';
import { genFileName } from 'src/utils';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { BadRequestException } from '@nestjs/common';
import * as process from 'process';
import { existsSync, mkdirSync } from 'fs';

export const uploadFile = (): MulterOptions => {
  return {
    storage: diskStorage({
      destination: (_, __, callback) => {
        // Synchronously retrieve the environment variable
        const destinationPath = process.env.UPLOADED_FILES_DESTINATION;

        if (!destinationPath) {
          return callback(
            new Error('UPLOADED_FILES_DESTINATION is not set'),
            '',
          );
        }

        // Ensure the destination directory exists
        if (!existsSync(destinationPath)) {
          mkdirSync(destinationPath, { recursive: true });
        }

        // Call the callback with the final destination path
        callback(null, destinationPath + '/avatar/');
      },
      filename: (req, file, callback) => {
        const originName = path.parse(file.originalname).name;
        const ext = path.extname(file.originalname);
        const filename = `${genFileName(originName)}${ext}`;
        callback(null, filename);
      },
    }),
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
    fileFilter(req, file, cb) {
      if (file.mimetype.match(/\/(jpg|jpeg)$/)) {
        cb(null, true);
      } else {
        cb(
          new BadRequestException(`Unsupported file type ${file.originalname}`),
          false,
        );
      }
    },
  };
};

export const uploadFileStorage = (folderName): MulterOptions => {
  return {
    storage: diskStorage({
      destination: (_, __, callback) => {
        // Synchronously retrieve the environment variable
        const destinationPath = process.env.FOLDER_UPLOADED_DESTINATION;

        if (!destinationPath) {
          return callback(
            new Error('FOLDER_UPLOADED_DESTINATION is not set'),
            '',
          );
        }

        // Ensure the destination directory exists
        if (!existsSync(destinationPath)) {
          mkdirSync(destinationPath, { recursive: true });
        }

        if (!existsSync(destinationPath + '/' + folderName)) {
          mkdirSync(destinationPath + '/' + folderName, { recursive: true });
        }

        // Call the callback with the final destination path
        callback(null, destinationPath + '/' + folderName);
      },
      filename: (req, file, callback) => {
        const originName = path.parse(file.originalname).name;
        const ext = path.extname(file.originalname);
        const filename = `${genFileName(originName)}${ext}`;
        callback(null, filename);
      },
    }),
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
    fileFilter(req, file, cb) {
      if (file.mimetype.match(/\/(png|jpg|jpeg)$/)) {
        cb(null, true);
      } else {
        cb(
          new BadRequestException(`Unsupported file type ${file.originalname}`),
          false,
        );
      }
    },
  };
};

        ### 📄 src/utils/utils.ts
        > **Context Summary**
        * 📦 Classes: Utils
* 𝑓 Functions: nowInMillis, now, nowInSeconds, IsNotEmptyString, IsTagsIn...

        ```ts
        import * as path from 'path';
import * as fs from 'fs';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { sign, verify } from 'jsonwebtoken';
import { TokenContent } from '../dtos/auth.dto';
import { ValidationArguments, ValidationOptions, isNotEmpty, isString, registerDecorator } from 'class-validator';
export const PASSWORD_SALT_ROUND = 12;
const iv = crypto.randomBytes(16)
export function nowInMillis(): number {
  return Date.now();
}

// Alias for nowInMillis
export function now(): number {
  return nowInMillis();
}

export function nowInSeconds(): number {
  return (nowInMillis() / 1000) | 0;
}
export class Utils {
  /**
   * replace &0, &1,... to input valuesß
   * @param orginSrc
   * @param args
   * @returns
   */
  static printString(orginSrc: string, args: string[] = []): string {
    if (args && args.length > 0) {
      return orginSrc.replace(
        new RegExp('([\\&\\d+]+)', 'g'),
        function (_unused, index) {
          return args[index.replace('&', '')];
        },
      );
    } else {
      return orginSrc;
    }
  }

  /**
   * check exist file in path
   * @param filePath
   * @returns absolute path of file
   */
  static getAbsoluteFilePath(filePath: string): string {
    let absFilePath: string = null;
    if (filePath) {
      if (fs.existsSync(path.join(__dirname, '../../' + filePath))) {
        absFilePath = path.join(__dirname, '../../' + filePath);
      }
    }
    return absFilePath;
  }

  static paginateResponse(
    data: [any[], number],
    options: { page: number; limit: number },
  ): { data: any; pagination: any } {
    const { page, limit } = options;
    const result = data?.[0];
    // record total
    let total = data?.[1];

    // record number on a page
    // let itemPage = 0;
    // current page number
    let currentPage = 0;
    // last page number
    let lastPage = 0;
    if (result && page <= 0) {
      // get all
      // itemPage = result.length;
      currentPage = 1;
    } else if (result && result.length) {
      // get by paginate and have data
      lastPage = Math.ceil(total / limit);
      // itemPage = result.length;
      currentPage = page;
    } else {
      // get by paginate and do data
      total = 0;
      currentPage = page;
    }

    return {
      data: [...result],
      pagination: {
        current_page: +currentPage,
        per_page: +limit,
        last_page: lastPage,
        total: total,
      },
    };
  }

  static dsmResponse(data: [any[], number]): { data: any; metadata: any } {
    const result = data?.[0];
    const total = data?.[1];

    return {
      data: [...result],
      metadata: {
        total: total,
      },
    };
  }

  /**
   * apply for raw data from databaseß
   * @param src
   * @param dest
   * @param alias
   * @returns
   */
  static convertFromRscToDestination = (src: any, dest: any, alias: string) => {
    if (!src) {
      throw new Error('The resource object is undefined');
    }
    if (!dest) {
      throw new Error('The destination object is undefined');
    }
    const keys = Object.keys(src);
    keys.forEach((item) => {
      const destKey = item.replace(`${alias}_`, '');
      dest[destKey] = src[item];
    });
    return dest;
  };

  /**
   *
   * @param object
   * @param fields
   * @returns
   */
  static omit = (object: any, fields: string[]) => {
    const keys = Object.keys(object);
    keys.forEach((item) => {
      if (fields.includes(item)) {
        delete object[item];
      }
    });
    return object;
  };

  /**
   *
   * @param len
   * @returns
   */
  static generatePassword(len: number): string {
    const length = len > 0 ? len : 6;
    const alphabetString = 'abcdefghijklmnopqrstuvwxyz';
    const numberString = '0123456789';
    let password = '';
    let character = '';
    while (password.length < length) {
      const index1 =
        Math.ceil(alphabetString.length * Math.random()) * Math.random();
      const index2 =
        Math.ceil(numberString.length * Math.random()) * Math.random();

      const hole = alphabetString.charCodeAt(index1);
      character += String.fromCharCode(hole);
      character += numberString.charCodeAt(index2);

      password = character;
    }
    password = password
      .split('')
      .sort(() => {
        return 0.5 - Math.random();
      })
      .join('');
    return password.substring(0, length);
  }

  /**
   * hash password for create account information
   * @param orgPassword
   * @returns
   */
  static hashPassword(orgPassword: string) {
    return bcrypt.hashSync(orgPassword, PASSWORD_SALT_ROUND);
  }

  /**
   * compare input password during login
   * @param orgPassword
   * @param encryptedPassword
   * @returns
   */
  static comparePassword(orgPassword: string, encryptedPassword: string) {
    return bcrypt.compareSync(orgPassword, encryptedPassword);
  }

  /**
   * read json file
   * @param filePath path of json filke
   * @returns object json
   */
  static readJsonFile(filePath: string) {
    if (!filePath) {
      throw new Error('Path of file is empty');
    }
    const ext = filePath.substring(
      filePath.lastIndexOf('.') + 1,
      filePath.length,
    );
    if (ext !== 'json') {
      throw new Error('This must not json file');
    }
    const absFilePath = Utils.getAbsoluteFilePath(filePath);
    const rawData = fs.readFileSync(absFilePath);
    return JSON.parse(rawData.toString());
  }

  static isContainNumber(givenString: string) {
    return /\d/.test(givenString);
  }
}

export const hashPassword = (orgPassword: string) => {
  const encryptedPass = bcrypt.hashSync(orgPassword, 10);
  return encryptedPass;
};
export const comparePassword = (orgPassword: string, hashPassword: string) => {
  return bcrypt.compareSync(orgPassword, hashPassword);
};
export const generateToken = (
  payload: TokenContent,
  expiresIn: string,
  secretKey: string,
) => {
  return sign(payload, secretKey, { expiresIn });
};
export const verifyToken = (token: string, secretKey: string) => {
  return verify(token, secretKey);
};

export const hashCrypt = async (text: string) => {
  const saltOrRounds = 10;
  const salt = await bcrypt.genSalt(saltOrRounds);
  return await bcrypt.hash(text, salt);
};

export const isLocal = () => {
  return process.env.APP_MODE == 'local';
};

export function IsNotEmptyString(validationOptions?: ValidationOptions) {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      name: 'isNotEmptyString',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate: (value: any): boolean => isString(value) && isNotEmpty(value.trim()),
        defaultMessage: (validationArguments?: ValidationArguments): string => `${validationArguments.property} should not be an empty string`
      }
    })
  }
}

export function IsTagsIn(validationOptions?: ValidationOptions) {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      name: 'IsTagsIn',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate: function (value: string): boolean {
          const allows = ['Hot Deals', 'Best Sellers', 'New Release'];
          const tags = value.split(';');
          for (let i = 0; i < tags.length; i++) {
            const tag = tags[i].trim();
            if (!allows.includes(tag)) {
              return false;
            }
          }
          return true;
        },
        defaultMessage: function (validationArguments?: ValidationArguments): string {
          const allows = ['Hot Deals', 'Best Sellers', 'New Release'];
          return `${validationArguments.property} should in ${allows.join(';')}`;
        }
      }
    })
  }
}

export function IsLabelsIn(validationOptions?: ValidationOptions) {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      name: 'IsLabelsIn',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate: function (value: string): boolean {
          const allows = ['Toys', 'Sealed', 'Graded', 'Japanese', 'English', 'Snacks', 'Supplies', 'Manga'];
          const labels = value.split(';');
          for (let i = 0; i < labels.length; i++) {
            const label = labels[i].trim();
            if (!allows.includes(label)) {
              return false;
            }
          }
          return true;
        },
        defaultMessage: function (validationArguments?: ValidationArguments): string {
          const allows = ['Toys', 'Sealed', 'Graded', 'Japanese', 'English', 'Snacks', 'Supplies', 'Manga'];
          return `${validationArguments.property} should in ${allows.join(';')}`;
        }
      }
    })
  }
}

export const encryptHashedEmail = async(hashedEmail: string): Promise<string> => {
  const keyHash = crypto.createHash('sha256').update(process.env.SECRET_KEY_CRYPT, 'utf8').digest('base64').substr(0, 32);
  const cipher = crypto.createCipheriv(process.env.ALGORITHM, Buffer.from(keyHash), iv);
  let encrypted = cipher.update(hashedEmail, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return encrypted;
}

export const decryptHashedEmail = async(encryptedHashedEmail: string): Promise<string> => {
  const keyHash = crypto.createHash('sha256').update(process.env.SECRET_KEY_CRYPT, 'utf8').digest('base64').substr(0, 32);
  const decipher = crypto.createDecipheriv(process.env.ALGORITHM, Buffer.from(keyHash), iv);
  let decrypted = decipher.update(encryptedHashedEmail, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
        ### 📄 src/utils/index.ts
        > **Context Summary**
        * (No structural elements detected)

        ```ts
        export * from './utils';
export * from './helper';

        ### 📄 src/utils/error.exception.ts
        > **Context Summary**
        * 📦 Classes: ExceptionError

        ```ts
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
          if (message.indexOf("quota") != -1) {
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

        ### 📄 src/schedules/payment.schedule.ts
        > **Context Summary**
        * 📦 Classes: PaymentSchedule

        ```ts
        import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { PaymentEntity } from 'src/entities/payment.entity';
import { CustomLogger } from 'src/services/logger.service';
import { PaymentService } from 'src/services/payment.service';
import { isLocal } from 'src/utils';
import { Connection, EntityManager, Repository } from 'typeorm';
import * as moment from 'moment';
import { PAYMENT_STATUS } from 'src/common/base.enum';
import { UserEntity } from 'src/entities/user.entity';
import { YoutubeService } from 'src/services/youtube.service';
import { DOWN_RANK, NUMBER_PAYMENT_ERROR, NUMBER_ZERO } from 'src/common/constant';
import { VideoEntity } from 'src/entities/video.entity';

@Injectable()
export class PaymentSchedule {
  constructor(
    @InjectRepository(PaymentEntity) private paymentEntity: Repository<PaymentEntity>,
    @InjectRepository(UserEntity) private userEntity: Repository<UserEntity>,
    @InjectRepository(VideoEntity)
    private videoEntity: Repository<VideoEntity>,
    private logger: CustomLogger,
    public paymentService: PaymentService,
    private youtubeService: YoutubeService,
    private readonly i18n: I18nService,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { disabled: isLocal() })
  async planWillExpireDate() {
    this.logger.log(`Cron success: Plan Will Expire Date`);
    const start = moment().format('YYYY-MM-DD 00:00:01');
    const end = moment().format('YYYY-MM-DD 23:59:59');
    const users = await this.userEntity
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.changeRank', 'changeRank')
    .leftJoinAndSelect('user.youtubeAccounts', 'youtubeAccounts')
    .where('user.expire_date >= :newDate', { newDate: `${end}`})
    .andWhere(`(user.level IS NOT NULL AND user.is_verify = true)`)
    .getMany();
    this.logger.log(`LOG BEFORE Cron success: ${start}-${end} Plan Will Expire Date end try`);
    for (const user of users) {
      await this.connection.transaction(
      async (manager: EntityManager) => {
        await this.handlePlanWillExpireDate(user, end)
      })
    }
    this.logger.log(`LOG2 Cron success: Plan Will Expire Date end try`);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { disabled: isLocal() })
  async userExpiredDate() {
    this.logger.log(`Cron success: User Expired Date`);
    const start = moment().format('YYYY-MM-DD 00:00:01');
    const end = moment().format('YYYY-MM-DD 23:59:59');
    const users = await this.userEntity
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.changeRank', 'changeRank')
    .leftJoinAndSelect('user.youtubeAccounts', 'youtubeAccounts')
    .where('user.expire_date < :newDate', { newDate: `${end}`})
    .andWhere(`(user.level IS NOT NULL AND user.is_verify = true)`)
    .getMany();
    this.logger.log(`LOG BEFORE Cron success: ${start}-${end} User Expired Date end try`);
    for (const user of users) {
      await this.connection.transaction(
      async (manager: EntityManager) => {
        await this.handleUserExpired(user)
      })
    }
    this.logger.log(`LOG2 Cron success: User Expired Date end try`);
  }
  
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { disabled: isLocal() })
  async deleteYoutubeVideo() {
    this.logger.log(`Cron success: Delete Youtube Video`);
    const formattedDate = moment().subtract(1, 'months').format('YYYY-MM-DD HH:mm:ss')
    await this.connection.transaction(
      async (manager: EntityManager) => {
        const deleteResult = await this.videoEntity
        .createQueryBuilder('video')
        .delete()
        .where('video.created_at < :oneMonthAgo', { oneMonthAgo: formattedDate  })
        .execute()
        this.logger.log(`LOG2 Cron success: Deleted ${deleteResult.affected} video(s)`)
      })
  }

  async handleUserExpired(user: any) {
    const userChange = await this.paymentService.findUserChangeMembershipRankById(user.id, false)
    const paymentPending = await this.paymentService.findOne( {status: PAYMENT_STATUS.PENDING, user_id: user.id} )
    if (paymentPending) {
      return
    }
    this.logger.log(`LOG handleUserExpired payment_before_deadline Cron success: ${user.id} - ${user?.payment_before_deadline}`)
    if (user?.payment_before_deadline) {
      const lastPayment = userChange?.payments?.shift()
      const rankChangeType = await this.checkRankDownOrRenew(user?.level, lastPayment?.rank)
      if (rankChangeType === DOWN_RANK) {
        //Down rank payment before deadline
        await this.paymentService.downRank(user)
      }
      await this.paymentService.updateUserWithRank(user.id, lastPayment)
      await this.paymentService.deleteChangeRank(user.id)
      await this.paymentService.resetNumberPaymentErr(user)
      await this.paymentService.resetPaymentBeforeDeadline(user)
      this.logger.log(`LOG handleUserExpired payment_before_deadline Cron success: UserId:${user.id}-paymentID:${lastPayment?.id}`)

      return
    }
    if (user?.changeRank) {
      //Renew with one month user have change rank
      await this.renewHaveOneMonth(user)
      //Cancel plan
      if (user?.changeRank?.change_rank == null || user?.changeRank?.change_rank == '') {
        await this.renewUserLevelNormal(user)
        await this.paymentService.deleteChangeRank(user.id)
        this.logger.log(`Cancel rank success: Cancel plan User Id ${user.id}`);

        return
      }
    }else{
      await this.renewHaveOneMonth(user)
    }
  }

  async handlePlanWillExpireDate(user: any, dateNow: any) {
    const userChange = await this.paymentService.findUserChangeMembershipRankById(user.id, false)
    const paymentPending = await this.paymentService.findOne({ status: PAYMENT_STATUS.PENDING, user_id: user.id })
    if (paymentPending) {
      return
    }
    let flagNotSendEmail: boolean = true
    if (user?.changeRank) {
      //Cancel plan
      if (user?.changeRank?.change_rank == null || user?.changeRank?.change_rank == '' || user?.payment_before_deadline) {
        this.logger.log(`Cancel rank will expire: Cancel plan User Id ${user.id}`);
        flagNotSendEmail = false
        return
      }
    }
    const dayDiff = await this.paymentService.dayDiff(dateNow, user.expire_date)
    if(dayDiff >= 0 && dayDiff <= 3 && flagNotSendEmail) {
      this.logger.log(`Cron success: Plan Will Expire Date Before Charge ${user.id}, ${userChange?.payments?.shift()?.id}`)
      if (user.number_payment_err != NUMBER_PAYMENT_ERROR) {
        await this.paymentService.paymentNumberErr(user)
        await this.paymentService.sendEmailUserExpiredDate(userChange, dayDiff)
      }
    }
  }

  async renewUserLevelNormal(user: any){
    await this.userEntity.update(user.id, { level: null, payment_date: null, expire_date: null, start_date: null, number_payment_err: NUMBER_ZERO, payment_before_deadline: false });
    await this.paymentService.deleteYtAccount(user.youtubeAccounts, [], user.id)
  }

  async renewHaveOneMonth(user: any){
    const dateRenew = new Date(user.expire_date);
    dateRenew.setDate(dateRenew.getDate() + 30);
    this.logger.log(`Cron success: Payment Expired Date ${user.id}`);
    if (dateRenew < new Date()) {
      this.logger.log(`Clear user expired one month renewHaveOneMonth ${user.id}`);
      await this.renewUserLevelNormal(user)
      await this.paymentService.deleteChangeRank(user.id)
      
      return
    }
  }

  async checkRankDownOrRenew(userRank: string, paymentRank: string) {
    const indexLevelUser = await this.paymentService.getIndexLevelUser(userRank)
    const indexRankOrder = await this.paymentService.getIndexLevelUser(paymentRank)

    return await this.paymentService.determineRankChange(indexLevelUser, indexRankOrder)
  }
}
        ### 📄 src/dtos/translate.dto.ts
        > **Context Summary**
        * 📦 Classes: ReqBodyDetectTranslateDto, ReqBodyTranslateDto, ReqBodyTranslateCaptionDto, translateRes

        ```ts
        import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, MaxLength } from 'class-validator';
import { BaseResDto } from 'src/common/base.dto';

export class ReqBodyDetectTranslateDto {
  @ApiProperty({ required: true })
  @IsOptional()
  text: string;
}

export class ReqBodyTranslateDto {
  @ApiProperty({ required: true })
  @IsOptional()
  @MaxLength(100)
  title: string;

  @ApiProperty({ required: true })
  @IsOptional()
  @MaxLength(5000)
  description: string;

  @ApiProperty({ required: true })
  @IsOptional()
  languages: [];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  exclude_titles?: [];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  exclude_descriptions?: [];
}
export class ReqBodyTranslateCaptionDto {
  @ApiProperty({ required: true })
  @IsOptional()
  @IsArray()
  captions?: [];

  @ApiProperty({ required: true })
  @IsOptional()
  languages: [];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  exclude_captions?: [];
}

export class translateRes extends BaseResDto {
  @ApiProperty({ type: ReqBodyTranslateDto })
  data: ReqBodyTranslateDto;
}


        ### 📄 src/dtos/youtube.dto.ts
        > **Context Summary**
        * 📦 Classes: YoutubeAccountContent, YoutubeAccountRes, SearchVideoReq, detailVideo, updateVideo, getCaptions, getDetailCaption, translationCaption, listAccount, refreshVideo, getVideoPushHistory, getLanguagesYoutube, getCaptionPushHistory

        ```ts
        import { ApiProperty } from '@nestjs/swagger';
import {BaseQueryReq, BaseResDto} from "../common/base.dto";
import {IsOptional, Max, Min, IsInt, IsEnum} from "class-validator";
import { Transform, Type } from 'class-transformer';
import {NUMBER_PAGE} from "../common/constant";
import {SORTBY} from "../common/base.enum";


export class YoutubeAccountContent {
  @ApiProperty()
  id: number;

  @ApiProperty()
  user_id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  name_channel: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  picture: string;

}

export class YoutubeAccountRes extends BaseResDto {
  @ApiProperty({ type: [YoutubeAccountContent] })
  data: YoutubeAccountContent[]
}

export class SearchVideoReq {
  @ApiProperty({ required: false })
  @IsOptional()
  text?: string;

  @ApiProperty({ required: true })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  youtube_account_id: number;

  @ApiProperty({ required: false })
  @IsOptional()
  page_token?: string;
}

export class detailVideo {
  @ApiProperty({ required: true })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  youtube_account_id: number;

  @ApiProperty({ required: true })
  @IsOptional()
  video_id: string;
}

export class updateVideo {
  @ApiProperty({ required: true })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  youtube_account_id: number;

  @ApiProperty({ required: true })
  @IsOptional()
  video_id: string;

  @ApiProperty({ required: true, description: 'json: [{"lang":"vi","title":"vi","description":"vi"},{"lang":"en","title":"en","description":"en"},{"lang":"sq","title":"sq","description":"sq"}]' })
  @IsOptional()
  localizations: string;

  @ApiProperty({ required: true })
  @IsOptional()
  default_lang: string;

  @ApiProperty({ required: false })
  @IsOptional()
  exclude_title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  exclude_description: string;

  @ApiProperty({ required: true })
  @IsOptional()
  category_id: string;
}

export class getCaptions {
  @ApiProperty({ required: true })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  youtube_account_id: number;

  @ApiProperty({ required: true })
  @IsOptional()
  video_id: string;
}

export class getDetailCaption {
  @ApiProperty({ required: true })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  youtube_account_id: number;

  @ApiProperty({ required: true })
  @IsOptional()
  video_id: string;

  @ApiProperty({ required: true })
  @IsOptional()
  default_lang: string;

  @ApiProperty({ required: true })
  @IsOptional()
  original_lang: string;
}

export class translationCaption {
  @ApiProperty({ required: true })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  youtube_account_id: number;

  @ApiProperty({ required: true })
  @IsOptional()
  video_id: string;

  @ApiProperty({ required: true })
  @IsOptional()
  lang: string;

  @ApiProperty({ required: true })
  @IsOptional()
  content: string;

  @ApiProperty({ required: false })
  @IsOptional()
  exclude_text: string;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  is_default_lang: boolean;
}

export class listAccount {
  @ApiProperty({ required: false })
  @Transform((params) => (params.value === '' ? NUMBER_PAGE.PAGE : +params.value))
  @IsOptional()
  page?: number = 1;

  @ApiProperty({ required: false })
  @Transform((params) => (params.value === '' ? NUMBER_PAGE.PAGE_SIZE : +params.value))
  @IsOptional()
  pageSize?: number = 10;

  @ApiProperty({ required: false, enum: SORTBY })
  @IsOptional()
  @IsEnum(SORTBY)
  sortBy?: SORTBY = SORTBY.asc;
}

export class refreshVideo {
  @ApiProperty({ required: true })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  youtube_account_id: number;
}

export class getVideoPushHistory {
  @ApiProperty({ required: true })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  youtube_account_id: number;

  @ApiProperty({ required: true })
  @IsOptional()
  video_id: string;
}

export class getLanguagesYoutube {
  @ApiProperty({ required: true })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  youtube_account_id: number;
}

export class getCaptionPushHistory {
  @ApiProperty({ required: true })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  youtube_account_id: number;

  @ApiProperty({ required: true })
  @IsOptional()
  video_id: string;
}
        ### 📄 src/dtos/file.dto.ts
        > **Context Summary**
        * 📦 Classes: FileReqDto, ReqBodyDto, fileReq

        ```ts
        import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class FileReqDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
  @ApiProperty({ required: false })
  file_url: any;
  @ApiProperty({ required: true })
  @IsNotEmpty({
    message: i18nValidationMessage('message.COMMON.REQUIRED'),
  })
  @IsNumber({}, { message: i18nValidationMessage('message.COMMON.NUMBER') })
  @Min(1, { message: i18nValidationMessage('message.COMMON.MIN_PAGINATION') })
  @Type(() => Number)
  limit: number;

  @ApiProperty({ required: true })
  @IsNotEmpty({
    message: i18nValidationMessage('message.COMMON.REQUIRED'),
  })
  @IsNumber({}, { message: i18nValidationMessage('message.COMMON.NUMBER') })
  @Min(1, { message: i18nValidationMessage('message.COMMON.MIN_PAGINATION') })
  @Type(() => Number)
  page: number;
}
export class ReqBodyDto {
  @ApiProperty({ required: true })
  link: string;
}
export class fileReq {
  @ApiProperty({ required: true })
  fileId: number;
}

        ### 📄 src/dtos/user.dto.ts
        > **Context Summary**
        * 📦 Classes: UserDto, SearchUserAdminReq, UserReqUpdate, UserCreateReq, PhoneOrEmail, UserContent, UserRes, UserResPaginate, ChangePasswordReq, ForgetPasswordReq, VerifyUserReq, VerifyForgetPasswordReq, VerifyForgetPasswordSmsReq, AuthVerifyByCode, AuthResetPasswordDto, ResendEmailReq, AccountReq, ChangePasswordByAdminReq

        ```ts
        import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  NotContains,
} from 'class-validator';
import { BaseQueryReq } from '../common/base.dto';
import { METHOD_VERIFY_USER, USERSORTFIELD } from '../common/base.enum';
import {BaseResDto, ResponseWithPagingDto} from "../common/base.dto";

export class UserDto extends BaseQueryReq {
  @ApiProperty({ required: false, enum: USERSORTFIELD })
  @IsOptional()
  @IsEnum(USERSORTFIELD)
  sortField?: string;
}

export class SearchUserAdminReq extends UserDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @MaxLength(200)
  search: string;

  @ApiProperty({ required: false })
  @IsOptional()
  filterUser?: string;
}

export class UserReqUpdate {
  @ApiProperty({ required: true })
  @IsOptional()
  @MaxLength(64)
  first_name: string;

  @ApiProperty({ required: true })
  @IsOptional()
  @MaxLength(64)
  last_name: string;

  @ApiProperty({ required: true })
  @IsOptional()
  @IsNumberString()
  @MaxLength(15)
  @IsNotEmpty({message: 'This field cannot be empty'})
  phone: string;

  @ApiProperty({ required: true })
  @IsOptional()
  phone_code: string;
}

export class UserCreateReq extends UserReqUpdate {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @NotContains(' ', { message: 'Password cannot contain “space” characters' })
  @Length(8)
  password: string;

  @ApiProperty()
  @IsBoolean()
  isVerify: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsNotEmpty()
  @IsNumberString()
  @MaxLength(15)
  phone: string;
}

export class PhoneOrEmail {
  phone?: string;
  email?: string;
}

class UserContent {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  first_name: string;

  @ApiProperty()
  last_name: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  level: string;
}

export class UserRes extends BaseResDto {
  @ApiProperty({ type: UserContent })
  data: UserContent;
}

export class UserResPaginate extends ResponseWithPagingDto {
  @ApiProperty({ type: [UserContent] })
  data: UserContent[];
}

export class ChangePasswordReq {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  currentPassword: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  newPassword: string;
}

export class ForgetPasswordReq {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({ required: true, enum: METHOD_VERIFY_USER, description: 'Email, Phone' })
  @IsNotEmpty()
  @IsString()
  @IsEnum(METHOD_VERIFY_USER)
  method?: string;
}

export class VerifyUserReq {
  @ApiProperty({ required: false })
  @IsString()
  email_or_phone: string;

  @ApiProperty({ required: false })
  @IsString()
  phone_code: string;
}

export class VerifyForgetPasswordReq {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  token: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  email: string;
}
export class VerifyForgetPasswordSmsReq {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ required: true })
  @IsString()
  phone_code: string;
}

export class AuthVerifyByCode {
  @ApiProperty()
  @IsString()
  code: string;

  @ApiProperty()
  @IsEmail()
  email: string;
}

export class AuthResetPasswordDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  code: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty({ required: false })
  @IsOptional()
  phone: string;

  @ApiProperty({ required: false })
  @IsOptional()
  phone_code: string;
  
  @ApiProperty({ required: true, enum: METHOD_VERIFY_USER, description: 'Email, Phone' })
  @IsNotEmpty()
  @IsString()
  @IsEnum(METHOD_VERIFY_USER)
  method?: string;
}

export class ResendEmailReq {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  email: string;
}

export class AccountReq {
  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsBoolean()
  isVerify: boolean;
}

export class ChangePasswordByAdminReq {
  @ApiProperty()
  @IsString()
  password: string;
}
        ### 📄 src/dtos/payment.dto.ts
        > **Context Summary**
        * 📦 Classes: PaymentContent, PaymentContentRes, CreatePaymentDto, MembershipReqDto, CapturePayment, DummyReqPaymentDto, QueryPayment

        ```ts
        import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { BaseQueryReq, BaseResDto } from 'src/common/base.dto';
import { LEVEL_USER } from 'src/common/base.enum';

class PaymentContent {
  @ApiProperty()
  user_id: number;

  @ApiProperty()
  rank: string;

  @ApiProperty()
  tax: number;

  @ApiProperty()
  sub_total: number;

  @ApiProperty()
  total: number;

  @ApiProperty()
  payment_status: string;
}

export class PaymentContentRes extends BaseResDto {
  @ApiProperty({ type: PaymentContent })
  data: PaymentContent;
}

export class CreatePaymentDto {
  @ApiProperty({ enum: LEVEL_USER })
  @IsEnum(LEVEL_USER)
  @IsOptional()
  rank?: string;

  @ApiProperty({ required: true, default: 0 })
  @IsNotEmpty()
  tax: number = 0;

  @ApiProperty({ required: true, default: 0 })
  @IsNotEmpty()
  sub_total: number = 0;

  @ApiProperty({ required: true, default: 0 })
  @IsNotEmpty()
  total: number = 0;
}

export class MembershipReqDto {
  @ApiProperty({ required: true })
  @IsArray()
  keep_yt_account_id?: [];

  @ApiProperty({ required: false })
  @IsOptional()
  new_rank: string;

  @ApiProperty({ required: false })
  @IsOptional()
  current_rank: string;
}

export class CapturePayment {
  @ApiProperty({ required: true })
  @IsString()
  order_id: string;

  @ApiProperty({ enum: LEVEL_USER })
  @IsEnum(LEVEL_USER)
  @IsOptional()
  rank?: string;

  @ApiProperty({ required: true, default: 0 })
  @IsNotEmpty()
  tax: number = 0;

  @ApiProperty({ required: true, default: 0 })
  @IsNotEmpty()
  sub_total: number = 0;

  @ApiProperty({ required: true, default: 0 })
  @IsNotEmpty()
  total: number = 0;
}

export class DummyReqPaymentDto {
  @ApiProperty({ required: true, description: '2024-08-27 23:59:59' })
  @IsOptional()
  date?: Date;
}

export class QueryPayment extends BaseQueryReq {}

        ### 📄 src/dtos/otp.dto.ts
        > **Context Summary**
        * 📦 Classes: OtpCreateDto, OtpCriteriaDto

        ```ts
        import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional } from 'class-validator';
import { OTPTYPE } from 'src/common/base.enum';

export class OtpCreateDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({ type: OTPTYPE })
  @IsEnum(OTPTYPE)
  type: OTPTYPE;

  is_resend?: boolean;
  token_verify?: string;
}

export class OtpCriteriaDto {
  @ApiProperty()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty()
  @IsOptional()
  code?: string;

  @ApiProperty({ type: OTPTYPE })
  @IsEnum(OTPTYPE)
  @IsOptional()
  type?: OTPTYPE;

  @ApiProperty()
  @IsOptional()
  is_resend?: boolean;
}

        ### 📄 src/dtos/auth.dto.ts
        > **Context Summary**
        * 📦 Classes: AuthDto, RefreshTokenReq, VerifyAccount, SignInRes, SignUpReq, SignUpRes

        ```ts
        import {ApiProperty, ApiResponseProperty} from '@nestjs/swagger';
import {IsEmail, IsNotEmpty, IsNumberString, IsOptional, IsString, Length, MaxLength, NotContains} from 'class-validator';

export class AuthDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  email_or_phone: string;

  @ApiProperty({ required: false })
  @IsOptional()
  phone_code: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @Length(8, 32)
  password: string;
}

export class RefreshTokenReq {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

export class VerifyAccount {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  id?: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  token?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @MaxLength(64)
  email?: string;
}

export class SignInRes {
  @ApiResponseProperty({ type: Number })
  id: number;

  @ApiResponseProperty({ type: String })
  access_token: string;

  @ApiResponseProperty({ type: String })
  name: string

  @ApiResponseProperty({ type: String })
  type: string

  @ApiResponseProperty({ type: String })
  email_or_phone: string

  @ApiResponseProperty({ type: String })
  refresh_token: string;
}

export class SignUpReq {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @MaxLength(64)
  first_name: string;

  @ApiProperty({ required: true })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  last_name: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(64)
  email: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @Length(8, 30)
  @IsNotEmpty({message: 'This field cannot be empty'})
  @NotContains(' ', { message: 'Password cannot contain space characters' })
  password: string;

  @ApiProperty({ required: true })
  @IsOptional()
  @IsNumberString()
  @MaxLength(15)
  @IsNotEmpty({message: 'This field cannot be empty'})
  phone: string;

  @ApiProperty({ required: true })
  @IsOptional()
  phone_code: string;
}

export class SignUpRes {
  @ApiResponseProperty({ type: Number })
  accountId: number;

  @ApiResponseProperty({ type: String })
  first_name: string;

  @ApiResponseProperty({ type: String })
  last_name: string;

  @ApiResponseProperty({ type: String })
  access_token: string;

  @ApiResponseProperty({ type: String })
  email: string;
}

export interface TokenContent {
  id?: number;
  email?: string;
  user_type?: string;
  key?: string;
  user_id?: number;
  language?: string;
  email_or_phone?: string;
}
        ### 📄 src/dtos/payment_card.dto.ts
        > **Context Summary**
        * 📦 Classes: PaymentCardContent, PaymentCardContentRes, CardMethodCreateDto, ParamPaginate, QueryCard

        ```ts
        import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { BaseResDto } from 'src/common/base.dto';

class PaymentCardContent {
  @ApiProperty()
  id: number;

  @ApiProperty()
  user_id: number;

  @ApiProperty()
  customer_id: string;

  @ApiProperty()
  token_card: string;
}

export class PaymentCardContentRes extends BaseResDto {
  @ApiProperty({ type: PaymentCardContent })
  data: PaymentCardContent;
}

export class CardMethodCreateDto {
  @ApiProperty()
  @IsOptional()
  card_id: string;

  customer_id?: string;
}

export class ParamPaginate {
  @ApiProperty({ required: false , description: "Default limit 10"})
  @IsOptional()
  limit?: number = 10;

  @ApiProperty({ required: false, description: "Value is token_card If 'starting_after' is provided, there will be no 'ending_before'." })
  @IsOptional()
  starting_after: string;

  @ApiProperty({ required: false , description: "Value is token_card If 'ending_before' is provided, there will be no 'starting_after'." })
  @IsOptional()
  ending_before: string;
}

export class QueryCard {
  @ApiProperty({ required: true })
  @IsOptional()
  card_id?: string;
}



        ### 📄 src/common/validation.body.input.ts
        > **Context Summary**
        * 📦 Classes: ValidationBodyPipe

        ```ts
        import { Injectable, ValidationPipe } from '@nestjs/common';
import { errorFatory } from './error';
@Injectable()
export class ValidationBodyPipe extends ValidationPipe {
  constructor() {
    super({
      transform: true,
    });
  }
  exceptionFactory = errorFatory([]);
}

        ### 📄 src/common/constant.ts
        > **Context Summary**
        * (No structural elements detected)

        ```ts
        import { Env } from "./enviroment";

export const NUMBER_PAGE = {
  PAGE_SIZE: 10,
  PAGE: 1,
};

export const CURRENCY = {
  JAPAN: 'JPY',
  VIETNAM: 'VND',
  ENGLISH: 'USD',
};

export enum LANGUAGE {
  ENGLISH = 'en',
  KOREAN = 'ko',
};

export const KEY_OBJECT = {
  PRODUCT: 'product',
};

export const VALIDATE_IMAGE = {
  IMAGE_SIZE: 2 * 1024 * 1024,
  IMAGE_TAIL: '.(png|jpeg|jpg)',
};

export const NUMBER_CONVERT_BIG_AMOUNT = 100
export const LIMIT_SECONDARY_IMAGE = 12;
export const ONE_HOUR = 60 * 60 * 1000; /* ms */
export const TWO_DAY = 48 * 60 * 60 * 1000; /* ms */
export const NUMBER_PAYMENT_ERROR = 4
export const NUMBER_ZERO = 0
export const DAYS_IN_YEAR = 365
export const INTENT_PAYMENT = "CAPTURE"
export const PAYPAL_CLIENT_KEY=Env.PAYPAL_CLIENT_KEY
export const PAYPAL_SECRET_KEY=Env.PAYPAL_SECRET_KEY
export const DOWN_RANK="DOWN"
export const RENEW_RANK="RENEW"
export const UP_RANK="UP"
export const AUTHENTICATION_RESULT = {
  ENROLLMENT_STATUS_Y: "Y",
  ENROLLMENT_STATUS_U: "U",
  AUTHENTICATION_STATUS_N: "N",
  AUTHENTICATION_STATUS_R: "R",
  AUTHENTICATION_STATUS_U: "U",
  AUTHENTICATION_STATUS_C: "C",
  LIABILITY_SHIFT_NO: "NO",
  LIABILITY_SHIFT_UNKNOWN: "UNKNOWN",
}

export const statusFile = {
  FAILED: 'Failed',
  PROCESSING: 'Processing',
  SUCCESS: 'Success',
};

export const statusJobImport = {
  PROCESSING: 'Processing',
  DONE: 'Done',
};

export const ERROR_RES = {
  INTERNAL_ERROR: {
    name: 'INTERNAL_ERROR',
    statusCode: 500,
  },
  NOT_FOUND_ERROR: {
    name: 'NOT_FOUND_ERROR',
    statusCode: 404,
  },
  CONFLICT_ERROR: {
    name: 'CONFLICT_ERROR',
    statusCode: 409,
  },
  EXPIRE_TOKEN_ERROR: {
    name: 'EXPIRE_TOKEN_ERROR',
    statusCode: 401,
  },
  VALIDATION_ERROR: {
    name: 'VALIDATION_ERROR',
    statusCode: 422,
  },
};
export const ERROR_TYPE = {
  VALIDATION: 'validation',
};
export const ERROR_INFO = {
  SUCCESS: 'SUCCESS',
  FAIL: 'FAIL',
};

export const STATUS_TRANSLATE = {
  DONE: 'DONE',
  PROCESSING: 'PROCESSING',
};

export const RULE_LEVEL_USER = [
  {
    level: 'Bronze',
    account: 1,
    lang: 12,
  },
  {
    level: 'Silver',
    account: 5,
    lang: 40,
  },
  {
    level: 'Gold',
    account: null,
    lang: null,
  }
];

export const CREDENTIALS_GG = {
  "type": Env.TYPE,
  "project_id": Env.PROJECT_ID,
  "private_key_id": Env.PRIVATE_KEY_ID,
  "private_key": Env.PRIVATE_KEY,
  "client_email": Env.CLIENT_EMAIL,
  "client_id": Env.CLIENT_ID,
  "auth_uri": Env.AUTH_URI,
  "token_uri": Env.TOKEN_URI,
  "auth_provider_x509_cert_url": Env.AUTH_PROVIDER_X509_CERT_URL,
  "client_x509_cert_url": Env.CLIENT_X509_CERT_URL,
  "universe_domain": Env.UNIVERSE_DOMAIN
}

export const CASH_RANK = {
  CASH_BRONZE: +Env.CASH_RANK_BRONZE,
  CASH_SILVER: +Env.CASH_RANK_SILVER,
  CASH_GOLD: +Env.CASH_RANK_GOLD,
}
        ### 📄 src/common/enviroment.ts
        > **Context Summary**
        * (No structural elements detected)

        ```ts
        require('dotenv').config();
const { env } = process;
const DB_USERNAME = env.DB_USERNAME;
const DB_PASSWORD = env.DB_PASSWORD;
const DB_NAME = env.DB_NAME;
const DB_HOST = env.DB_HOST;
const DB_PORT = env.DB_PORT;

const FRONTEND_URL = env.FRONTEND_URL || 'http://localhost:4200';
const PORT = env.PORT;

const JWT_SECRET_KEY = env.JWT_KEY;
const EXPIRE_TIME = env.EXPIRE_TIME;
const REFRESH_EXPIRE_TIME = env.REFRESH_EXPIRE_TIME;
const EMAIL_ADMIN = env.EMAIL_ADMIN;
const EMAIL_PASSWORD = env.EMAIL_PASSWORD;
const EMAIL_HOST = env.EMAIL_HOST;
const EMAIL_PORT = env.EMAIL_PORT;
const EMAIL_FROM = env.EMAIL_FROM;
const TYPE = env.TYPE
const PROJECT_ID = env.PROJECT_ID
const PRIVATE_KEY_ID = env.PRIVATE_KEY_ID
const PRIVATE_KEY = env.PRIVATE_KEY
const CLIENT_EMAIL = env.CLIENT_EMAIL
const CLIENT_ID = env.CLIENT_ID
const AUTH_URI = env.AUTH_URI
const TOKEN_URI = env.TOKEN_URI
const AUTH_PROVIDER_X509_CERT_URL = env.AUTH_PROVIDER_X509_CERT_URL
const CLIENT_X509_CERT_URL = env.CLIENT_X509_CERT_URL
const UNIVERSE_DOMAIN = env.UNIVERSE_DOMAIN
const CASH_RANK_BRONZE = env.CASH_RANK_BRONZE
const CASH_RANK_SILVER = env.CASH_RANK_SILVER
const CASH_RANK_GOLD = env.CASH_RANK_GOLD
const PAYPAL_CLIENT_KEY = env.PAYPAL_CLIENT_KEY
const PAYPAL_SECRET_KEY = env.PAYPAL_SECRET_KEY

export const Env = {
  DB_USERNAME,
  DB_PASSWORD,
  DB_NAME,
  DB_HOST,
  DB_PORT,
  FRONTEND_URL,
  PORT,
  JWT_SECRET_KEY,
  EXPIRE_TIME,
  REFRESH_EXPIRE_TIME,
  EMAIL_ADMIN,
  EMAIL_PASSWORD,
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_FROM,
  TYPE,
  PROJECT_ID,
  PRIVATE_KEY_ID,
  PRIVATE_KEY,
  CLIENT_EMAIL,
  CLIENT_ID,
  AUTH_URI,
  TOKEN_URI,
  AUTH_PROVIDER_X509_CERT_URL,
  CLIENT_X509_CERT_URL,
  UNIVERSE_DOMAIN,
  CASH_RANK_BRONZE,
  CASH_RANK_SILVER,
  CASH_RANK_GOLD,
  PAYPAL_CLIENT_KEY,
  PAYPAL_SECRET_KEY
};

        ### 📄 src/common/base.dto.ts
        > **Context Summary**
        * 📦 Classes: BaseResDto, SuccessContentDto, SuccessResDto, ResponsePaginateDto, ResponseWithPagingDto, BaseQueryReq

        ```ts
        import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import {Transform, Type} from "class-transformer";
import {NUMBER_PAGE} from "./constant";
import {
  IsArray,
  IsDefined,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min
} from "class-validator";
import {SORTBY} from "./base.enum";

export class BaseResDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty()
  code: number;
}

class SuccessContentDto {
  @ApiProperty()
  success: boolean;
}

export class SuccessResDto extends BaseResDto {
  @ApiProperty({ type: SuccessContentDto })
  data: SuccessContentDto;
}

export class ResponsePaginateDto {
  @ApiProperty()
  page: number;

  @ApiProperty()
  pageSize: number;

  @ApiProperty()
  total: number;

  @ApiProperty()
  pageCount: number;
}

export class ResponseWithPagingDto extends BaseResDto {
  @ApiProperty({ type: ResponsePaginateDto })
  pagination: BaseResDto;
}

export class BaseQueryReq {
  @ApiProperty({ required: false })
  @Transform((params) => (params.value === '' ? NUMBER_PAGE.PAGE : +params.value))
  @IsOptional()
  page?: number = 1;

  @ApiProperty({ required: false })
  @Transform((params) => (params.value === '' ? NUMBER_PAGE.PAGE_SIZE : +params.value))
  @IsOptional()
  pageSize?: number = 10;

  @ApiProperty({ required: false, enum: SORTBY })
  @IsOptional()
  @IsEnum(SORTBY)
  sortBy?: SORTBY = SORTBY.desc;

  @ApiProperty({ required: false })
  @IsOptional()
  sortField?: string;
}
        ### 📄 src/common/base.enum.ts
        > **Context Summary**
        * (No structural elements detected)

        ```ts
        export enum AccountType {
  NORMAL = 'NORMAL',
  ADMIN = 'ADMIN',
}

export enum LoginType {
  GOOGLE = 'GOOGLE',
  FACEBOOK = 'FACEBOOK',
  ACCOUNT = 'ACCOUNT',
}

export enum USERSORTFIELD {
  id = 'id',
  createdAt = 'createdAt',
  updatedAt = 'updatedAt',
}

export enum OTPTYPE {
  REGISTER = 'REGISTER',
  FORGOT_USERNAME = 'FORGOT_USERNAME',
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
  RESET_PASSWORD = 'RESET_PASSWORD',
  VERIFY_USER = 'VERIFY_USER',
}

export enum AGERANGE {
  U20 = '<20',
  F20T30 = '21-30',
  F31T40 = '31-40',
  F41T50 = '41-50',
  O51 = '>51',
}

export enum PAYMENT_STATUS {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
}

export enum ACTIVESTATUS {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum DISCOUNTTYPE {
  FREESHIP = 'freeship',
  PERCENT = 'percent',
  CASH = 'cash',
}

export enum UPPERCASESORTBY {
  DESC = 'DESC',
  ASC = 'ASC',
}

export enum SORTBY {
  desc = 'desc',
  asc = 'asc',
  DESC = 'DESC',
  ASC = 'ASC',
}

export enum COLLECTIONSTATUS {
  PUBLISH = 'publish',
  UNPUBLISH = 'unpublish',
}

export enum LANGUAGE {
  ENGLISH = 'en',
  KOREAN = 'ko',
}

export enum LEVEL_USER {
  BRONZE = 'Bronze',
  SILVER = 'Silver',
  GOLD = 'Gold',
}

export enum METHOD_VERIFY_USER {
  EMAIL = 'Email',
  PHONE_NUMBER = 'Phone',
}

export enum TYPE_TRANSLATE {
  VIDEO = 'Video',
  CAPTION = 'Caption',
};

export enum STATUS_TO_TRANSLATE {
  NEW = 'New',
  RETRANSLATE = 'Retranslate',
};

export enum PAYMENT_INTENT {
  CANCELED = 'canceled',
  PROCESSING = 'processing',
  REQUIRES_CAPTURE = 'requires_capture',
  REQUIRES_CONFIRMATION = 'requires_confirmation',
  REQUIRES_ACTION = 'requires_action',
  REQUIRES_PAYMENT_METHOD = 'requires_payment_method',
  SUCCEEDED = 'succeeded',
  CREATED = 'CREATED',
  SAVED = 'SAVED',
  APPROVED = 'APPROVED',
  VOIDED = 'VOIDED',
  COMPLETED = 'COMPLETED',
  PAYER_ACTION_REQUIRED = 'PAYER_ACTION_REQUIRED',
  DECLINED = 'DECLINED',
  PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED',
  PENDING = 'PENDING', 
  REFUNDED = 'REFUNDED',
  FAILED = 'FAILED'
}
        ### 📄 src/common/generation.xlsx.const.ts
        > **Context Summary**
        * (No structural elements detected)

        ```ts
        import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { HttpException, HttpStatus } from '@nestjs/common';
import { genFileName } from 'src/utils';
import { ConfigService } from '@nestjs/config';

export const PATH_DOWNLOADED_FILE = `uploads`;
export const SUPPORTED_FILES = ['csv', 'xlsx'];

export const multerConfig = {
  dest: process.env.UPLOADED_FILES_DESTINATION || './',
};

export const multerOptions = {
  limits: {
    fileSize: +process.env.MAX_FILE_SIZE || 1024 * 10 * 1024,
  },
  fileFilter: (req: any, file: any, cb: any) => {
    const ext: string = file.originalname.split('.').pop() || '';
    if (SUPPORTED_FILES.indexOf(ext?.toLowerCase()) !== -1) {
      cb(null, true);
    } else {
      cb(
        new HttpException(
          `Unsupported file type ${extname(file.originalname)}`,
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
  },
  storage: diskStorage({
    /* Destination storage path details */
    destination: (req: any, file: any, cb: any) => {
      const uploadPath =
        process.env.UPLOADED_FILES_DESTINATION + '/' + PATH_DOWNLOADED_FILE;
      /* Create folder if doesn't exist */
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath);
      }
      cb(null, uploadPath);
    },
    /* File modification details */
    filename: (req: any, file: any, cb: any) => {
      /* Calling the callback passing the random name generated with the original extension name */
      cb(null, `${genFileName(file.originalname)}`);
    },
  }),
};

        ### 📄 src/common/error.ts
        > **Context Summary**
        * 📦 Classes: ErrorObject, BaseError, InputValidationError, ConflictError

        ```ts
        import { ValidationError } from '@nestjs/common';
import { ERROR_RES } from './constant';

export class ErrorObject {
  property: string;
  message: string[];
}

export class BaseError implements Error {
  protected readonly isError: boolean = true;
  statusCode: number;
  messageCode: string;
  name: string;
  constraints: ErrorObject[];
  messageKey: string;
  messageContent = '';
  constructor(
    messageKey: string,
    name: string,
    statusCode: number,
    constraints?: ErrorObject[],
  ) {
    this.messageKey = messageKey;
    this.name = name;
    this.statusCode = statusCode;
    this.constraints = constraints;
  }
  message: string;
  stack?: string;
}

export class InputValidationError extends BaseError {
  constructor(message: string) {
    super(
      message,
      ERROR_RES['VALIDATION_ERROR'].name,
      ERROR_RES['VALIDATION_ERROR'].statusCode,
    );
  }
}

// validation
export const errorFatory = (constraints: ErrorObject[]) => {
  let arrConstraints = constraints;
  return (errors: ValidationError[]) => {
    arrConstraints = [];
    errors.forEach((item) => {
      const objErr = new ErrorObject();
      objErr.property = item.property;
      objErr.message = [];
      for (const key of Object.keys(item.constraints)) {
        objErr.message.push(item.constraints[key]);
      }
      arrConstraints.push(objErr);
    });
    return new InputValidationError(
      'message.MESSAGE.ERROR.REQUEST_BODY_VALIDATION',
    );
  };
};
export class ConflictError extends BaseError {
  constructor(messageKey: string) {
    super(
      messageKey,
      ERROR_RES['CONFLICT_ERROR'].name,
      ERROR_RES['CONFLICT_ERROR'].statusCode,
    );
  }
}

        ### 📄 src/i18n/ko/error.json
        > **Context Summary**
        * (No structural elements detected)

        ```json
        {
  "DATA_NOT_FOUND": "Data Not Found",
  "DATA_PAYMENT_INCORRECT": "Data Payment Is Incorrect",
  "USER_LEVEL_NOT_FOUND": "User level not found.",
  "EMAIL_OR_PHONE_NOT_EXIST": "Email or Phone Number does not exist. Please try again!",
  "EMAIL_NOT_EXIST": "Email does not exist. Please try again!",
  "USER_NOT_FOUND": "User Not Found",
  "INVALID_EMAIL": "Can not login with this email",
  "VERIFY_EMAIL": "This account hasn’t been verified. Please verify your account within 48h. Without the verification, your account will be deleted.",
  "WRONG_PASS_LOGIN": "Incorrect password. Please try again.",
  "EMAIL_TAKEN": "This email existed. Please use another email address.",
  "PHONE_TAKEN": "This number has been used. Please enter another phone number",
  "USER_TAKEN": "This username has been taken",
  "UNAUTHORIZED": "Unauthorized",
  "NOT_ENOUGH_TIME_30S": "Please try again in 30s",
  "EMAIL_INFO_INVALID": "Your account hasn’t been verified yet. Please verify to continue!",
  "IMAGE_SIZE": "The image size cannot exceed 2MB.",
  "ACCESS_DENIED": "Access Denied",
  "CARD_NUMBER_EXIST": "Card is existed. Try another!!!",
  "BAD_REQUEST_EXCEPTION": "Something went wrong or data was invalid",
  "NUMBER_USED_NOT_VERIFIED": "This number has been used but not verified yet.",
  "EMAIL_EXISTED_NOT_VERIFIED": "This email existed but not verified yet.",
  "LIMIT_CARD": "Card addition limit has been reached",
  "PAYMENT_PENDING_PROCESS": "Your payment is pending, please wait for processing.",
  "ADD_CARD_ERR": "This card is not supported. Please try another card!",
  "PHONE_NOT_EXIST": "Phone number does not exist. Please try again!",
  "MISSING_API_CREDENTIALS": "Incorrect API credentials",
  "FAILED_GENERATE_ACCESS_TOKEN": "Failed to generate PayPal access token",
  "FAILED_GENERATE_CLIENT_TOKEN": "Failed to generate client token from PayPal",
  "UNAVAILABLE_ACTION": "This action is currently unavailable because you have already paid for the next plan. Please try again after the current plan ends!"
}
        ### 📄 src/i18n/ko/success.json
        > **Context Summary**
        * (No structural elements detected)

        ```json
        {
  "UPDATE_PASS_SUCCESS": "Update password successfully",
  "ADD_CARD_SUCCESS": "Add card successfully",
  "DELETE_CARD_SUCCESS": "Delete card successfully",
  "FINISHED_TRANSLATING": "Finished translating",
  "PAYMENT_SUCCESS": "Payment successfully",
  "SUCCESS": "Successfully",
  "SET_CARD_DEFAULT": "This card has been marked as default"
}
        ### 📄 src/i18n/en/error.json
        > **Context Summary**
        * (No structural elements detected)

        ```json
        {
  "DATA_NOT_FOUND": "Data Not Found",
  "DATA_PAYMENT_INCORRECT": "Data Payment Is Incorrect",
  "USER_LEVEL_NOT_FOUND": "User level not found.",
  "EMAIL_OR_PHONE_NOT_EXIST": "Email or Phone Number does not exist. Please try again!",
  "EMAIL_NOT_EXIST": "Email does not exist. Please try again!",
  "USER_NOT_FOUND": "User Not Found",
  "INVALID_EMAIL": "Can not login with this email",
  "VERIFY_EMAIL": "This account hasn’t been verified. Please verify your account within 48h. Without the verification, your account will be deleted.",
  "WRONG_PASS_LOGIN": "Incorrect password. Please try again.",
  "EMAIL_TAKEN": "This email existed. Please use another email address.",
  "PHONE_TAKEN": "This number has been used. Please enter another phone number",
  "USER_TAKEN": "This username has been taken",
  "UNAUTHORIZED": "Unauthorized",
  "NOT_ENOUGH_TIME_30S": "Please try again in 30s",
  "EMAIL_INFO_INVALID": "Your account hasn’t been verified yet. Please verify to continue!",
  "IMAGE_SIZE": "The image size cannot exceed 2MB.",
  "ACCESS_DENIED": "Access Denied",
  "CARD_NUMBER_EXIST": "Card is existed. Try another!!!",
  "BAD_REQUEST_EXCEPTION": "Something went wrong or data was invalid",
  "NUMBER_USED_NOT_VERIFIED": "This number has been used but not verified yet.",
  "EMAIL_EXISTED_NOT_VERIFIED": "This email existed but not verified yet.",
  "LIMIT_CARD": "Card addition limit has been reached",
  "PAYMENT_PENDING_PROCESS": "Your payment is pending, please wait for processing.",
  "ADD_CARD_ERR": "This card is not supported. Please try another card!",
  "PHONE_NOT_EXIST": "Phone number does not exist. Please try again!",
  "MISSING_API_CREDENTIALS": "Incorrect API credentials",
  "FAILED_GENERATE_ACCESS_TOKEN": "Failed to generate PayPal access token",
  "FAILED_GENERATE_CLIENT_TOKEN": "Failed to generate client token from PayPal",
  "UNAVAILABLE_ACTION": "This action is currently unavailable because you have already paid for the next plan. Please try again after the current plan ends!",
  "FAILED": "There was an error while capturing payment.",
  "AUTHORIZATION_3D_SECURE": "Authorization Error. Please contact your card issuer or try again with your Paypal Wallet."
}
        ### 📄 src/i18n/en/success.json
        > **Context Summary**
        * (No structural elements detected)

        ```json
        {
  "UPDATE_PASS_SUCCESS": "Update password successfully",
  "ADD_CARD_SUCCESS": "Add card successfully",
  "DELETE_CARD_SUCCESS": "Delete card successfully",
  "FINISHED_TRANSLATING": "Finished translating",
  "PAYMENT_SUCCESS": "Payment successfully",
  "SUCCESS": "Successfully",
  "SET_CARD_DEFAULT": "This card has been marked as default",
  "COMPLETED_PAYMENT": "The funds for this captured payment were credited to the payee's PayPal account.",
  "DECLINED_PAYMENT": "The funds could not be captured.",
  "PARTIALLY_REFUNDED_PAYMENT": "An amount less than this captured payment's amount was partially refunded to the payer.",
  "PENDING_PAYMENT": "The funds for this captured payment was not yet credited to the payee's PayPal account.",
  "REFUNDED_PAYMENT": "An amount greater than or equal to this captured payment's amount was refunded to the payer."
}
        ### 📄 src/modules/mail.module.ts
        > **Context Summary**
        * 📦 Classes: MailModule

        ```ts
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

        ### 📄 src/modules/user.module.ts
        > **Context Summary**
        * 📦 Classes: UserModule

        ```ts
        import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { UserService } from '../services/user.service';
import { UserController } from '../controllers/user.controller';
import { AuthModule } from './auth.module';
import { TokenEntity } from 'src/entities/token-key.entity';
import { FileModule } from './file.module';
import { MailModule } from 'src/modules/mail.module';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      TokenEntity,
    ]),
    AuthModule,
    FileModule,
    MailModule
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}

        ### 📄 src/modules/payment.module.ts
        > **Context Summary**
        * 📦 Classes: PaymentModule

        ```ts
        import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth.module';
import {YoutubeAccountEntity} from "../entities/youtube-account.entity";
import {UserEntity} from "../entities/user.entity";
import { HttpModule} from '@nestjs/axios';
import {CustomLogger} from "../services/logger.service";
import { PaymentController } from 'src/controllers/payment.controller';
import { PaymentService } from 'src/services/payment.service';
import { PaymentEntity } from 'src/entities/payment.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { PaymentSchedule } from 'src/schedules/payment.schedule';
import { YoutubeService } from 'src/services/youtube.service';
import { CaptionEntity } from 'src/entities/caption.entity';
import { VideoEntity } from 'src/entities/video.entity';
import { VideoPushEntity } from 'src/entities/video-push.entity';
import { ChangeRankEntity } from 'src/entities/change_rank.entity';
import { CaptionPushEntity } from 'src/entities/caption-push.entity';
import { MailService } from 'src/services/mail.service';
import { PaymentWebhookController } from 'src/controllers/payment-webhook.controller';

@Global()
@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
      YoutubeAccountEntity,
      UserEntity,
      PaymentEntity,
      CaptionEntity,
      VideoEntity,
      VideoPushEntity,
      ChangeRankEntity,
      CaptionPushEntity
    ]),
    AuthModule,
    ScheduleModule.forRoot()
  ],
  providers: [PaymentService, CustomLogger, PaymentSchedule, YoutubeService, MailService],
  controllers: [PaymentController, PaymentWebhookController],
})
export class PaymentModule {}

        ### 📄 src/modules/opt.module.ts
        > **Context Summary**
        * 📦 Classes: OtpModule

        ```ts
        import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpEntity } from 'src/entities/otp.entity';
import { OptService } from '../services/otp.service';

@Module({
  imports: [TypeOrmModule.forFeature([OtpEntity])],
  providers: [OptService],
  exports: [OptService],
})
export class OtpModule {}

        ### 📄 src/modules/file.module.ts
        > **Context Summary**
        * 📦 Classes: FileModule

        ```ts
        import { Module } from '@nestjs/common';
import { FileService } from '../services/file.service';
import { FileController } from '../controllers/file.controller';

@Module({
  providers: [FileService],
  exports: [FileService],
  controllers: [FileController],
})
export class FileModule {}

        ### 📄 src/modules/youtube.module.ts
        > **Context Summary**
        * 📦 Classes: YoutubeModule

        ```ts
        import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth.module';
import {YoutubeAccountEntity} from "../entities/youtube-account.entity";
import {CaptionEntity} from "../entities/caption.entity";
import {YoutubeService} from "../services/youtube.service";
import {YoutubeController} from "../controllers/youtube.controller";
import {UserService} from "../services/user.service";
import {UserEntity} from "../entities/user.entity";
import {MailService} from "../services/mail.service";
import { HttpModule} from '@nestjs/axios';
import {CustomLogger} from "../services/logger.service";
import {YoutubeCallBackController} from "../controllers/youtubeCallBack.controller";
import {VideoEntity} from "../entities/video.entity";
import {VideoPushEntity} from "../entities/video-push.entity";
import {CaptionPushEntity} from "../entities/caption-push.entity";
import {TranslateGoogleService} from "../services/translateGoogle.service";

@Global()
@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
      YoutubeAccountEntity,
      CaptionEntity,
      VideoEntity,
      VideoPushEntity,
      CaptionPushEntity,
      UserEntity
    ]),
    AuthModule,
  ],
  providers: [YoutubeService, UserService, MailService, CustomLogger, TranslateGoogleService],
  controllers: [YoutubeController, YoutubeCallBackController],
  exports: [YoutubeService],
})
export class YoutubeModule {}

        ### 📄 src/modules/translateGoogle.module.ts
        > **Context Summary**
        * 📦 Classes: TranslateGoogleModule

        ```ts
        import { Module } from '@nestjs/common';
import { TranslateGoogleService } from 'src/services/translateGoogle.service';
import { TranslateGoogleController } from 'src/controllers/translateGoogle.controller';
import { FileService } from 'src/services/file.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { YoutubeService } from 'src/services/youtube.service';
import { YoutubeAccountEntity } from 'src/entities/youtube-account.entity';
import { CaptionEntity } from 'src/entities/caption.entity';
import { VideoEntity } from 'src/entities/video.entity';
import { VideoPushEntity } from 'src/entities/video-push.entity';
import { UserEntity } from 'src/entities/user.entity';
import { HttpModule } from '@nestjs/axios';
import { MailService } from 'src/services/mail.service';
import { CustomLogger } from '../services/logger.service';
import {CaptionPushEntity} from "../entities/caption-push.entity";

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
      YoutubeAccountEntity,
      CaptionEntity,
      VideoEntity,
      VideoPushEntity,
      CaptionPushEntity,
      UserEntity,
    ]),
  ],
  providers: [
    TranslateGoogleService,
    YoutubeService,
    FileService,
    MailService,
    CustomLogger,
  ],
  exports: [TranslateGoogleService],
  controllers: [TranslateGoogleController],
})
export class TranslateGoogleModule {}

        ### 📄 src/modules/logger.module.ts
        > **Context Summary**
        * 📦 Classes: LoggerModule

        ```ts
        import { Module } from '@nestjs/common';
import { CustomLogger } from '../services/logger.service';

@Module({
  providers: [CustomLogger],
  exports: [CustomLogger],
})
export class LoggerModule {}

        ### 📄 src/modules/auth.module.ts
        > **Context Summary**
        * 📦 Classes: AuthModule

        ```ts
        import { Module } from '@nestjs/common';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { OtpModule } from './opt.module';
import { TokenEntity } from 'src/entities/token-key.entity';
import { TokenService } from '../services/token.service';
import { FileService } from '../services/file.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  AuthJwtStrategy,
  RefreshJwtStrategy,
} from 'src/strategy/auth-jwt.strategy';
import { LocalStrategy } from 'src/strategy/local-strategy';
import { MailModule } from 'src/modules/mail.module';
import { SessionSerializer } from './serializer/session.serializer';
import { CustomLogger } from 'src/services/logger.service';
import { SmsService } from 'src/services/sms.service';
import {OtpEntity} from "../entities/otp.entity";
import { FirebaseService } from 'src/services/firebase.service';

@Module({
  imports: [
    MailModule,
    HttpModule,
    TypeOrmModule.forFeature([UserEntity, TokenEntity, OtpEntity]),
    OtpModule,
    PassportModule.register({
      session: true,
      secret: '234234234234',
      resave: false,
      saveUninitialized: false,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secretOrPrivateKey: configService.get('JWT_KEY'),
        signOptions: {
          expiresIn: configService.get('EXPIRE_TIME_JWT'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenService,
    FileService,
    AuthJwtStrategy,
    LocalStrategy,
    RefreshJwtStrategy,
    SessionSerializer,
    SmsService,
    CustomLogger,
    FirebaseService,
  ],
  exports: [AuthService, TokenService, FileService, JwtModule, PassportModule],
})
export class AuthModule {}

        ### 📄 src/modules/serializer/session.serializer.ts
        > **Context Summary**
        * 📦 Classes: SessionSerializer

        ```ts
        import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  //serialize user
  serializeUser(user: any, done: (err: Error, user: any) => void): any {
    done(null, user);
  }
  //deserialize user
  deserializeUser(
    payload: any,
    done: (err: Error, payload: string) => void,
  ): any {
    done(null, payload);
  }
}

        ### 📄 src/controllers/youtube.controller.ts
        > **Context Summary**
        * 📦 Classes: YoutubeController

        ```ts
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

        ### 📄 src/controllers/auth.controller.ts
        > **Context Summary**
        * 📦 Classes: AuthController

        ```ts
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

        ### 📄 src/controllers/translateGoogle.controller.ts
        > **Context Summary**
        * 📦 Classes: TranslateGoogleController

        ```ts
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

        ### 📄 src/controllers/file.controller.ts
        > **Context Summary**
        * 📦 Classes: FileController

        ```ts
        /* eslint-disable no-unused-vars */
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseInterceptors,
  Res,
  Param,
  BadRequestException,
  UploadedFiles,
} from '@nestjs/common';
import { FileService } from '../services/file.service';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { genFileName, responseHelper } from 'src/utils';
import { ConfigService } from '@nestjs/config';
import { FileReqDto } from '../dtos/file.dto';
import { Response } from 'express';
import * as process from 'process';
import { existsSync, mkdirSync } from 'fs';
import { log } from "winston";

@Controller('files')
@ApiTags('File')
export class FileController {
  constructor(
    private fileService: FileService,
    private configService: ConfigService,
  ) {}

  @Get('')
  async getFiles(@Query('folder') folder: string) {
    return this.fileService.getFiles(folder);
  }

  @Post('/upload')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'files', maxCount: 6 }], {
      storage: diskStorage({
        destination: (_, __, callback) => {
          // Synchronously retrieve the environment variable
          const destinationPath = process.env.UPLOADED_FILES_DESTINATION;

          if (!destinationPath) {
            return callback(
              new Error('UPLOADED_FILES_DESTINATION is not set'),
              '',
            );
          }

          // Ensure the destination directory exists
          if (!existsSync(destinationPath)) {
            mkdirSync(destinationPath, { recursive: true });
          }

          // Call the callback with the final destination path
          callback(null, destinationPath + '/image/');
        },
        filename: (req, file, callback) => {
          const originName = path.parse(file.originalname).name;
          const ext = path.extname(file.originalname);
          const filename = `${genFileName(originName)}${ext}`;
          callback(null, filename);
        },
      }),
      limits: {
        fileSize: 30 * 1024 * 1024,
      },
      fileFilter(req, file, cb) {
        if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          // Allow storage of file
          cb(null, true);
        } else {
          // Reject file
          cb(
            new BadRequestException(
              `Unsupported file type ${file.originalname}`,
            ),
            false,
          );
        }
      },
    }),
  )
  async uploadFile(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: FileReqDto,
  ) {
    if (files) {
      const files_arr = Object.values(files)[0] as any;
      const images = [];
      if (files && files_arr) {
        for (let i = 0; i < files_arr.length; i++) {
          const file = files_arr[i];
          const imageUrl =
            this.configService.get('APP_DOMAIN') +
            'files/image/' +
            file.filename;
          images.push(String(imageUrl));
        }
      }
      body.file = images;

      return body.file;
    } else {
      return responseHelper<any>('Error');
    }
  }

  @Get('/:direct')
  async resImage(@Res() res: Response, @Param('direct') direct: string) {
    // return res.send(fs.readFileSync('image/' + direct));
    return res.sendFile(
      path.join(
        this.configService.get('UPLOADED_FILES_DESTINATION') +
          '/avatar/' +
          direct,
      ),
    );
  }

  @Get('/uploads/:file')
  async resFile(@Res() res: Response, @Param('file') file: string) {
    return res.sendFile(
      path.join(
        this.configService.get('UPLOADED_FILES_DESTINATION') +
          '/uploads/' +
          file,
      ),
    );
  }

  @Get('/image/:file')
  async resFileImage(@Res() res: Response, @Param('file') file: string) {
    const filePath = path.join(
      this.configService.get('UPLOADED_FILES_DESTINATION'), // Use path.join to construct the absolute path
      'image',
      file,
    );

    return res.sendFile(filePath);
  }
}

        ### 📄 src/controllers/user.controller.ts
        > **Context Summary**
        * 📦 Classes: UserController

        ```ts
        import {
  Body,
  Controller,
  Get,
  Put,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { AuthenUserGuard, AuthJwtUserGuard } from 'src/utils/guard';
import { ChangePasswordReq, UserReqUpdate, UserRes } from '../dtos/user.dto';
import { responseHelper } from 'src/utils';
import { SuccessResDto } from 'src/common/base.dto';

@ApiTags('User')
@Controller('/user')
@ApiBearerAuth()
@UseGuards(AuthJwtUserGuard)
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class UserController {
  constructor(
    private userService: UserService
  ) {}

  @Get('/detail')
  @ApiOperation({ summary: 'User detail' })
  @ApiOkResponse({ type: UserRes })
  async getUserDetail(@Request() req: { account: { user_id :number } }) {
    return responseHelper(await this.userService.findById(+req.account.user_id));
  }

  @Put('/update')
  @ApiOkResponse({ type: UserRes })
  @ApiOperation({ summary: 'User update' })
  async updateUser(
    @Request() req: { account: { user_id :number } },
    @Body() body: UserReqUpdate,
  ) {
    const user = await this.userService.findById(+req.account.user_id);
    return responseHelper( await this.userService.updateUser(user.id, body) );
  }

  @Put('/change-password')
  @ApiOperation({ summary: 'User change password' })
  @ApiOkResponse({ type: SuccessResDto })
  async changePassword(
    @Request() req: { account: { user_id :number } },
    @Body() body: ChangePasswordReq,
  ) {
    await this.userService.changePassword(
      req.account.user_id,
      body.currentPassword,
      body.newPassword,
    );
    return responseHelper( true );
  }
}

        ### 📄 src/controllers/mail.controller.ts
        > **Context Summary**
        * 📦 Classes: MailController

        ```ts
        import { Controller } from '@nestjs/common';

@Controller('mail')
export class MailController {}

        ### 📄 src/controllers/payment.controller.ts
        > **Context Summary**
        * 📦 Classes: PaymentController

        ```ts
        import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { IncomingHttpHeaders } from 'http';
import { I18nService } from 'nestjs-i18n';
import { CapturePayment, CreatePaymentDto, DummyReqPaymentDto, PaymentContentRes, QueryPayment } from 'src/dtos/payment.dto';
import { PaymentService } from 'src/services/payment.service';
import { responseHelper } from 'src/utils';
import { AuthJwtUserGuard } from 'src/utils/guard';
import { MembershipReqDto } from '../dtos/payment.dto';
import { NUMBER_PAGE } from 'src/common/constant';
import { SORTBY } from 'src/common/base.enum';

@ApiTags('Payment')
@Controller('/user')
@ApiBearerAuth()
@UseGuards(AuthJwtUserGuard)
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class PaymentController {
  constructor(
    private paymentService: PaymentService,
    private readonly i18n: I18nService,
  ) {}

  @Get('')
  @ApiOperation({ summary: 'Payment List' })
  @ApiOkResponse({ type: PaymentContentRes })
  async list(
    @Query() query: QueryPayment,
    @Request()
    req: { account: { user_id: number }; headers: IncomingHttpHeaders },
  ) {
    query.page = query.page || NUMBER_PAGE.PAGE;
    query.pageSize = query.pageSize || NUMBER_PAGE.PAGE_SIZE;
    query.sortField = query.sortField || 'id';
    query.sortBy = (query.sortBy.toLocaleUpperCase() as SORTBY) || SORTBY.desc;
    const lang = req.headers['language'] as string;

    const { payments, total } = await this.paymentService.listPayment(query, +req.account.user_id);
    return responseHelper({
      payments,
      pagination: {
        total,
        last_page: Math.ceil(total / +query.pageSize),
        per_page: query.pageSize,
        current_page: query.page,
      },
    });
  }

  @Post('/payment-order-paypal')
  @ApiOperation({ summary: 'Payment order' })
  @ApiOkResponse({ type: PaymentContentRes })
  async paymentPaypal(
    @Body() body: CreatePaymentDto,
    @Request()
    req: { account: { user_id: number }; headers: IncomingHttpHeaders },
  ) {
    const lang = req.headers['language'] as string;

    return responseHelper(
      await this.paymentService.createOrder(body, +req.account.user_id),
      true,
      this.i18n.t('success.PAYMENT_SUCCESS', { lang }),
    );
  }

  @Post('/payment-capture-paypal')
  @ApiOperation({ summary: 'Payment capture' })
  @ApiOkResponse({ type: PaymentContentRes })
  async paymentCapturePaypal(
    @Body() body: CapturePayment,
    @Request()
    req: { account: { user_id: number }; headers: IncomingHttpHeaders },
  ) {
    const lang = req.headers['language'] as string;

    return responseHelper(
      await this.paymentService.capturePayment(body, +req.account.user_id),
      true,
      this.i18n.t('success.PAYMENT_SUCCESS', { lang }),
    );
  }

  @Get('/detail-order/:id')
  @ApiOperation({ summary: 'Payment detail paypal' })
  @ApiOkResponse()
  async generateClientToken(
    @Param('id') id: string,
    @Request()
    req: { account: { user_id: number }; headers: IncomingHttpHeaders },
  ) {
    const lang = req.headers['language'] as string;

    return responseHelper(
      await this.paymentService.orderDetail(id),
      true,
      this.i18n.t('success.PAYMENT_SUCCESS', { lang }),
    );
  }

  @Post('/detail/:id')
  @ApiOperation({ summary: 'Detail Payment' })
  @ApiOkResponse({ type: PaymentContentRes })
  async detail(
    @Param('id') id: number,
    @Request()
    req: { account: { user_id: number }; headers: IncomingHttpHeaders },
  ) {
    await this.paymentService.findById(id);
    const lang = req.headers['language'] as string;

    return responseHelper(
      true,
      true,
      this.i18n.t('success.SUCCESS', { lang }),
    );
  }

  @Post('/payment/membership')
  @ApiOperation({ summary: 'Membership Payment' })
  @ApiOkResponse({ type: PaymentContentRes })
  async membership(
    @Body() body: MembershipReqDto,
    @Request()
    req: { account: { user_id: number }; headers: IncomingHttpHeaders },
  ) {
    await this.paymentService.changeMembershipRank(body, +req.account.user_id);
    const lang = req.headers['language'] as string;

    return responseHelper(
      true,
      true,
      this.i18n.t('success.SUCCESS', { lang }),
    );
  }

  @Post('/payment/dummy-send-email-expire')
  @ApiOperation({ summary: 'Dummy send email will expire' })
  @ApiOkResponse({ type: PaymentContentRes })
  async payment(
    @Body() body: DummyReqPaymentDto,
    @Request()
    req: { account: { user_id: number }; headers: IncomingHttpHeaders },
  ) {
    await this.paymentService.dummyPaymentExpiredDate(body);
    const lang = req.headers['language'] as string;

    return responseHelper(
      true,
      true,
      this.i18n.t('success.SUCCESS', { lang }),
    );
  }
}

        ### 📄 src/controllers/payment-webhook.controller.ts
        > **Context Summary**
        * 📦 Classes: PaymentWebhookController

        ```ts
        import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PAYMENT_INTENT, PAYMENT_STATUS } from 'src/common/base.enum';
import { CustomLogger } from 'src/services/logger.service';
import { PaymentService } from 'src/services/payment.service';

@ApiTags('Webhook')
@Controller('webhook')
export class PaymentWebhookController {
  constructor(
    private paymentService: PaymentService,
    private logger: CustomLogger,
  ) {}

  @Post('/paypal-webhook')
  async handleWebhook(@Req() req: Request, @Body() body: any) {
    this.logger.log(
        `Webhook Handle Payment Paypal Log: ${body}`,
    );
    // Verify the webhook signature
    const isValid = await this.paymentService.verifyWebhookSignature(req)
    this.logger.log(
      `Webhook Handle Payment Paypal isValid Log: ${isValid}`
    );
    this.logger.log(body);
    if (!isValid) {
      return
    }
    const webhookEventBody = body
    let payment = await this.paymentService.findOne([{payment_capture_id: webhookEventBody.resource.id}, { payment_order_id: webhookEventBody.resource.id }]);
    if (!payment) {
      let paymentId = null
      const foundLink = webhookEventBody.resource.links.find((link: any) => link?.method === "GET" && link?.rel === "up")
      paymentId = foundLink?.href.split("/").pop()
      payment = await this.paymentService.findOne([{payment_capture_id: paymentId}, { payment_order_id: paymentId }])
      this.logger.log(`Webhook Handle Payment Paypal NOT FOUND payment Log: ${payment.id}- foundLink: ${foundLink?.href}`)
      
      if (!payment) return
    };
    this.logger.log(body);
    switch (body.event_type) {
      case 'CHECKOUT.ORDER.COMPLETED':
      case 'CHECKOUT.ORDER.APPROVED':
        await this.paymentService.updateStatusOrder(
          payment.id,
          webhookEventBody.resource.status,
        );
        break
      case 'PAYMENT.CAPTURE.DENIED':
      case 'PAYMENT.CAPTURE.DECLINED':
        if ( payment.payment_status == PAYMENT_INTENT.APPROVED || payment.payment_status == PAYMENT_INTENT.COMPLETED ) {
          await this.paymentService.sendEmailAdminPaymentError(payment)
        }else{
          //Update status capture + payment status capture
          await this.paymentService.updateStatus(
            payment.id,
            webhookEventBody.resource.status,
            PAYMENT_STATUS.FAILED,
            webhookEventBody.resource.status
          );
        }
        break
      case 'PAYMENT.CAPTURE.COMPLETED':
        if ( payment.payment_status != PAYMENT_INTENT.COMPLETED) {
          //Update status capture + payment status capture
          await this.paymentService.updateStatus(
            payment.id,
            webhookEventBody.resource.status,
            PAYMENT_STATUS.PAID,
            webhookEventBody.resource.status
          );
          if (payment?.user?.expire_date) {
            const dateExpired = new Date(payment?.user?.expire_date).getTime()
            const dateNow = new Date().getTime()
            if (dateExpired < dateNow || ( dateExpired < dateNow && payment?.user?.payment_before_deadline )) {
              await this.paymentService.resetNumberPaymentErr(payment?.user)
              await this.paymentService.updateUserWithRank(payment?.user?.id, payment)
            }
          }else{
            await this.paymentService.resetNumberPaymentErr(payment?.user)
            await this.paymentService.updateUserWithRank(payment?.user?.id, payment)
          }
        }
        break
      case 'PAYMENT.CAPTURE.PENDING':
        if ( payment.payment_status == PAYMENT_INTENT.APPROVED || payment.payment_status == PAYMENT_INTENT.COMPLETED ) {
          await this.paymentService.sendEmailAdminPaymentError(payment)
        }else{
          //Update status capture + payment status capture
          await this.paymentService.updateStatus(
            payment.id,
            webhookEventBody.resource.status,
            PAYMENT_STATUS.PENDING,
            webhookEventBody.resource.status
          );
        }
        break
      case 'PAYMENT.CAPTURE.REVERSED':
      case 'PAYMENT.CAPTURE.REFUNDED':
        this.logger.log(`Webhook Handle Payment Paypal PAYMENT.CAPTURE.REFUNDED Log: ${payment.id}`)
        if ( payment.payment_status == PAYMENT_INTENT.APPROVED || payment.payment_status == PAYMENT_INTENT.COMPLETED) {
          this.logger.log(`Webhook Handle Payment Paypal PAYMENT.CAPTURE.REFUNDED Log: ${payment.id}- status: ${payment.payment_status}`)
          await this.paymentService.sendEmailAdminPaymentError(payment)
        }
        break
      default:
        break;
    }

    return;
  }
}

        ### 📄 src/controllers/youtubeCallBack.controller.ts
        > **Context Summary**
        * 📦 Classes: YoutubeCallBackController

        ```ts
        import {
  Controller,
  Get,
  Res,
  Req,
  Request,
  Query,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {YoutubeService} from "../services/youtube.service";
import { ConfigService } from '@nestjs/config';


@ApiTags('Youtube')
@Controller('/youtube')
export class YoutubeCallBackController {
  constructor(
      private youtubeService: YoutubeService,
      private configService: ConfigService
  ) {}
  @Get('/callback')
  @ApiOperation({ summary: 'Youtube' })
  @ApiOkResponse()
  async callback(@Query() data, @Res() res) {
    await this.youtubeService.callback(data);
    res.redirect(this.configService.get('REDIRECT_FE_LIST_ACCOUNT_YOUTUBE'));
  }
}
        ### 📄 src/services/firebase.service.ts
        > **Context Summary**
        * 📦 Classes: FirebaseService

        ```ts
        import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { CREDENTIALS_GG } from 'src/common/constant';
import { CustomLogger } from './logger.service';

@Injectable()
export class FirebaseService {
  private readonly firebaseApp: admin.app.App;
  constructor(private logger: CustomLogger) {
    const serviceAccount = JSON.parse(JSON.stringify(CREDENTIALS_GG));
    this.firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  async verifyOtp(
    phone: string,
    phoneCode: string,
    verifyCode: string,
  ): Promise<boolean> {
    const auth = this.firebaseApp.auth();
    try {
      const verificationResult = await auth.verifyIdToken(verifyCode);

      return verificationResult.phone_number === `${phoneCode}${phone}`;
    } catch (error) {
      this.logger.error(
        'Call Firebase Verify Error: ', error
      );
      this.logger.log(
        `Call Firebase Verify verifyOtp Log: ${error}`,
      );
      
      return false;
    }
  }
}

        ### 📄 src/services/sms.service.ts
        > **Context Summary**
        * 📦 Classes: SmsService

        ```ts
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

        ### 📄 src/services/file.service.ts
        > **Context Summary**
        * 📦 Classes: FileService

        ```ts
        import {
  BadRequestException,
  FileTypeValidator,
  Injectable,
  MaxFileSizeValidator,
  ParseFilePipe,
} from '@nestjs/common';
import * as fs from 'fs';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { genEndNameS3 } from 'src/utils';
import axios from 'axios';
import { VALIDATE_IMAGE } from 'src/common/constant';
import { I18nService } from 'nestjs-i18n';
@Injectable()
export class FileService {
  constructor(
    private configService: ConfigService,
    private readonly i18n: I18nService,
  ) {}

  deleteFile(path: string) {
    try {
      fs.unlinkSync(path);
      return { success: 1 };
    } catch (error) {
      return { success: 0 };
    }
  }

  getFiles(folder: string) {
    return fs.readdirSync(folder, {
      withFileTypes: true,
    });
  }

  async uploadS3(file: Express.Multer.File) {
    const bucket = this.configService.get('BUCKETS3');
    const region = this.configService.get('REGIONS3');
    const genKey = genEndNameS3(file.originalname);
    const key = new Date().valueOf() + '_' + genKey;
    const s3Client = new S3Client({
      credentials: {
        accessKeyId: this.configService.get('ACCESSKEYAWS'),
        secretAccessKey: this.configService.get('SECRETACCESSAWS'),
      },
      region,
    });
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: file.buffer,
      ContentEncoding: 'base64',
      ContentType: file.mimetype,
      ACL: 'public-read',
    });
    try {
      await s3Client.send(command);
      return {
        url: `https://${bucket}.s3.${region}.amazonaws.com/${key}`,
        key: key,
      };
    } catch (err) {
      throw new Error(err.message);
    }
  }
  async uploadMultipleFilesToS3(
    files: Express.Multer.File[],
  ): Promise<string[]> {
    const uploadPromises: any = files.map((file) => this.uploadS3(file));
    return Promise.all(uploadPromises);
  }

  async deleteS3(filename: string) {
    const s3Client = new S3Client({
      credentials: {
        accessKeyId: this.configService.get('ACCESSKEYAWS'),
        secretAccessKey: this.configService.get('SECRETACCESSAWS'),
      },
      region: this.configService.get('REGIONS3'),
    });
    const command = new DeleteObjectCommand({
      Bucket: this.configService.get('BUCKETS3'),
      Key: filename,
    });
    try {
      await s3Client.send(command);
      return;
    } catch (err) {
      throw new Error('Delete S3 failed');
    }
  }

  async urlToS3(imageURL) {
    const bucket = this.configService.get('BUCKETS3');
    const region = this.configService.get('REGIONS3');
    const key = imageURL.split('/').pop();
    const s3Client = new S3Client({
      credentials: {
        accessKeyId: this.configService.get('ACCESSKEYAWS'),
        secretAccessKey: this.configService.get('SECRETACCESSAWS'),
      },
      region: region,
    });

    try {
      const response = await axios.get(imageURL, {
        responseType: 'arraybuffer',
      });
      const buffer = Buffer.from(response.data, 'binary');
      await s3Client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: buffer,
          ACL: 'public-read',
          ContentType: response.headers['content-type'],
        }),
      );
      return {
        url: `https://${bucket}.s3.${region}.amazonaws.com/${key}`,
        key: key,
      };
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async uploadImage(file) {
    if (file) {
      const parseFilePipe = new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: VALIDATE_IMAGE.IMAGE_SIZE,
            message: this.i18n.t('error.IMAGE_SIZE'),
          }),
          new FileTypeValidator({ fileType: VALIDATE_IMAGE.IMAGE_TAIL }),
        ],
      });
      try {
        await parseFilePipe.transform(file);
      } catch (error) {
        console.log(parseFilePipe);
        throw new BadRequestException(error.message);
      }

      return await this.uploadS3(file);
    }
  }
}

        ### 📄 src/services/auth.service.ts
        > **Context Summary**
        * 📦 Classes: AuthService

        ```ts
        import {
  BadRequestException, ForbiddenException, HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  AuthDto,
  SignUpReq,
  VerifyAccount,
  TokenContent,
} from '../dtos/auth.dto';
import { Connection, DataSource, EntityManager, Repository } from 'typeorm';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import {
  generateToken,
  hashPassword,
  comparePassword,
  hashCrypt,
  verifyToken,
  decryptHashedEmail,
} from '../utils';
import { AccountType, METHOD_VERIFY_USER, OTPTYPE } from '../common/base.enum';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { UserEntity } from '../entities/user.entity';
import { TokenService } from './token.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/services/mail.service';
import { OptService } from './otp.service';
import { VerifyForgetPasswordReq, VerifyForgetPasswordSmsReq, VerifyUserReq } from 'src/dtos/user.dto';
import { I18nService } from 'nestjs-i18n';
import { OtpEntity } from "../entities/otp.entity";
import { FirebaseService } from './firebase.service';
import { UserService } from './user.service';

@Injectable()
export class AuthService {

  constructor(
    @InjectConnection() private readonly connection: Connection,
    private configService: ConfigService,
    private mailService: MailService,
    @InjectRepository(UserEntity) private userEntity: Repository<UserEntity>,
    private tokenService: TokenService,
    private dataSource: DataSource,
    private otpService: OptService,
    private jwtService: JwtService,
    private firebaseService: FirebaseService,
    private userService: UserService,
    private readonly i18n: I18nService,
    @InjectRepository(OtpEntity) private otpEntity: Repository<OtpEntity>,
  ) {}

  async signUp(signUpReq: SignUpReq) {
    await this.connection.transaction(async (manager: EntityManager) => {
      const isNeedVerify = false;
      // Check email
      const checkEmail = await manager.findOne(UserEntity, {
        where: {
          email: signUpReq.email.toLowerCase(),
        }
      });

      if (checkEmail && checkEmail.is_verify === true) {
        throw new BadRequestException('err', 'EMAIL_TAKEN');
      }

      const timeDate = new Date();
      const verifyToken = crypto.randomBytes(32).toString('hex');
      const newAccount = await manager.upsert(
          UserEntity,
        {
          id: checkEmail?.id,
          password: hashPassword(signUpReq.password),
          type: AccountType.NORMAL,
          is_verify: isNeedVerify,
          verify_token: verifyToken,
          expire_verify: timeDate,
          email: signUpReq?.email.toLowerCase(),
        },
        ['id'],
      );

      const newAccountId = newAccount.raw.insertId;
      const verifyAccountPayload: TokenContent = {
        id: newAccountId,
        email: signUpReq.email,
        user_type: AccountType.NORMAL,
      };

      generateToken(
        verifyAccountPayload,
        this.configService.get('REFRESH_EXPIRE_TIME'),
        this.configService.get('JWT_KEY'),
      );

      const userActiveUrl = `${process.env.APP_DOMAIN}auth/verify?id=${newAccountId}&token=${verifyToken}`;
      // Send mail
      this.mailService
        .sendMail(signUpReq.email, userActiveUrl, signUpReq.last_name)
        .then(() => console.log('Send mail successfully'));
    });
    return {
      email: signUpReq.email,
    };
  }

  async handleResLogin(payload: TokenContent) {
    const { id, email } = payload;
    await this.tokenService.deleteToken(id);
    const accessTime = this.configService.get('EXPIRE_TIME');
    const refreshTime = this.configService.get('REFRESH_EXPIRE_TIME');
    const accessToken = generateToken(
      payload,
        accessTime,
      this.configService.get('JWT_KEY'),
    );
    const key = await hashCrypt(`${id}` + email);
    const createKey = await this.tokenService.create(id, key);
    const time = new Date();
    const refreshToken = generateToken(
      { key: createKey.key, id },
        refreshTime,
      this.configService.get('JWT_KEY'),
    );
    const expiredAccess = new Date(+time.getTime() + +accessTime);
    const expiredRefresh = new Date(+time.getTime() + +refreshTime);
    return { accessToken, refreshToken, expiredAccess, expiredRefresh };
  }

  async login(body: AuthDto) {
    let signIpRes = null;
    await this.connection.transaction(async (manager: EntityManager) => {
      const userInfo = await manager.findOne(UserEntity, {
        where: [{ email: body.email_or_phone }, { phone: body.email_or_phone }],
      });
      if (!userInfo) {
        throw new BadRequestException('err', 'USER_NOT_FOUND_EMAIL');
      }

      if (!userInfo.password) {
        throw new BadRequestException('err', 'INVALID_EMAIL');
      }
      if (!userInfo.is_verify) {
        signIpRes = {
          email: userInfo.email,
          accessToken: null,
          refreshToken: null,
          expired_access: null,
          expired_refresh: null,
        };

        throw new BadRequestException('err', 'USER_NOT_FOUND_EMAIL');
      } else {
        const checkPassword = comparePassword(
          body.password,
            userInfo.password,
        );
        if (!checkPassword) {
          throw new BadRequestException('err', 'WRONG_PASS_LOGIN');
        }
        const tokenPayload: TokenContent = {
          email: userInfo.email,
          user_type: AccountType.NORMAL,
          id: +userInfo.id,
        };
        signIpRes = await this.handleResLogin(tokenPayload);
      }
    });
    return signIpRes;
  }

  async verifyAccount(query: VerifyAccount) {
    const error = `${process.env.NEXT_PUBLIC_API_UR}/auth/signup/error`;
    const user = await this.userEntity.findOne({
      where: {
        id: query.id,
        verify_token: query.token,
      },
    });

    if (!user) {
      return error;
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const manager = queryRunner.manager;
      let deeplink = error;
      const dateNow = new Date();
      if (user.is_verify == false && dateNow < user.expire_verify) {
        await manager.update(UserEntity,
            {id: user.id},
            {is_verify: true}
        );
        const tokenPayload: TokenContent = {
          email_or_phone: user.email,
          user_type: AccountType.NORMAL,
          user_id: +user.id,
        };
        await this.handleResAuth(tokenPayload);
        deeplink = `${process.env.NEXT_PUBLIC_API_UR}/auth/verify-account`;
      }
      await queryRunner.commitTransaction();
      return deeplink;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(error, error.status);
    } finally {
      await queryRunner.release();
    }
  }

  async findUserByEmail(email: string) {
    const timeDate = new Date()
    const user = await this.userEntity
      .createQueryBuilder('us')
      .where('us.email = :email', { email })
      .getOne();
      
    if (!user || (user && user.expire_verify < timeDate && user.is_verify !== true)) {
      throw new BadRequestException('EMAIL_NOT_EXIST', 'EMAIL_NOT_EXIST');
    }

    if (user && !user.is_verify) {
      throw new NotFoundException('EMAIL_INFO_INVALID', 'EMAIL_INFO_INVALID');
    }

    return user;
  }

  async verifyAccountForgotPassword(query: VerifyForgetPasswordReq){
    const error = `${process.env.NEXT_PUBLIC_API_UR}/auth/verify-password/error`;
    const emailDecrypt = await decryptHashedEmail(query.email)
    let userByEmail = await this.findUserByEmail(emailDecrypt);
    let deeplink = error;
    const dateNow = new Date();

    if (!userByEmail) {
      return error;
    }

    const checkOtp = await this.otpService.findOne({
      email: emailDecrypt || '',
      code: query.token,
      type: OTPTYPE.FORGOT_PASSWORD,
    }, false);

    if (!checkOtp) {
      return deeplink;
    }

    if (!((dateNow.getDate() - checkOtp.createdAt.getDate()) * 1000 * 60 * 60 * 24 > 1000 * 60 * 60 * 24 * 2)) {
      deeplink = `${process.env.NEXT_PUBLIC_API_UR}/auth/new-password?token=${checkOtp.code}`;
    }

    return deeplink;
  }

  async verifyAccountForgotPasswordSms(data: VerifyForgetPasswordSmsReq){
    const user = await this.userService.findUserByPhone(data.phone, data.phone_code);
    if (user && !user.is_verify) {
      throw new NotFoundException('EMAIL_INFO_INVALID', 'EMAIL_INFO_INVALID');
    }
    if (user) return true
  }

  async sendAndCheckResetPass(data: any, lang: string = 'en') {
    if (data.method == METHOD_VERIFY_USER.EMAIL) {
      let userByEmail = await this.findUserByEmail(data.email);
      const otp = await this.deleteAndCreateToken(data.email)
      await this.mailService.sendMailResetPass(`${userByEmail.first_name} ${userByEmail.last_name}`, data.email, otp.code, lang);
    }
    
    return true
  }

  async resendVerify(query: VerifyUserReq, lang: string = 'en') {
    const userWithEmail = await this.checkEmailAndPhoneExistOneParam(query)
    const timeDate = new Date()

    if (userWithEmail.is_verify == true) {
      throw new BadRequestException('err', 'EMAIL_TAKEN');
    }

    if (timeDate.getTime() - userWithEmail.updatedAt.getTime() <= 30000) {
      throw new BadRequestException('err', 'NOT_ENOUGH_TIME_30S');
    }

    timeDate.setDate(timeDate.getDate() + 2)
    const verifyToken = crypto.randomBytes(32).toString('hex');
    await this.userEntity.update({id: userWithEmail.id},
      {
        verify_token: verifyToken,
        expire_verify: timeDate,
      }
    );

    const userActiveUrl = `${process.env.APP_DOMAIN}auth/verify?id=${userWithEmail.id}&token=${verifyToken}`;
    // Send mail
    this.mailService
      .sendMail(userWithEmail.email, userActiveUrl, `${userWithEmail.first_name} ${userWithEmail.last_name}`, lang)
      .then(() => console.log('Send mail successfully'));

    return true
  }

  async deleteAndCreateToken(email: string, methodSend = null){
    await this.otpService.deleteBy({ email, type: OTPTYPE.FORGOT_PASSWORD });

    const otp = await this.otpService.create({
      email,
      type: OTPTYPE.FORGOT_PASSWORD,
      is_resend: true,
    });
    
    return otp
  }

  async resetPassword(email: string, password: string) {
    const user = await this.userEntity.findOne({
      where: { email },
    });
    if (!user) {
      throw new BadRequestException('err', 'EMAIL_NOT_EXIST');
    }
    const newPass = hashPassword(password);
    return await this.userEntity.update(
      { id: user.id },
      { password: newPass }
    );
  }

  async resetPasswordWithPhoneNumber(phoneNumber: string, phoneCode: string, password: string, code: string) {
    const user = await this.userService.findUserByPhone(phoneNumber, phoneCode)
    if (user && !user.is_verify) {
      throw new NotFoundException('EMAIL_INFO_INVALID', 'EMAIL_INFO_INVALID');
    }
    const isValid = await this.firebaseService.verifyOtp(phoneNumber, phoneCode, code)
    if (!isValid) {
      throw new BadRequestException('BAD_REQUEST_EXCEPTION', 'BAD_REQUEST_EXCEPTION')
    }
    const newPass = hashPassword(password);
    return await this.userEntity.update(
      { id: user.id },
      { password: newPass }
    );
  }

  async checkAndRefreshToken(key: string, id: number) {
    const checkKey = await this.tokenService.findOne(key);
    if (checkKey && checkKey.user_id === id) {
      const user = await this.userEntity.findOne({
        where: { id: id },
      });
      if (!user) {
        throw new UnauthorizedException('UNAUTHORIZED', 'UNAUTHORIZED');
      }
      const payload = {
        id: id,
        email: user.email,
        user_type: AccountType.NORMAL,
      };
      const accessTime = this.configService.get('EXPIRE_TIME');
      const refreshTime = this.configService.get('REFRESH_EXPIRE_TIME');
      const accessToken = generateToken(
        payload,
          accessTime,
        this.configService.get('JWT_KEY'),
      );
      const time = new Date();
      const expiredAccess = new Date(+time.getTime() + +accessTime);
      const expiredRefresh = new Date(+time.getTime() + +refreshTime);
      return { accessToken, expiredAccess, expiredRefresh };
    } else {
      throw new UnauthorizedException('UNAUTHORIZED', 'UNAUTHORIZED');
    }
  }

  async checkEmailAndPhoneExist(phone: string, email: string, timeDate, phone_code){
    const userInfoWithPhones = await this.userEntity
        .createQueryBuilder('u')
        .where('u.phone = :phone and u.phone_code = :phoneCode and u.expire_verify >= :time', { phone: phone, phoneCode:phone_code, time: timeDate })
        .getMany();

    for (let key in userInfoWithPhones) {
      if (userInfoWithPhones[key].is_verify == true) {
        throw new BadRequestException('PHONE_TAKEN', 'PHONE_TAKEN');
      }

      if (userInfoWithPhones[key].is_verify == false && userInfoWithPhones[key].expire_verify > timeDate) {
        throw new BadRequestException('NUMBER_USED_NOT_VERIFIED', 'NUMBER_USED_NOT_VERIFIED');
      }
    }

    const userInfoWithEmails = await this.userEntity
        .createQueryBuilder('u')
        .where('u.email = :email and u.expire_verify >= :time', { email: email.toLowerCase(), time: timeDate })
        .getMany();
    for (let key in userInfoWithEmails) {
      if (userInfoWithEmails[key].is_verify == true) {
        throw new BadRequestException('EMAIL_TAKEN', 'EMAIL_TAKEN');
      }

      if (userInfoWithEmails[key].is_verify == false && userInfoWithEmails[key].expire_verify > timeDate) {
        throw new BadRequestException('EMAIL_EXISTED_NOT_VERIFIED', 'EMAIL_EXISTED_NOT_VERIFIED');
      }
    }
  }

  async checkEmailAndPhoneExistPassExpired(phone: string, email: string, phone_code: string, timeDate: any){
    const userInfoWithPhones = await this.userEntity
        .createQueryBuilder('u')
        .where('u.phone = :phone and u.phone_code = :phoneCode', { phone: phone, phoneCode:phone_code })
        .getOne();

    if (userInfoWithPhones && userInfoWithPhones?.is_verify == true && userInfoWithPhones?.expire_verify < timeDate) {
      throw new BadRequestException('PHONE_TAKEN', 'PHONE_TAKEN');
    }

    const userInfoWithEmails = await this.userEntity
        .createQueryBuilder('u')
        .where('u.email = :email', { email: email.toLowerCase() })
        .getOne();

    if (userInfoWithEmails && userInfoWithEmails?.is_verify == true && userInfoWithEmails?.expire_verify < timeDate) {
      throw new BadRequestException('EMAIL_TAKEN', 'EMAIL_TAKEN');
    }
  }

  async checkEmailAndPhoneExistOneParam(data: any){
    const timeDate = new Date();
    const user = await this.userEntity.findOne({
      where: [
        {email: data.email_or_phone.toLowerCase()}, 
        {phone : data.email_or_phone, phone_code: data.phone_code}
      ]
    });
    if (!user || (user && user.expire_verify < timeDate && user.is_verify !== true)) {
      throw new BadRequestException('EMAIL_OR_PHONE_NOT_EXIST', 'EMAIL_OR_PHONE_NOT_EXIST');
    }
    
    return user
  }

  async signUpJwt(signUpReq: SignUpReq, lang: string = 'en') {
    const timeDate = new Date();
    const { first_name, last_name, phone, email, password, phone_code } = signUpReq;
    await this.checkEmailAndPhoneExist(phone, email, timeDate, phone_code)
    await this.checkEmailAndPhoneExistPassExpired(phone, email, phone_code, timeDate)
    await this.connection.transaction(async (manager: EntityManager) => {
      const verifyToken = crypto.randomBytes(32).toString('hex');
      const userInfo = await this.userEntity.findOne({
        where: [
          { email: email.toLowerCase()}, 
          { phone: phone, phone_code: phone_code }
        ]
      });
      if (userInfo && userInfo.is_verify == false && userInfo.expire_verify < timeDate) {
        await manager.update(UserEntity,{id: userInfo.id},
          {
            email: "delete+" + email,
            phone: "delete+" + phone,
            deletedAt: timeDate
          });
      }
      //2 days
      timeDate.setDate(timeDate.getDate() + 2);
      let user = await manager.save(UserEntity,{
        first_name,
        last_name,
        phone,
        email,
        is_verify: false,
        verify_token: verifyToken,
        expire_verify: timeDate,
        password: hashPassword(password),
        phone_code: phone_code,
      });
      const userActiveUrl = `${process.env.APP_DOMAIN}auth/verify?id=${user.id}&token=${verifyToken}`;
      // Send mail
      this.mailService
      .sendMail(email, userActiveUrl, `${first_name} ${last_name}`, lang)
        .then(() => console.log('Send mail successfully'));
    });
    return {
      email: email,
    };
  }

  async validateUser(email: string, password: string, phone_code: string) {
    return await this.connection.transaction(async (manager: EntityManager) => {
      const userInfo = await manager.findOne(UserEntity, {
        where: [
          { email: email.toLowerCase() }, 
          { phone: email, phone_code: phone_code }
        ],
      });
      const timeDate = new Date();

      if (!userInfo || (userInfo && userInfo.expire_verify < timeDate && userInfo.is_verify !== true)) {
        throw new BadRequestException('EMAIL_OR_PHONE_NOT_EXIST', 'EMAIL_OR_PHONE_NOT_EXIST');
      }
  
      if (!userInfo.password) {
        throw new BadRequestException('INVALID_EMAIL', 'INVALID_EMAIL');
      }

      if (userInfo && userInfo.is_verify !== true) {
        throw new HttpException({
          code: HttpStatus.PRECONDITION_FAILED,
          message: this.i18n.t('error.VERIFY_EMAIL'),
          data: {is_verify: userInfo.is_verify}
        }, HttpStatus.PRECONDITION_FAILED);
      }
  
      const checkPassword = comparePassword(
        password,
        userInfo.password,
      );
  
      if (!checkPassword) {
        throw new BadRequestException('WRONG_PASS_LOGIN', 'WRONG_PASS_LOGIN');
      }
      delete userInfo.password;
      return userInfo
    });
  }

  async loginJwt(body: AuthDto) {
    return await this.connection.transaction(async (manager: EntityManager) => {
      const userInfo = await manager.findOne(UserEntity, {
        where: [
          { email: body.email_or_phone.toLowerCase() }, 
          { phone: body.email_or_phone, phone_code: body.phone_code }
        ],
      });
      const timeDate = new Date();

      if (!userInfo || (userInfo && userInfo.expire_verify < timeDate && userInfo.is_verify !== true)) {
        throw new BadRequestException('EMAIL_OR_PHONE_NOT_EXIST', 'EMAIL_OR_PHONE_NOT_EXIST');
      }

      if (userInfo && userInfo.is_verify !== true) {
        throw new HttpException({
          code: HttpStatus.PRECONDITION_FAILED,
          message: this.i18n.t('error.VERIFY_EMAIL'),
        }, HttpStatus.PRECONDITION_FAILED);
      }
      
      const tokenPayload: TokenContent = {
        email_or_phone: body.email_or_phone,
        user_type: AccountType.NORMAL,
        user_id: +userInfo.id,
      };
      
      return await this.handleResAuth(tokenPayload);
    });
  }

  async refreshTokenJwt(refreshToken: string, req: any) {
    try {
      const payload: any = verifyToken(
        refreshToken,
        this.configService.get('JWT_KEY'),
      );

      if (!payload) {
        throw new ForbiddenException('ACCESS_DENIED', 'ACCESS_DENIED');
      }
      const checkRefreshKey = await this.tokenService.findOne(refreshToken);
      if (!checkRefreshKey && checkRefreshKey.user_id !== +payload.user_id) {
        throw new ForbiddenException('ACCESS_DENIED', 'ACCESS_DENIED');
      }
      const tokenPayload: TokenContent = {
        email_or_phone: payload.email_or_phone,
        user_type: AccountType.NORMAL,
        user_id: +payload.user_id,
      };

      return {
        access_token: this.jwtService.sign(tokenPayload),
      };
    } catch (error) {
      throw new ForbiddenException('ACCESS_DENIED', 'ACCESS_DENIED');
    }
  }

  async handleResAuth(payload: TokenContent) {
    const { user_id, email_or_phone } = payload;
    await this.tokenService.deleteToken(user_id);
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: this.configService.get('REFRESH_EXPIRE_TIME_JWT') });
    await this.tokenService.create(user_id, refreshToken);
    return { email_or_phone: email_or_phone, access_token: accessToken, refresh_token: refreshToken };
  }
}

        ### 📄 src/services/payment.service.ts
        > **Context Summary**
        * 📦 Classes: PaymentService
* 𝑓 Functions: orderDetail...

        ```ts
        import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { Connection, EntityManager, Repository } from 'typeorm';
import { CustomLogger } from './logger.service';
import { I18nService } from 'nestjs-i18n';
import { HttpService } from '@nestjs/axios';
import { CapturePayment, CreatePaymentDto, DummyReqPaymentDto, MembershipReqDto, QueryPayment } from 'src/dtos/payment.dto';
import { PaymentEntity } from 'src/entities/payment.entity';
import { LEVEL_USER, PAYMENT_INTENT, PAYMENT_STATUS } from 'src/common/base.enum';
import { ChangeRankEntity } from 'src/entities/change_rank.entity';
import { MailService } from './mail.service';
import * as moment from 'moment';
import { AUTHENTICATION_RESULT, CASH_RANK, DAYS_IN_YEAR, DOWN_RANK, INTENT_PAYMENT, NUMBER_PAYMENT_ERROR, NUMBER_ZERO, PAYPAL_CLIENT_KEY, PAYPAL_SECRET_KEY, RENEW_RANK, RULE_LEVEL_USER, UP_RANK } from 'src/common/constant';
import { lastValueFrom } from 'rxjs';
import { YoutubeService } from './youtube.service';

@Injectable()
export class PaymentService {
  private readonly baseUrl: string
  private accessToken: string;
  private tokenExpiryTime: number; // Store expiry timestamp

  constructor(
    @InjectRepository(UserEntity) private userEntity: Repository<UserEntity>,
    @InjectRepository(ChangeRankEntity) private changeRankEntity: Repository<ChangeRankEntity>,
    @InjectRepository(PaymentEntity) private paymentEntity: Repository<PaymentEntity>,
    @InjectConnection() private readonly connection: Connection,
    private configService: ConfigService,
    private youtubeService: YoutubeService,
    private logger: CustomLogger,
    private mailService: MailService,
    private readonly i18n: I18nService,
    private readonly httpService: HttpService,
  ) {
    this.baseUrl = this.configService.get('BASE_URL_PAYPAL')
  }

  private async getAccessToken(): Promise<string> {
    // Check if the token is still valid
    if (this.accessToken && this.tokenExpiryTime > Date.now()) {
      return this.accessToken
    }

    // Token is expired or not set, generate a new one
    return this.generateAccessToken()
  }

  async optionHeader(accessToken: string) {
    const option: any = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      }
    }
    
    return option
  }
  
  async generateAccessToken(lang: string = 'en') {
    const clientId = PAYPAL_CLIENT_KEY
    const clientSecret = PAYPAL_SECRET_KEY
    if (!clientId || !clientSecret) {
      throw new Error('MISSING_API_CREDENTIALS')
    }
    // To base64 encode your client id and secret using NodeJs
    const base64EncodedCredentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
    
    try {
      const requestBody = new URLSearchParams()
      requestBody.append('grant_type', 'client_credentials')
      requestBody.append('ignoreCache', 'true')
      const requestConfig: any = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${base64EncodedCredentials}`,
        },
      }
      const response = await lastValueFrom(
        this.httpService.post(`${this.baseUrl}/v1/oauth2/token`, requestBody.toString(), requestConfig)
      )

      if (response.status !== 200 || !response.data.access_token) {
        this.logger.error('Failed to obtain access token', response.data)
        this.logger.log(`Generate Access Token Failed: ${JSON.stringify(response.data || response)}`)
        throw new HttpException(this.i18n.t('error.FAILED_GENERATE_ACCESS_TOKEN', { lang }), HttpStatus.INTERNAL_SERVER_ERROR)
      }

      // Set the new access token and expiry time
      this.accessToken = response.data.access_token
      this.tokenExpiryTime = Date.now() + response.data.expires_in * 1000 // Convert seconds to milliseconds

      return this.accessToken
    } catch (error) {
      this.logger.error('Generate AccessToken Error:', error.message || 'No message available')
      this.logger.log(`Create GenerateAccessToken Log: ${JSON.stringify(error?.response?.data)}`)

      throw new BadRequestException('BAD_REQUEST_EXCEPTION','BAD_REQUEST_EXCEPTION')
    }
  }

  async generateClientToken(lang: string = 'en') {
    try {
      const accessToken = await this.getAccessToken();
      const headers = await this.optionHeader(accessToken)
      const payload: any = {}
      const requestCapturePayment = this.httpService.post(
        `${this.baseUrl}/v1/identity/generate-token`, 
        payload, 
        headers,
      );

      const res = await lastValueFrom(requestCapturePayment)

      if (res.status !== 200 || !res.data) {
        this.logger.error('Failed to generate client token', res.data)
        this.logger.log(`Generate Client Token Failed: ${JSON.stringify(res.data || res)}`)
        throw new HttpException(this.i18n.t('error.FAILED_GENERATE_CLIENT_TOKEN', { lang }), HttpStatus.INTERNAL_SERVER_ERROR)
      }

      return res.data
    } catch (error) {
      this.logger.error('Error generating client token:', error.message || 'No message available')
      this.logger.log(`Generate Client Token Error Details: ${JSON.stringify(error?.response?.data || error)}`)

      throw new BadRequestException('BAD_REQUEST_EXCEPTION', 'BAD_REQUEST_EXCEPTION')
    }
  }

  async getUserNotExpireDate(userId: number) {
    const end = moment().format('YYYY-MM-DD 23:59:59');
    const user = await this.userEntity
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.changeRank', 'changeRank')
    .where('user.expire_date >= :newDate', { newDate: `${end}`})
    .andWhere(`(user.level IS NOT NULL AND user.is_verify = true)`)
    .andWhere('user.id = :userId', { userId: `${userId}`})
    .getOne()
    
    return user
  }

  async createOrder(data: CreatePaymentDto, userId: number) {
    const user = await this.findUserChangeMembershipRankById(userId, true)
    if (user?.payment_before_deadline) {
      throw new BadRequestException('UNAVAILABLE_ACTION','UNAVAILABLE_ACTION');
    }
    await this.paymentCalculator(user, data)
    const paymentPending = await this.findOne( {status: PAYMENT_STATUS.PENDING, user_id: user.id} )
    if (paymentPending) {
      throw new BadRequestException('PAYMENT_PENDING_PROCESS','PAYMENT_PENDING_PROCESS');
    }
    const accessToken = await this.getAccessToken()
    const headers = await this.optionHeader(accessToken)
    const orderData = {
      intent: INTENT_PAYMENT,
      purchase_units: [
        {
          description: data.rank,
          amount: {
            currency_code: this.configService.get('STRIPE_CURRENCY'),
            value: data.total.toString(),
          },
        },
      ],
      payment_source: {
        card: {
          attributes: {
            verification: {
              method: "SCA_ALWAYS",
            },
          },
        },
      },
      application_context: {
        return_url: `${this.configService.get('YOUTUBE_ACCOUNT_URL')}?return=back`,
        cancel_url: `${this.configService.get('YOUTUBE_ACCOUNT_URL')}?return=cancel`
      }
    }
    const requestOrder = this.httpService.post(
      `${this.baseUrl}/v2/checkout/orders`,
      orderData,
      headers,
    )
    const res = await lastValueFrom(requestOrder)

    return res.data
  }

  async capturePayment(data: CapturePayment, userId: number) {
    const user = await this.findUserChangeMembershipRankById(userId, true)
    if (user?.payment_before_deadline) {
      throw new BadRequestException('UNAVAILABLE_ACTION','UNAVAILABLE_ACTION');
    }
    await this.paymentCalculator(user, data)
    const paymentPending = await this.findOne( {status: PAYMENT_STATUS.PENDING, user_id: user.id} )
    if (paymentPending) {
      throw new BadRequestException('PAYMENT_PENDING_PROCESS','PAYMENT_PENDING_PROCESS');
    }
    const accessToken = await this.generateAccessToken()
    const headers = await this.optionHeader(accessToken)
    await this.orderDetail(data.order_id)
    try {
      const requestCapturePayment = this.httpService.post(
        `${this.baseUrl}/v2/checkout/orders/${data.order_id}/capture`, {}, headers,
      )
      const resCapture = await lastValueFrom(requestCapturePayment)
      let res: any = {}

      res.statusCapture = resCapture.data.status
      resCapture.data.purchase_units.forEach((purchaseUnit: any) => {
        res.statusPaymentCapture = purchaseUnit.payments.captures[0].status
        res.idPaymentCapture = purchaseUnit.payments.captures[0].id
      })
      switch (res.statusPaymentCapture) {
        case PAYMENT_INTENT.COMPLETED:
          res.status = PAYMENT_STATUS.PAID
          await this.resetNumberPaymentErr(user)
          res.message = this.i18n.t('success.COMPLETED_PAYMENT')
          break;
        case PAYMENT_INTENT.PENDING:
          res.status = PAYMENT_STATUS.PENDING
          res.message = this.i18n.t('success.PENDING_PAYMENT')
        case PAYMENT_INTENT.PARTIALLY_REFUNDED:
          res.status = PAYMENT_STATUS.PENDING
          res.message = this.i18n.t('success.PARTIALLY_REFUNDED_PAYMENT')
          break;
        case PAYMENT_INTENT.REFUNDED:
          res.status = PAYMENT_STATUS.FAILED
          res.message = this.i18n.t('success.REFUNDED_PAYMENT')
        case PAYMENT_INTENT.FAILED:
          res.status = PAYMENT_STATUS.FAILED
          res.message = this.i18n.t('success.FAILED')
        case PAYMENT_INTENT.DECLINED:
          res.status = PAYMENT_STATUS.FAILED
          res.message = this.i18n.t('success.DECLINED_PAYMENT')
          break;
        default:
        this.logger.error('Update Payment Error: ','Something went wrong or data was invalid in update payment')
        throw new BadRequestException('BAD_REQUEST_EXCEPTION','BAD_REQUEST_EXCEPTION')
      }

      return await this.connection.transaction(
        async (manager: EntityManager) => {
        await this.updatePayer(resCapture?.data?.payer?.payer_id, userId)
        const payment = await this.afterPaymentIntent(data, resCapture.data, res, user)

        return res = { ...{ payment }, ...res }
      })
    } catch (error) {
      this.logger.error(`Create Capture Paypal Error: ${error?.response?.data? JSON.stringify(error?.response?.data) : error}`, error?.response?.data?.error ?? error)
      this.logger.log(`Create Capture Paypal Log: ${error?.response?.data? JSON.stringify(error?.response?.data) : error}`)

      throw new BadRequestException('BAD_REQUEST_EXCEPTION','BAD_REQUEST_EXCEPTION')
    }
  }

  async orderDetail(orderId: string, header: any = null) {
    const accessToken = await this.generateAccessToken()
    const optionHeaders = header ?? await this.optionHeader(accessToken)
    const requestDetailOrder = this.httpService.get(
      `${this.baseUrl}/v2/checkout/orders/${orderId}?fields=payment_source`, optionHeaders,
    )
    const resDetail = await lastValueFrom(requestDetailOrder)
    const authenticationResult = resDetail.data?.payment_source?.card?.authentication_result
    this.logger.log(`Log function orderDetail Log: ${JSON.stringify(authenticationResult)} - ${JSON.stringify(resDetail.data)}`)
    if (authenticationResult) {
      const { three_d_secure, liability_shift } = authenticationResult
      const enrollment_status = three_d_secure?.enrollment_status
      const authentication_status = three_d_secure?.authentication_status
      // Check if enrollment status is "Y"
      if (enrollment_status === AUTHENTICATION_RESULT.ENROLLMENT_STATUS_Y) {
        const invalidStatusY = [
          AUTHENTICATION_RESULT.AUTHENTICATION_STATUS_C,
          AUTHENTICATION_RESULT.AUTHENTICATION_STATUS_N,
          AUTHENTICATION_RESULT.AUTHENTICATION_STATUS_R,
          AUTHENTICATION_RESULT.AUTHENTICATION_STATUS_U,
        ].includes(authentication_status) && 
        liability_shift === AUTHENTICATION_RESULT.LIABILITY_SHIFT_NO

        const noAuthenticationStatusY = !authentication_status && liability_shift === AUTHENTICATION_RESULT.LIABILITY_SHIFT_NO

        if (invalidStatusY || noAuthenticationStatusY) {
          throw new HttpException({
            code: HttpStatus.EXPECTATION_FAILED,
            message: this.i18n.t('error.AUTHORIZATION_3D_SECURE'),
            data: {'3d_secure': true}
          }, HttpStatus.EXPECTATION_FAILED)
        }

        if (invalidStatusY && liability_shift === AUTHENTICATION_RESULT.LIABILITY_SHIFT_UNKNOWN) {
          throw new HttpException({
            code: HttpStatus.EXPECTATION_FAILED,
            message: this.i18n.t('error.AUTHORIZATION_3D_SECURE'),
            data: {'3d_secure': true}
          }, HttpStatus.EXPECTATION_FAILED)
        }
      }
      // Check if enrollment status is "U"
      if (enrollment_status === AUTHENTICATION_RESULT.ENROLLMENT_STATUS_U) {
        const noAuthStatusU = !authentication_status && liability_shift === AUTHENTICATION_RESULT.LIABILITY_SHIFT_UNKNOWN
        if (noAuthStatusU) {
          throw new HttpException({
            code: HttpStatus.EXPECTATION_FAILED,
            message: this.i18n.t('error.AUTHORIZATION_3D_SECURE'),
            data: {'3d_secure': true}
          }, HttpStatus.EXPECTATION_FAILED)
        }
      }

      // General check when enrollment and authentication status are missing
      if (!enrollment_status && !authentication_status && liability_shift === AUTHENTICATION_RESULT.LIABILITY_SHIFT_UNKNOWN) {
        throw new HttpException({
          code: HttpStatus.EXPECTATION_FAILED,
          message: this.i18n.t('error.AUTHORIZATION_3D_SECURE'),
          data: {'3d_secure': true}
        }, HttpStatus.EXPECTATION_FAILED)
      }
    }
  }

  async verifyWebhookSignature(req: any) {
    const accessToken = await this.generateAccessToken()
    const headers = await this.optionHeader(accessToken)
    const transmissionId = req.headers['paypal-transmission-id'] as string;
    const timestamp = req.headers['paypal-transmission-time'] as string;
    const webhookId = this.configService.get('PAYPAL_WEBHOOK_ID'); // Add your PayPal webhook ID here
    const transmissionSig = req.headers['paypal-transmission-sig'] as string;
    const certUrl = req.headers['paypal-cert-url'] as string;
    const authAlgo = req.headers['paypal-auth-algo'] as string;
    const webhookEventBody = req.body;
    const body: any = {
      auth_algo: authAlgo,
      cert_url: certUrl,
      transmission_id: transmissionId,
      transmission_sig: transmissionSig,
      transmission_time: timestamp,
      webhook_id: webhookId,
      webhook_event: webhookEventBody,
    }
    try {
      const requestVerifyWebhook = this.httpService.post(`${this.baseUrl}/v1/notifications/verify-webhook-signature`, body, headers)
      const requestVerify = await lastValueFrom(requestVerifyWebhook)
      this.logger.log(
        `Request Verify Webhook verifyWebhookSignature Try Log: ${requestVerify.data? JSON.stringify(requestVerify.data) : requestVerify}`,
      );
      return requestVerify.data.verification_status === 'SUCCESS';
    } catch (error) {
      this.logger.log(
        `Request Verify Webhook verifyWebhookSignature Log: ${error?.response?.data? JSON.stringify(error?.response?.data) : error}`,
      );
      return false;
    }
  }

  async afterPaymentIntent(data: any, paymentIntent: any, resStatus: any, user: any) {
    const userId = user.id;
    let currentDate = this.addDaysToCurrentDate(DAYS_IN_YEAR);
    let startDate = this.resetToStartOfDay(new Date());
  
    const userNotExpire = await this.getUserNotExpireDate(userId);
    //Check if the user's rank has not expired but they want to make a payment before it does
    if (userNotExpire) {
      // Handle not expired user
      if (userNotExpire?.level) {
        const rankChangeType = await this.checkRankDownOrUp(userNotExpire?.level, data.rank)
        if (rankChangeType === DOWN_RANK || rankChangeType === RENEW_RANK) {
          // down or renew rank before dead line
          const { expire_date, changeRank } = userNotExpire;
          currentDate = this.updateDatesForUser(expire_date, changeRank);
          startDate = this.resetToStartOfDay(new Date(currentDate));
        }
      }
    }
    const paymentDate = new Date();
    const payment = await this.createPayment(data, resStatus, paymentIntent, paymentDate, currentDate, startDate, userId);
  
    if (this.isPaymentSuccessful(payment)) {
      await this.handleUserRankChange(userId, data.rank, userNotExpire, payment, user);
    }

    return payment
  }

  // Utility to add days and set end of day
  private addDaysToCurrentDate(days: number): Date {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return this.setEndOfDay(date);
  }

  // Utility to set time to the end of the day
  private setEndOfDay(date: Date): Date {
    date.setHours(23, 59, 59, 59);
    return date;
  }

  // Utility to reset time to the start of the day
  private resetToStartOfDay(date: Date): Date {
    date.setHours(0, 0, 0, 0);
    return date;
  }

  // Update current and start dates for user
  private updateDatesForUser(expireDate: Date, changeRank: any): Date {
    if (changeRank && changeRank.change_rank) {
      return this.addDaysToExpireDate(expireDate);
    }
    return this.addDaysToExpireDate(expireDate);
  }

  // Add days to expire date and reset time
  private addDaysToExpireDate(expireDate: Date): Date {
    const date = new Date(expireDate);
    date.setDate(date.getDate() + DAYS_IN_YEAR);
    return this.setEndOfDay(date);
  }

  // Check if payment is successful
  private isPaymentSuccessful(payment: any): boolean {
    return payment.payment_status === PAYMENT_INTENT.APPROVED || payment.payment_status === PAYMENT_INTENT.COMPLETED;
  }

  // Handle user rank change based on payment
  private async handleUserRankChange(userId: number, newRank: any, userNotExpire: any, payment: any, user: any) {
    const userChangeRank = await this.changeRankEntity.findOne({ where: { user_id: userId } })

    if (userChangeRank) {
      const rankChangeType = await this.checkRankDownOrUp(userChangeRank.current_rank, newRank)
      if (userNotExpire) {
        await this.handleNonExpiredUserRankChange(userId, rankChangeType, payment)
      } else {
        await this.handleExpiredUserRankChange(userId, rankChangeType, payment, user)
      }
    } else {
      await this.handleNewUserRankChange(userId, userNotExpire, payment, newRank)
    }
  }

  // Handle rank change for non-expired user
  private async handleNonExpiredUserRankChange(userId: number, rankChangeType: string, payment: any) {
    if (rankChangeType === DOWN_RANK || rankChangeType === RENEW_RANK) {
      await this.updatePaymentWithUserChangeRank(userId)
    } else {
      await this.finalizeRankChange(userId, payment)
    }
  }

  // Handle rank change for expired user
  private async handleExpiredUserRankChange(userId: number, rankChangeType: string, payment: any, user: any) {
    if (rankChangeType === DOWN_RANK) {
      //down but expired payment
      await this.downRank(user)
    }
    await this.finalizeRankChange(userId, payment)
  }

  // Handle new rank change for new users or users without a current rank
  private async handleNewUserRankChange(userId: number, userNotExpire: any, payment: any, newRank: any) {
    if (!userNotExpire?.level) {
      await this.finalizeRankChange(userId, payment)
      return
    }
    const rankChangeType = await this.checkRankDownOrUp(userNotExpire.level, newRank)
    if (rankChangeType === DOWN_RANK || rankChangeType === RENEW_RANK) {
      //not expire but want to renew or dow
      await this.updatePaymentWithUserChangeRank(userId)
    } else {
      //up rank (alway payment)
      await this.finalizeRankChange(userId, payment)
    }
  }

  // Finalize the rank change by updating the user rank and cleaning up
  private async finalizeRankChange(userId: number, payment: any) {
    await this.updateUserWithRank(userId, payment)
    await this.deleteChangeRank(userId)
  }

  async checkRankDownOrUp(levelUser: string, rankOrder: string) {
    const indexLevelUser = await this.getIndexLevelUser(levelUser)
    const indexRankOrder = await this.getIndexLevelUser(rankOrder)

    return await this.determineRankChange(indexLevelUser, indexRankOrder)
  }

  async determineRankChange(indexLevelUser: number, indexRankOrder: number) {
    if (indexLevelUser > indexRankOrder) {
      return DOWN_RANK
    } else if (indexLevelUser === indexRankOrder) {
      return RENEW_RANK
    } else {
      return UP_RANK
    }
  }

  async getIndexLevelUser(level: string) {
    if (level) {
      for (let index = 0; index < RULE_LEVEL_USER.length; ++index) {
        if (RULE_LEVEL_USER[index].level == level) {
          return index
        }
      }
    }
  }

  async createPayment(data: any, resStatus: any, paymentIntent: any, paymentDate: Date, currentDate: Date, startDate: Date, userId: number) {
    let payment = new PaymentEntity()
    payment.user_id = userId
    payment.rank = data.rank
    payment.tax = data.tax
    payment.sub_total = data.sub_total
    payment.total = data.total
    payment.payment_date =  paymentDate
    payment.expire_date =  currentDate
    payment.start_date =  startDate
    payment.status = resStatus.status
    payment.status_capture = resStatus.statusCapture
    payment.payment_status =  resStatus.statusPaymentCapture
    payment.payment_capture_id = resStatus.idPaymentCapture
    payment.payment_order_id = paymentIntent.id
    payment.purchase_units =  paymentIntent
    await this.paymentEntity.save(payment);
    delete payment.purchase_units

    return payment
  }

  async updatePayer(payerId: any, userId : number) {
    return await this.userEntity.update(
      userId,
      {
        payer_id: payerId,
      },
    )
  }

  async updatePaymentWithUserChangeRank(userId : number) {
    return await this.userEntity.update(
      userId,
      {
        payment_before_deadline: true,
      },
    )
  }

  async changeMembershipRank(data: MembershipReqDto, userId: number){
    try {
      return await this.connection.transaction(
        async (manager: EntityManager) => {
          const userChangeRank = await this.changeRankEntity.findOne({
            where: { user_id: userId },
            relations: ['user']
          })
          if (userChangeRank?.user?.payment_before_deadline) {
            throw new BadRequestException('UNAVAILABLE_ACTION','UNAVAILABLE_ACTION');
          }
          if (!userChangeRank) {
            return await this.changeRankEntity.save(
              this.changeRankEntity.create({
                user_id: userId,
                current_rank: data.current_rank,
                change_rank: data.new_rank,
                keep_yt_account_id: data.keep_yt_account_id,
              }),
            );
          }

          return await this.changeRankEntity.update(
            userChangeRank.id,
            {
              current_rank: data.current_rank,
              change_rank: data.new_rank,
              keep_yt_account_id: data.keep_yt_account_id,
            },
          );
        })
    } catch (error) {
      this.logger.log(
        `Change Membership Rank Log: ${error}`,
      );

      throw new BadRequestException(
        'BAD_REQUEST_EXCEPTION',
        'BAD_REQUEST_EXCEPTION',
      );
    }
  }

  async updateUserWithRank(userId: number, afterPayment: any) {
    let data: any = {};
    data.payment_date = afterPayment.payment_date
    data.expire_date = afterPayment.expire_date
    data.start_date = afterPayment.start_date
    data.level = afterPayment.rank

    return await this.userEntity.update(userId, data)
  }

  async findUserChangeMembershipRankById(userId: number, allPayment= true, err = true) {
    const user = await this.userEntity.findOne({
      where: { id: userId },
      relations: ['payments', 'youtubeAccounts', 'changeRank'],
      order: {
        payments: {
          id: "DESC"
        }
      },
    });

    if (!user && err) {
      throw new NotFoundException('err', 'USER_NOT_FOUND');
    }
    delete user.password;

    return user;
  }

  async updateStatus(id: number, paymentStatus: string, status: string, statusCapture: string) {
    await this.paymentEntity.update(id, { payment_status: paymentStatus, status: status, status_capture: statusCapture });
    return await this.findById(id);
  }

  async updateStatusOrder(id: number, statusCheckoutOrder: string) {
    await this.paymentEntity.update(id, { status_checkout_order: statusCheckoutOrder});
    return await this.findById(id);
  }

  async sendEmailAdminPaymentError(payment: any, statusPaymentWebhook = null) {
    let data: any = {};
    data.user_id = payment?.user?.id
    data.email = payment?.user?.email
    data.first_name = payment?.user.first_name
    data.last_name = payment?.user?.last_name
    data.start_date = moment(payment?.user?.start_date).format('YYYY-MM-DD HH:mm:ss')
    data.expire_date = moment(payment?.user?.expire_date).format('YYYY-MM-DD HH:mm:ss')
    data.payment_capture_id = payment?.payment_capture_id
    data.total = payment?.total
    data.rank = payment?.rank
    data.currency = this.configService.get('STRIPE_CURRENCY_SYMBOL')
    if (statusPaymentWebhook != null) {
      data.statusPaymentWebhook = statusPaymentWebhook
    }
    this.logger.log(`Send Email Admin: sendEmailAdminPaymentError-${payment.id} -data: ${JSON.stringify(data)}`);
    await this.mailService.sendAdminEmailPaymentError(data)
  }

  async sendEmailUserExpiredDate(user: any, dayDiff: any) {
    let data: any = {};
    data.email = user?.email
    data.fullName = `${user.first_name} ${user?.last_name}`
    data.expire_date = moment(user?.expire_date).format('YYYY/MM/DD')
    data.rank = user?.level
    data.dateDiff = dayDiff
    switch (dayDiff) {
      case 0:
        data.subjectDay = `Your subscription plan will expire today`
        break;
      case 1:
        data.subjectDay = `Your subscription plan will expire in ${dayDiff} day`
        break;
      default:
        data.subjectDay = `Your subscription plan will expire in ${dayDiff} days`
        break;
    }
    await this.mailService.sendEmailExpiredPlan(data)
  }

  async dummyPaymentExpiredDate(data: DummyReqPaymentDto) {
    this.logger.log(`Dummy success: Dummy Payment Expired Date`);
    const start = moment().format('YYYY-MM-DD 00:00:01');
    const end = moment(data.date).format('YYYY-MM-DD 23:59:59');
    const users = await this.userEntity
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.changeRank', 'changeRank')
    .leftJoinAndSelect('user.youtubeAccounts', 'youtubeAccounts')
    .where('user.expire_date >= :newDate', { newDate: `${end}`})
    .andWhere(`(user.level IS NOT NULL AND user.is_verify = true)`)
    .getMany();
    this.logger.log(`LOG BEFORE Cron success: ${start}-${end} Dummy Payment Expired Date end try`);
    for (const user of users) {
      await this.connection.transaction(
      async (manager: EntityManager) => {
        const userChange = await this.findUserChangeMembershipRankById(user.id, false)
        const paymentPending = await this.findOne({ status: PAYMENT_STATUS.PENDING, user_id: user.id })
        if (paymentPending) {
          return
        }
        if (user?.payment_before_deadline) {
          return
        }
        let flagNotSendEmail: boolean = true
        if (user?.changeRank) {
          //Cancel plan
          if (user?.changeRank?.change_rank == null || user?.changeRank?.change_rank == '' || user?.payment_before_deadline) {
            flagNotSendEmail = false
            return
          }
        }
        const dayDiff = await this.dayDiff(end, user.expire_date)
        if(dayDiff >= 0 && dayDiff <= 3 && flagNotSendEmail) {
          this.logger.log(`Cron success: Dummy Payment Expired Date Before Charge ${user.id}, ${userChange?.payments?.shift()?.id}`)
          if (user.number_payment_err != NUMBER_PAYMENT_ERROR) {
            await this.paymentNumberErr(user)
            await this.sendEmailUserExpiredDate(userChange, dayDiff)
          }
        }
      })
    }
    this.logger.log(`LOG2 Cron success: Dummy Payment Expired Date end try`);
  }

  async dayDiff(dateNow: any, expireDate: any){
    const expiredDateUser = new Date(expireDate)
    const diff = expiredDateUser.getTime() - new Date(dateNow).getTime()

    return Math.floor(diff / (1000 * 60 * 60 * 24))
  }

  async deleteChangeRank(userId: number) {
    const changeRank = await this.changeRankEntity.findOne({
      where: { user_id: userId },
    });

    if (changeRank) {
      return await this.changeRankEntity.softDelete(changeRank.id);
    }
  }

  async findOne(data: any) {
    return await this.paymentEntity.findOne({
      where: data,
      relations: ['user', 'user.changeRank']
    });
  }

  async findById(id: number, relations?: string[]) {
    const purchase = await this.paymentEntity.findOne({
      select: ['id', 'user_id', 'rank', 'payment_status', 'status', 'tax', 'sub_total', 'total', 'expire_date', 'payment_date', 'start_date'],
      where: { id: id },
      relations,
    });

    if (!purchase) {
      throw new NotFoundException('Data Not Found', 'DATA_NOT_FOUND');
    }
    return purchase;
  }

  async listPayment(data: QueryPayment, userId: number) {
    const { page, pageSize, sortBy } = data;
    const sortField = data.sortField || 'id';
    let [payments, total] = await this.paymentEntity.createQueryBuilder('payment')
      .select(["payment.id", "payment.user_id", "payment.rank", "payment.payment_status", "payment.status", "payment.tax", "payment.sub_total", "payment.total", "payment.expire_date","payment.payment_date", "payment.start_date"])
      .where( `payment.user_id = ${userId}`)
      .take(pageSize)
      .skip((page - 1) * pageSize)
      .orderBy(`payment.${sortField}`, sortBy === 'ASC' ? 'ASC' : 'DESC')
      .getManyAndCount();

    return { payments, total };
  }

  async paymentCalculator(user: any, data: CreatePaymentDto){
    const expireDate = user.expire_date ? moment(user.expire_date) : moment()
    const currentDate = moment()
    const remainingTime = expireDate.diff(currentDate, 'days')
    let remainingValue = 0
    let subtotal = 0
    let defaultTax = 0
    switch (data.rank) {
      case LEVEL_USER.GOLD:
        if (user?.level == LEVEL_USER.SILVER) {
          remainingValue = (+CASH_RANK.CASH_SILVER * remainingTime) / DAYS_IN_YEAR
        }

        if (user?.level == LEVEL_USER.BRONZE) {
          remainingValue = (+CASH_RANK.CASH_BRONZE * remainingTime) / DAYS_IN_YEAR
        }

        subtotal = (user?.level != LEVEL_USER.BRONZE && user?.level != LEVEL_USER.SILVER && user?.level != LEVEL_USER.GOLD) ? +CASH_RANK.CASH_GOLD : +CASH_RANK.CASH_GOLD - remainingValue
      break;
      case LEVEL_USER.SILVER:
        if (user?.level == LEVEL_USER.BRONZE) {
          remainingValue = (+CASH_RANK.CASH_BRONZE * remainingTime) / DAYS_IN_YEAR
        }
        subtotal = (user?.level != LEVEL_USER.BRONZE && user?.level != LEVEL_USER.SILVER && user?.level != LEVEL_USER.GOLD) ? +CASH_RANK.CASH_SILVER : +CASH_RANK.CASH_SILVER - remainingValue
      break;
      case LEVEL_USER.BRONZE:
        subtotal = +CASH_RANK.CASH_BRONZE
      break;
    }
    const tax = (subtotal*defaultTax) / 100
    const total = subtotal + tax

    if (Number(tax.toFixed(2)) != +data.tax || Number(total.toFixed(2)) != +data.total || Number(subtotal.toFixed(2)) != +data.sub_total) {
      throw new BadRequestException('err', 'DATA_PAYMENT_INCORRECT');
    }
  }

  async resetNumberPaymentErr(user: any) {
    if (user?.number_payment_err != NUMBER_ZERO) {
      await this.userEntity.update(user.id, { number_payment_err: NUMBER_ZERO })
    }
  }

  async paymentNumberErr(user: any, numberCall = 1) {
    if (user.number_payment_err < NUMBER_PAYMENT_ERROR) {
      user.number_payment_err += numberCall
      await this.userEntity.update(user.id, { number_payment_err: user.number_payment_err })
    }

    if (numberCall == NUMBER_PAYMENT_ERROR) {
      await this.userEntity.update(user.id, { number_payment_err: NUMBER_PAYMENT_ERROR })
    }
  }

  async deleteYtAccount(youtubeAccounts: any, keepAccountToNumbers: any, userId: number){
    if (keepAccountToNumbers.length > 0) {
      const ytAccountsToDeletes = youtubeAccounts.filter((account: any) => 
        !keepAccountToNumbers.includes(Number(account.id))
      );
      if (ytAccountsToDeletes.length > 0) {
        for (const ytAccountsToDelete of ytAccountsToDeletes) {
          await this.youtubeService.deleteYoutubeAccount(userId, ytAccountsToDelete.id)
          this.logger.log(`Payment deleteYtAccount: Down rank ${ytAccountsToDelete.id}, User Id ${userId}`);
        }
      }
    }else{
      if (youtubeAccounts.length > 0) {
        for (const youtubeAccount of youtubeAccounts) {
          await this.youtubeService.deleteYoutubeAccount(userId, youtubeAccount.id)
        }
      }
    }
  }

  async downRank(user: any) {
    if (user?.changeRank?.keep_yt_account_id?.length > 0) {
      const keepAccountToNumbers = user?.changeRank?.keep_yt_account_id.map(Number)
      await this.deleteYtAccount(user.youtubeAccounts, keepAccountToNumbers, user.id)
    }else{
      if (user?.changeRank?.change_rank != null || user?.changeRank?.change_rank != '') {
        await this.deleteYtAccount(user.youtubeAccounts, [], user.id)
      }
    }
  }

  async resetPaymentBeforeDeadline(user: any) {
    await this.userEntity.update(user.id, { payment_before_deadline: false })
  }
}
        ### 📄 src/services/otp.service.ts
        > **Context Summary**
        * 📦 Classes: OptService

        ```ts
        import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { OTPTYPE } from 'src/common/base.enum';
import { OtpEntity } from 'src/entities/otp.entity';
import { Repository } from 'typeorm';
import { OtpCreateDto, OtpCriteriaDto } from '../dtos/otp.dto';

@Injectable()
export class OptService {
  constructor(
    @InjectRepository(OtpEntity) private otpEntity: Repository<OtpEntity>,
    private readonly i18n: I18nService,
  ) {}

  async create(data: OtpCreateDto) {
    const digits =
      data.type === OTPTYPE.RESET_PASSWORD
        ? 'abcdefghABCDEFGH0123456789'
        : '0123456789';
    const length = data.type === OTPTYPE.RESET_PASSWORD ? 42 : 6;
    let OTP = '';
    let check = false;
    while (check === false) {
      for (let i = 0; i < length; i++) {
        OTP += digits[Math.floor(Math.random() * digits.length)];
      }
      const code = await this.otpEntity.findOne({
        where: {
          code: OTP,
          type: data.type,
          email: data.email,
        },
      });
      if (code) {
        OTP = '';
      } else {
        check = true;
      }
    }
    if (data.type === OTPTYPE.VERIFY_USER) {
      OTP = data.token_verify
    }
    return await this.otpEntity.save(
      this.otpEntity.create({
        ...data,
        code: OTP,
      })
    );
  }

  async findOne(data: OtpCriteriaDto, err = true) {
    const otp = await this.otpEntity.findOne({
      where: data,
    });

    if (!otp && err) {
      throw new NotFoundException(this.i18n.t('error.DATA_NOT_FOUND'));
    }

    return otp;
  }

  async deleteBy(data: OtpCriteriaDto) {
    await this.otpEntity.delete(data);
  }
}

        ### 📄 src/services/logger.service.ts
        > **Context Summary**
        * 📦 Classes: CustomLogger

        ```ts
        import { Injectable } from '@nestjs/common';
import * as winston from 'winston';
import { Logger } from '@nestjs/common';

@Injectable()
export class CustomLogger extends Logger {
  private logger;
  constructor() {
    super();
    this.logger = winston.createLogger({
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({
          level: 'error',
          filename: 'error.log',
        }),
        new winston.transports.File({
          level: 'info',
          filename: 'combined.log',
        }),
      ],
    });
  }

  log(message: any) {
    this.logger.info(message);
  }

  error(message: string, trace: string) {
    this.logger.error(message, trace);
  }

  debug(message: any) {
    this.logger.debug(message);
  }

  order(order: any, data: any) {
    this.logger.info(order, data);
  }
}

        ### 📄 src/services/user.service.ts
        > **Context Summary**
        * 📦 Classes: UserService

        ```ts
        import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { Connection, Not, Repository } from 'typeorm';
import {
  SearchUserAdminReq,
  UserReqUpdate,
  PhoneOrEmail,
} from '../dtos/user.dto';
import { comparePassword, hashPassword } from 'src/utils';
import { SORTBY } from 'src/common/base.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private userEntity: Repository<UserEntity>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async findById(id: number) {
    const user = await this.userEntity.findOne({
      where: { id: id },
      relations: ['payments', 'youtubeAccounts', 'changeRank'],
      select: {
        payments: {
          id: true,
          user_id: true,
          rank: true,
          payment_status: true,
          status: true,
          tax: true,
          sub_total: true,
          total: true,
          expire_date: true,
          payment_date: true,
          start_date: true,
        }
      }
    });

    if (!user) {
      throw new NotFoundException('err', 'USER_NOT_FOUND');
    }
    delete user.password;

    return user;
  }

  async searchUsers(data: SearchUserAdminReq) {
    const { page, pageSize, sortBy, search, filterUser } = data;
    const sortField = data.sortField || 'id';
    const newSortBy = sortBy.toLowerCase() == SORTBY.asc ? SORTBY.ASC : SORTBY.DESC;
    let query = '';

    if (search) {
      query += `${query ? ' AND' : ''} u.${filterUser} like '%${search}%'`;
    }

    const [users, total] = await this.userEntity
      .createQueryBuilder('u')
      .where(query)
      .take(pageSize)
      .skip((page - 1) * pageSize)
      .orderBy(`u.${sortField}`, newSortBy)
      .getManyAndCount();

    return { users, total };
  }

  async findOneByEmailOrPhone(data: PhoneOrEmail, throw_err = false) {
    const user = await this.userEntity.findOne({
      where: [{ email: data.email }, { phone: data.phone }],
    });
    if (throw_err) {
      const checkEmail = await this.userEntity.findOne({
        where: {
          email: data.email.toLowerCase(),
        },
      });

      if (checkEmail) {
        throw new BadRequestException('err', 'EMAIL_TAKEN');
      }
      const checkUsername = await this.userEntity.findOne({
        where: [
          { phone: data.phone },
          { email: data.email.toLowerCase() }
        ],
      });

      if (checkUsername) {
        throw new BadRequestException('err', 'USER_TAKEN');
      }
    }
    delete user.password;

    return user;
  }

  async updateUser(id: number, data: UserReqUpdate) {
    if (data.constructor === Object && Object.keys(data).length > 0) {
      const findPhoneNumber = await this.userEntity.findOne({
        where: {phone : data?.phone, id: Not(id), phone_code: data.phone_code}
      })
      
      if (findPhoneNumber) {
        throw new BadRequestException('PHONE_TAKEN', 'PHONE_TAKEN');
      }

      await this.userEntity.update(
        { id },
        {
          first_name: data?.first_name,
          last_name: data?.last_name,
          phone: data?.phone,
          phone_code: data?.phone_code
        },
      );
    }
    const user = await this.userEntity.findOne({
      where: { id },
    });
    delete user.password;

    return user;
  }

  async changePassword(id: number, oldPassword: string, password: string) {
    const user = await this.userEntity.findOne({
      where: { id: id }
    });

    if (!user) {
      throw new NotFoundException('err', 'USER_NOT_FOUND');
    }

    const compare = comparePassword(oldPassword, user.password);
    if (!compare) {
      throw new BadRequestException('WRONG_PASS_LOGIN', 'WRONG_PASS_LOGIN');
    }
    const newPass = hashPassword(password);
    await this.userEntity.update({ id }, { password: newPass });
    return true;
  }

  async changePasswordWithoutOldPass(id: number, password: string) {
    await this.findById(id);
    const newPass = hashPassword(password);
    return await this.userEntity.update({ id }, { password: newPass, updatedAt: new Date() });
  }

  async findByEmailOrPhoneNumber(emailOrPhone: string) {
    const user = await this.userEntity.findOne({
      where: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    });

    if (!user) {
      throw new NotFoundException('err', 'USER_NOT_FOUND');
    }
    delete user.password;

    return user;
  }

  async findUserByPhone(phoneNumber: string, phoneCode: string, err = true){
    const user = await this.userEntity.findOne({
      where: { phone : phoneNumber, phone_code: phoneCode}
    })

    if (!user && err) {
      throw new NotFoundException('PHONE_NOT_EXIST', 'PHONE_NOT_EXIST');
    }
    delete user.password;

    return user;
  }
}

        ### 📄 src/services/youtube.service.ts
        > **Context Summary**
        * 📦 Classes: YoutubeService

        ```ts
        import {
  BadRequestException, HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection, DataSource, Like, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { google, youtube_v3, oauth2_v2} from 'googleapis';
import {YoutubeAccountEntity} from "../entities/youtube-account.entity";
import {UserEntity} from "../entities/user.entity";
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import {NUMBER_PAGE, RULE_LEVEL_USER} from "../common/constant";
import { CustomLogger } from './logger.service';
import {SORTBY} from "../common/base.enum";
import { Readable } from 'node:stream';
import {createReadStream, writeFileSync, unlinkSync} from "fs";
import {join} from 'path';
import {CaptionEntity} from "../entities/caption.entity";
import {VideoEntity} from "../entities/video.entity";
import {VideoPushEntity} from "../entities/video-push.entity";
import {updateVideo, getVideoPushHistory, translationCaption, getCaptionPushHistory} from "../dtos/youtube.dto";
import {CaptionPushEntity} from "../entities/caption-push.entity";

@Injectable()
export class YoutubeService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectRepository(YoutubeAccountEntity) private youtubeAccountEntity: Repository<YoutubeAccountEntity>,
    @InjectRepository(CaptionEntity) private captionEntity: Repository<CaptionEntity>,
    @InjectRepository(UserEntity) private UserEntity: Repository<UserEntity>,
    @InjectRepository(VideoEntity) private VideoEntity: Repository<VideoEntity>,
    @InjectRepository(VideoPushEntity) private VideoPushEntity: Repository<VideoPushEntity>,
    @InjectRepository(CaptionPushEntity) private CaptionPushEntity: Repository<CaptionPushEntity>,
    private dataSource: DataSource,
    private configService: ConfigService,
    private readonly httpService: HttpService,
    private logger: CustomLogger,
  ) {}
  readonly oauth2Client = new google.auth.OAuth2(
      this.configService.get('CLIENT_ID_YOUTUBE'),
      this.configService.get('CLIENT_SECRET_YOUTUBE'),
      this.configService.get('CALLBACK_FE_YOUTUBE')
  );

  readonly scopes = [
    'https://www.googleapis.com/auth/youtube.force-ssl',
    'profile',
    'email'
  ];

  async getAuthorizationUrl(req) {
    req.session.user_id = req.account.user_id;
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: this.scopes,
      include_granted_scopes: true,
      state: req.account.user_id,
      prompt: "select_account",
    });
  }

  async callback(data) {
    if (data.error) { // An error response e.g. error=access_denied
      this.logger.log('Error:' + data.error);
      throw new HttpException("Error-auth-google", 452);
    }
    const userId = data.state;
    await this.checkLevelUser(userId);
    let { tokens } = await this.oauth2Client.getToken(data.code);
    if (!tokens.scope.includes("https://www.googleapis.com/auth/youtube.force-ssl")) {
      throw new HttpException("This-YouTube-account-does-not-have-permission-to-connect.Please-try-again-to-automatically-grant-full-permissions.", 452);
    }
    let infoAccount = await this.getInfoYoutubeAccount(tokens.access_token);
    await this.checkEmailAccountYoutube(infoAccount.email);
    const dataAccount: any = {
      user_id: userId,
      email: infoAccount.email,
      name: infoAccount.name,
    };
    const youtubeAccountOld = await this.youtubeAccountEntity.findOne({ where: { email: infoAccount.email }, withDeleted: true })
    if (!tokens.refresh_token) {
      if (!youtubeAccountOld) {
        this.logger.log('Error: youtubeAccountOld Not found-'+userId+'-'+infoAccount.email);
        throw new HttpException("Please-revoke-permissions-in-your-google-account-and-try-again", 452);
      }
      dataAccount.total_video = await this.getTotalVideo(youtubeAccountOld.refresh_token, true);
      dataAccount.deletedAt = null;

      return await this.youtubeAccountEntity.update({id : youtubeAccountOld.id}, dataAccount)
    }

    if (youtubeAccountOld) {
      await this.youtubeAccountEntity.update({id : youtubeAccountOld.id}, { email: "delete+"+youtubeAccountOld.email })
    }

    const totalVideo = await this.getTotalVideo(tokens.refresh_token, true);
    if (totalVideo === false) {
      dataAccount.refresh_token = tokens.refresh_token;
      dataAccount.deletedAt = new Date();
      await this.youtubeAccountEntity.save(dataAccount);
      throw new HttpException("This-action-can-not-be-done-because-you-have-ran-out-of-points.Please-try-again-later!", 452);
    }

    const infoChannel: any = await this.getInfoChannel(tokens.refresh_token);
    dataAccount.refresh_token = tokens.refresh_token;
    dataAccount.total_video = totalVideo;
    dataAccount.id_channel = infoChannel.id;
    dataAccount.name_channel = infoChannel.snippet.title;
    dataAccount.description = infoChannel.snippet.description;
    dataAccount.custom_url = infoChannel.snippet.customUrl;
    dataAccount.picture = infoChannel.snippet.thumbnails.default.url;
    return await this.youtubeAccountEntity.save(dataAccount);
  }

  async checkLevelUser(userId) {
    const user = await this.UserEntity.findOne({
      where: { id: userId },
      relations: ['youtubeAccounts'],
    });
    const rule = await this.getRuleLevelUser(user.level);
    if (user.youtubeAccounts.length >= rule.account && rule.account !== null) {
      this.logger.log('Error:User reaches account maximum.');
      throw new HttpException("User-reaches-account-maximum", 452);
    }
  }

  async checkEmailAccountYoutube(email) {
    const accounts = await this.youtubeAccountEntity.find({
      where: { email: email },
    });
    if (accounts.length > 0) {
      this.logger.log('Error:Youtube account already exists.');
      throw new HttpException("This-YouTube-account-has-been-connected-to-another-account.", 452);
    }
  }

  async getYoutubeAccountById(userId, id) {
    const entity = await this.youtubeAccountEntity.findOne({
      where: { id: id, user_id: userId }
    });
    if (!entity) {
      throw new BadRequestException("Not found Youtube Account");
    }

    return entity;
  }

  async getYoutubeAccountByUserId(query, userId) {
    const page = query.page ?? NUMBER_PAGE.PAGE;
    const pageSize = query.pageSize ?? NUMBER_PAGE.PAGE_SIZE;
    const orderBy = {
      "ya.name": SORTBY[query.sortBy],
    };

    return await this.youtubeAccountEntity.createQueryBuilder('ya')
      .select(["ya.id", "ya.email", "ya.name_channel", "ya.picture", "ya.user_id", "ya.total_video"])
      .where( `ya.user_id = ${userId}`)
      .orderBy(orderBy)
      .take(pageSize)
      .skip((page - 1) * pageSize)
      .getManyAndCount();
  }

  async deleteYoutubeAccount(userId, youtubeAccountId) {
    let youtubeAccount = await this.youtubeAccountEntity.findOne({
      where: { id: youtubeAccountId, user_id: userId }
    });
    if (!youtubeAccount) {
      this.logger.log("Error: The Youtube Account not found.");
      throw new NotFoundException('The Youtube Account not found.');
    }

    return await this.youtubeAccountEntity.softDelete(youtubeAccountId);
  }

  async getInfoYoutubeAccount(accessToken) {
    try {
      const request = this.httpService.get(
          `https://www.googleapis.com/oauth2/v1/userinfo?alt=json`,
          {headers: {
              'Authorization': 'Bearer '+ accessToken,
              'Accept': 'application/json'}
          }
      );
      const res = await lastValueFrom(request);
      return res.data;
    } catch (error) {
      this.logger.log("Error getInfoYoutubeAccount: "+error.response.data);
      throw new HttpException(error.message, 500);
    }
  }

  async getRuleLevelUser(level) {
    if (!level) {
      this.logger.log("Error: User level not found.");
      throw new NotFoundException('USER_LEVEL_NOT_FOUND', 'USER_LEVEL_NOT_FOUND');
    }
    for (let index = 0; index < RULE_LEVEL_USER.length; ++index) {
      if (RULE_LEVEL_USER[index].level == level) {
        return RULE_LEVEL_USER[index];
      }
    }
  }

  async getVideos(param, refreshToken, auth?) {
    let listParams: youtube_v3.Params$Resource$Search$List = {
      forMine: true,
      part: ["snippet"],
      type: ["video"],
    };

    if (param.text) {
      listParams.q = param.text;
    }

    if (param.page_token) {
      listParams.pageToken = param.page_token;
    }

    // default max = 50
    listParams.maxResults = 10;

    let yt = await this.authYoutube(refreshToken);
    return await yt.search.list(listParams).then((response) => {
      return response.data;
    }).catch((error) => {
      if (auth) {
        if (Array.isArray(error.errors) && error.errors.length > 0) {
          let message = error.errors[0].message;
          if (message.indexOf("quota") != -1) {
            return { pageInfo: {
                totalResults: false
              }
            };
          }
        }
        throw new HttpException("This-account-is-Invalid.", 452);
      }
      throw new HttpException(error, 499);
    });
  }

  async detailVideo(videoId, refreshToken) {
    let listParams: youtube_v3.Params$Resource$Videos$List = {
      part: ["snippet", "id", "localizations"],
      id: [videoId]
    };
    let yt = await this.authYoutube(refreshToken);
    return await yt.videos.list(listParams).then((response) => {
      return response.data.items[0];
    }).catch((error) => {
      throw new HttpException(error, 499);
    });
  }

  async updateTitleAndDesVideo(param, refreshToken, userId) {
    const detailVideoById: any = await this.detailVideo(param.video_id, refreshToken)
    let localizations = {};
    if (detailVideoById.localizations) {
      localizations = detailVideoById.localizations;
    }
    let title = "";
    let description = "";
    for (let localization of JSON.parse(param.localizations)) {
      if (!localization.lang || !localization.title) {
        throw new BadRequestException('Localization is missing param');
      }

      if (localization.title.length > 100) {
        throw new BadRequestException('Title is too long: '+localization.lang);
      }

      if (localization.description.length > 5000) {
        throw new BadRequestException('Description is too long: '+localization.lang);
      }

      if (localization.lang == param.default_lang) {
        title = localization.title;
        description = localization.description;
      }
      Object.assign(localizations, {
        [localization.lang]: {
          title: localization.title,
          description: localization.description
        }
      });
    }

    let listParams: youtube_v3.Params$Resource$Videos$Update = {
      part: ["snippet", "id", "localizations"],
      requestBody: {
        id : param.video_id,
        localizations : localizations,
        snippet: {
          title: title,
          description: description,
          defaultLanguage: param.default_lang,
          categoryId: param.category_id,
          defaultAudioLanguage: detailVideoById.snippet.defaultAudioLanguage
        }
      }
    }

    let yt = await this.authYoutube(refreshToken);
    return await yt.videos.update(listParams).then((response) => {
      this.videoPushHistory(param, userId)
      return response.data;
    }).catch((error) => {
      this.logger.log(error);
      throw new HttpException(error, 499);
    });
  }

  async detailCaptionById(refreshToken, videoId, defaultLang, originalLang) {
    const captions = await this.getCaptionsByVideoId(videoId, refreshToken);
    if (captions.length < 1) {
      throw new BadRequestException("This video does not have captions.");
    }
    let translationCaption = false;
    let captionId = '';
    let lang = originalLang;
    for (let i = 0; i < captions.length; i++) {
      if (captions[i].snippet.language == lang && captions[i].snippet.status == "serving") {
        captionId = captions[i].id;
      }
    }

    if (captionId == '' && defaultLang != originalLang) {
      lang = defaultLang;
      for (let i = 0; i < captions.length; i++) {
        if (captions[i].snippet.language == lang && captions[i].snippet.status == "serving") {
          captionId = captions[i].id;
          translationCaption = true;
        }
      }
    }

    if (captionId == '') {
      for (let i = 0; i < captions.length; i++) {
        if (captions[i].snippet.status == "serving") {
          captionId = captions[i].id;
          translationCaption = true;
          lang = captions[i].snippet.language;
        }
      }
    }

    // Convert the captions into this format. Supported options are sbv, srt, vtt, scc, ttml
    let listParams: youtube_v3.Params$Resource$Captions$Download = {
      id: captionId,
      tfmt: "ttml"
    }
    let yt = await this.authYoutube(refreshToken);
    const caption: any = await yt.captions.download(listParams).then((response) => {
      return response;
    }).catch((error) => {
      throw new HttpException(error, 499);
    });

    let blob = caption.data;
    const arr = Object.getOwnPropertySymbols(blob);
    let text = caption.data[arr[1]].toString('utf8');
    await this.createOrUpdateCaptionToDB({
      caption_id: captionId,
      video_id: videoId,
      lang: lang,
      text: text
    });
    let content = text.slice(text.indexOf("<p begin"), text.lastIndexOf("</p>")+4);
    let items = content.split("</p>");
    let data = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].indexOf("<p begin=\"") == -1) {
        continue;
      }
      let indexBegin = items[i].indexOf("<p begin=\"");
      let begin = items[i].slice(indexBegin + 10, indexBegin + 22);
      let indexEnd = items[i].indexOf("end=\"");
      let end = items[i].slice(indexEnd + 5, indexEnd + 17);
      let textItem = items[i].slice(items[i].indexOf("style=\"s2\">") + 11, items[i].length);
      textItem = textItem.replace(/\n/g, '');
      data.push({
        begin: begin,
        end: end,
        text: textItem,
      });
    }

    return [data, translationCaption];
  }

  async getCaptionsByVideoId(videoId, refreshToken) {
    let listParams: youtube_v3.Params$Resource$Captions$List = {
      part: ["snippet", "id"],
      videoId: videoId
    }

    let yt = await this.authYoutube(refreshToken);
    return await yt.captions.list(listParams).then((response) => {
      return response.data.items;
    }).catch((error) => {
      throw new HttpException(error, 499);
    });
  }

  async deleteCaption(captionId, refreshToken) {
    let listParams: youtube_v3.Params$Resource$Captions$Delete = {
      id: captionId
    }

    let yt = await this.authYoutube(refreshToken);
    return await yt.captions.delete(listParams).then((response) => {
      return response.data;
    }).catch((error) => {
      throw new HttpException(error, 499);
    });
  }

  async addCaptionToVideo(path: string, videoId, lang, refreshToken) {
    let fileBuffer = createReadStream(join(path));
    const listParams: youtube_v3.Params$Resource$Captions$Insert = {
      part: ['id', 'snippet'],
      requestBody: {
        snippet: {
          language: lang,
          name: "",
          videoId: videoId
        },
      },
      media: {
        mimeType: 'application/octet-stream',
        body: Readable.from(fileBuffer)
      }
    };
    let yt = await this.authYoutube(refreshToken);
    return await yt.captions.insert(listParams).then((response) => {
      unlinkSync(path);
      return response.data;
    }).catch((error) => {
      throw new HttpException(error, 499);
    });
  }

  async updateCaptionToVideo(path: string, captionId, refreshToken) {
    let fileBuffer = createReadStream(join(path));
    const listParams: youtube_v3.Params$Resource$Captions$Update = {
      part: ['id', 'snippet'],
      requestBody: {
        id: captionId,
      },
      media: {
        mimeType: 'application/octet-stream',
        body: Readable.from(fileBuffer)
      }
    };
    let yt = await this.authYoutube(refreshToken);
    return await yt.captions.update(listParams).then((response) => {
      unlinkSync(path);
      return response.data;
    }).catch((error) => {
      throw new HttpException(error, 499);
    });
  }

  async authYoutube(refreshToken) {
    this.oauth2Client.setCredentials({refresh_token: refreshToken});
    return new youtube_v3.Youtube({auth: this.oauth2Client});
  }

  async getTotalVideo(refreshToken, auth?) {
    const data: any = await this.getVideos({}, refreshToken, auth);
    return data.pageInfo.totalResults;
  }

  async getInfoAccountYoutube(refreshToken) {
    this.oauth2Client.setCredentials({refresh_token: refreshToken});
    let authYoutube = new oauth2_v2.Oauth2({auth: this.oauth2Client});
    return await authYoutube.userinfo.get().then((response) => {
      return response.data;
    }).catch((error) => {
      throw new HttpException(error, 499);
    });
  }

  async refreshAccount(youtubeAccountId, refreshToken) {
    const infoAccount: any = await this.getInfoAccountYoutube(refreshToken);
    const totalVideo = await this.getTotalVideo(refreshToken);
    const infoChannel: any = await this.getInfoChannel(refreshToken);
    return await this.youtubeAccountEntity.update({id : youtubeAccountId}, {
      total_video: totalVideo,
      email: infoAccount.email,
      name: infoAccount.name,
      id_channel: infoChannel.id,
      picture: infoChannel.snippet.thumbnails.default.url,
      name_channel: infoChannel.snippet.title,
      description: infoChannel.snippet.description,
      custom_url: infoChannel.snippet.customUrl,
    });
  }

  async translationCaptionToVideo(data, refreshToken, userId) {
    const caption = await this.findCaptionByVideoId(data.video_id);
    const captionsOfVideo: any = await this.getCaptionsByVideoId(data.video_id, refreshToken)
    let content = JSON.parse(data.content);
    for (let i = 0; i < captionsOfVideo.length; i++) {
      if (data.lang == captionsOfVideo[i].snippet.language) {
        await this.deleteCaption(captionsOfVideo[i].id, refreshToken);
      }
    }

    let path = await this.createFileUploadCaption(content, caption.text, data.video_id, data.lang);
    await this.addCaptionToVideo(path, data.video_id, data.lang, refreshToken)

    if (data.is_default_lang == true) {
      await this.updateAudioLangDefault(refreshToken, data.video_id, data.lang)
    }

    await this.captionPushHistory(data, userId);
    return true;
  }

  async createOrUpdateCaptionToDB(data) {
    const caption = await this.findCaptionByVideoId(data.video_id);
    if (caption) {
      return await this.captionEntity.update({id : caption.id}, data)
    }

    return await this.captionEntity.save(data)
  }

  async findCaptionByVideoId(videoId) {
    return await this.captionEntity.findOne({
      where: { video_id: videoId }
    })
  }

  async createFileUploadCaption(data, text, videoId, lang) {
    let content = text.slice(text.indexOf("<p begin"), text.lastIndexOf("</p>")+4);
    let items = content.split("</p>");
    for (let i = 0; i < items.length; i++) {
      if (items[i].indexOf("<p begin=\"") == -1) {
        continue;
      }
      let indexBegin = items[i].indexOf("<p begin=\"");
      let begin = items[i].slice(indexBegin + 10, indexBegin + 22);

      for (let j = 0; j < data.length; j++) {
        if (data[i].begin == begin) {
          items[i] = items[i].slice(0, items[i].indexOf("style=\"s2\">") + 11) + data[i].text + "</p>";
        }
      }
    }

    let newContent = items.reduce((sum, num) => sum + num);
    let newText = text.replace(content, newContent)
    let path = "publish/caption-"+videoId+"-"+lang+"-"+ Date.now() +".txt";
    writeFileSync(path, newText);
    return path;
  }

  async getVideosYoutubeCache(param, refreshToken) {
    let query = `v.youtube_account_id = ${param.youtube_account_id}`;
    if (param.text) {
      query += ` AND v.text = "${param.text}"`;
    }
    if (param.page_token) {
      query += ` AND v.page_token = "${param.page_token}"`;
    }
    const entityVideo = await this.VideoEntity.createQueryBuilder('v')
        .where(query).getOne();
    if (entityVideo) {
      return JSON.parse(entityVideo.content);
    }

    const data = await this.getVideos(param, refreshToken);
    await this.VideoEntity.save({
      youtube_account_id: param.youtube_account_id,
      text: param.text ?? null,
      page_token: param.page_token ?? null,
      content: JSON.stringify(data),
    });
    return data;
  }

  async deleteCacheVideo(youtubeAccountId) {
    return await this.VideoEntity.update({youtube_account_id : youtubeAccountId}, {deletedAt: new Date()});
  }

  async getInfoChannel(refreshToken) {
    const listParams: youtube_v3.Params$Resource$Channels$List = {
      part: ['id', 'snippet'],
      mine: true
    };
    let yt = await this.authYoutube(refreshToken);
    return await yt.channels.list(listParams).then((response) => {
      if (response.data.items) {
        return response.data.items[0];
      }
      throw new HttpException("Google-account-has-no-channel", 452);
    }).catch((error) => {
      throw new HttpException(error.response, error.status);
    });
  }

  async videoPushHistory(content: updateVideo, userId) {
      const videoPushHistory = await this.VideoPushEntity.findOne({
          where: { video_id: content.video_id, user_id: userId, youtube_account_id: content.youtube_account_id}
      });

      if (videoPushHistory) {
        return await this.VideoPushEntity.update({id : videoPushHistory.id}, {
          localizations: content.localizations,
          default_lang: content.default_lang,
          exclude_title: content.exclude_title,
          exclude_description: content.exclude_description,
          category_id: content.category_id
        })
      }

      return await this.VideoPushEntity.save({
        user_id: userId,
        video_id: content.video_id,
        youtube_account_id: content.youtube_account_id,
        localizations: content.localizations,
        default_lang: content.default_lang,
        exclude_title: content.exclude_title,
        exclude_description: content.exclude_description,
        category_id: content.category_id
      });
  }

  async getVideoPushHistory(query: getVideoPushHistory, userId) {
    return await this.VideoPushEntity.findOne({
      where: { video_id: query.video_id, user_id: userId, youtube_account_id: query.youtube_account_id}
    });
  }

  async getListVideoPushHistory(youtubeAccountId, userId) {
    return await this.VideoPushEntity.find({
      where: { user_id: userId, youtube_account_id: youtubeAccountId}
    });
  }

  async handleCheckPushVideo(data, listVideoPush, listCaptionPush) {
    let videosIdPush = listVideoPush.map(item => item.video_id);
    let captionsIdPush = listCaptionPush.map(item => item.video_id);
    let items = data.items;
    for (let i = 0; i < items.length; ++i) {
      items[i].is_push = false;
      items[i].is_push_caption = false;
      if (videosIdPush.includes(items[i].id.videoId)) {
        items[i].is_push = true;
      }

      if (captionsIdPush.includes(items[i].id.videoId)) {
        items[i].is_push_caption = true;
      }
    }
    data.items = items;
    return data;
  }

  async getLanguagesYoutube(refreshToken) {
    const listParams: youtube_v3.Params$Resource$I18nlanguages$List = {
      part: ['id', 'snippet']
    };
    let yt = await this.authYoutube(refreshToken);
    return await yt.i18nLanguages.list(listParams).then((response) => {
        return response.data;
    }).catch((error) => {
      throw new HttpException(error.response, error.status);
    });
  }

  async captionPushHistory(content: translationCaption, userId) {
    const captionPushHistory = await this.CaptionPushEntity.findOne({
      where: { video_id: content.video_id, user_id: userId, youtube_account_id: content.youtube_account_id, lang: content.lang}
    });

    if (captionPushHistory) {
      return await this.CaptionPushEntity.update({id : captionPushHistory.id}, {
        content: content.content,
        lang: content.lang,
        exclude_text: content.exclude_text,
        is_default_lang: content.is_default_lang
      })
    }

    return await this.CaptionPushEntity.save({
      user_id: userId,
      video_id: content.video_id,
      youtube_account_id: content.youtube_account_id,
      lang: content.lang,
      exclude_text: content.exclude_text,
      content: content.content,
      is_default_lang: content.is_default_lang
    });
  }

  async getCaptionPushHistory(query: getCaptionPushHistory, userId) {
    return await this.CaptionPushEntity.find({
      where: { video_id: query.video_id, user_id: userId, youtube_account_id: query.youtube_account_id}
    });
  }

  async getListCaptionPushHistory(youtubeAccountId, userId) {
    return await this.CaptionPushEntity.find({
      where: { user_id: userId, youtube_account_id: youtubeAccountId}
    });
  }

  async updateAudioLangDefault(refreshToken, videoId, lang) {
    const detailVideo: any = await this.detailVideo(videoId, refreshToken);
    let snippet = detailVideo.snippet;
    if (snippet.defaultAudioLanguage == lang) {
      return true;
    }
    snippet.defaultAudioLanguage = lang;
    let listParams: youtube_v3.Params$Resource$Videos$Update = {
      part: ["snippet", "id"],
      requestBody: {
        id : videoId,
        snippet: snippet
      }
    }
    let yt = await this.authYoutube(refreshToken);
    return await yt.videos.update(listParams).then((response) => {
      return response.data;
    }).catch((error) => {
      this.logger.log(error);
      throw new HttpException(error, 499);
    });
  }

  async getTotalTranslationCaptionByUserId(userId, youtubeAccountIds) {
    const items = await this.CaptionPushEntity.createQueryBuilder('c')
        .select(["c.video_id"])
        .where( `c.user_id = ${userId} And c.youtube_account_id IN (${youtubeAccountIds.toString()})`)
        .getMany();
    return await this.totalItemInValueOfObject(items);
  }

  async getTotalTranslationVideoByUserId(userId, youtubeAccountIds) {
    const items = await this.VideoPushEntity.createQueryBuilder('v')
        .select(["v.video_id"])
        .where( `v.user_id = ${userId} And v.youtube_account_id IN (${youtubeAccountIds.toString()})`)
        .getMany();
    return await this.totalItemInValueOfObject(items);
  }

  async getAllAccountYoutubeByUserId(userId) {
    return await this.youtubeAccountEntity.createQueryBuilder('ya')
        .select(["ya.id", "ya.user_id", "ya.total_video"])
        .where( `ya.user_id = ${userId}`)
        .getManyAndCount();
  }

  async totalItemInValueOfObject(object) {
    let result = object.map(a => a.video_id);
    let uniqueValue = result.filter((value, index, array) => array.indexOf(value) === index);
    return uniqueValue.length;
  }
}

        ### 📄 src/services/mail.service.ts
        > **Context Summary**
        * 📦 Classes: MailService

        ```ts
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

        ### 📄 src/services/translateGoogle.service.ts
        > **Context Summary**
        * 📦 Classes: TranslateGoogleService

        ```ts
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

        ### 📄 src/services/token.service.ts
        > **Context Summary**
        * 📦 Classes: TokenService

        ```ts
        import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenEntity } from 'src/entities/token-key.entity';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(TokenEntity) private tokenEntity: Repository<TokenEntity>,
    @InjectRepository(UserEntity) private userEntity: Repository<UserEntity>,
  ) {}

  async findOne(key: string) {
    const token = await this.tokenEntity.findOne({
      where: { key },
    });
    if (token) return token;
    return null;
  }

  async create(user_id: number, key: string) {
    return await this.tokenEntity.save(
      this.tokenEntity.create({
        user_id: user_id,
        key,
      }),
    );
  }

  async deleteToken(user_id: number) {
    await this.tokenEntity.delete({
      user_id: user_id,
    });
  }
}

        ### 📄 src/entities/token-key-admin.entity.ts
        > **Context Summary**
        * 📦 Classes: TokenAdminEntity

        ```ts
        import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity('token_key_admin')
@Index('admin_id_type', ['adminId', 'type'], { unique: true })
export class TokenAdminEntity {
  @PrimaryColumn({ type: 'varchar', unique: true })
  key: string;

  @Column({
    name: 'adminId',
    type: 'int',
  })
  adminId: number;

  @Column({ type: 'varchar', default: 'refresh' })
  type: string;
}

        ### 📄 src/entities/youtube-account.entity.ts
        > **Context Summary**
        * 📦 Classes: YoutubeAccountEntity

        ```ts
        import { BaseEntity } from 'src/entities/base.entity';
import {
  Column,
  Entity, JoinColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import {UserEntity} from "./user.entity";

@Entity('youtube_account')
export class YoutubeAccountEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Column({type: 'int'})
  user_id: number;

  @Column({ type: 'varchar', nullable: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  id_channel: string;

  @Column({ type: 'varchar', nullable: true })
  name_channel: string;

  @Column({ type: 'varchar', nullable: true })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  custom_url: string;

  @Column({ type: 'varchar', nullable: true })
  picture: string;

  @Column({ type: 'varchar', nullable: false })
  refresh_token: string;

  @Column({ type: 'int', nullable: true, default: 0 })
  total_video: number;

  @ManyToOne(() => UserEntity, (u) => u.youtubeAccounts, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;
}

        ### 📄 src/entities/role.entity.ts
        > **Context Summary**
        * 📦 Classes: RoleEntity

        ```ts
        import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'role' })
export class RoleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  role: string;
}

        ### 📄 src/entities/file-import.entity.ts
        > **Context Summary**
        * 📦 Classes: FileImportEntity

        ```ts
        import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
export class FileImportEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  file_url: string;

  @Column()
  file_name: string;

  @Column()
  file_size: number;

  @Column()
  file_key: string;

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: true, default: 0 })
  records: number;

  @Column({ nullable: true, default: 0 })
  total: number;

  @Column({ nullable: true })
  job_id: number;
}

        ### 📄 src/entities/payment.entity.ts
        > **Context Summary**
        * 📦 Classes: PaymentEntity

        ```ts
        import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { BaseEntity } from './base.entity';

@Entity({ name: 'payment' })
export class PaymentEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint' })
  user_id: number;

  @Column({ type: 'varchar', nullable: true })
  payment_order_id: string;

  @Column({ type: 'varchar', nullable: true })
  rank: string;

  @Column({ type: 'varchar', nullable: true })
  payment_status: string;

  @Column({ type: 'varchar', nullable: true })
  status: string;

  @Column({ type: 'float', nullable: true })
  tax: number;

  @Column({ type: 'float', nullable: true })
  sub_total: number;

  @Column({ type: 'float', nullable: true })
  total: number;

  @Column({ name: 'expire_date', nullable: true})
  expire_date: Date;

  @Column({ name: 'payment_date', nullable: true})
  payment_date: Date;

  @Column({ name: 'start_date', nullable: true})
  start_date: Date;

  @Column({ type: 'varchar', nullable: true })
  payment_capture_id: string;

  @Column({ type: 'varchar', nullable: true })
  status_capture: string;

  @Column({ type: 'varchar', nullable: true })
  status_checkout_order: string;

  @Column({ type: 'json', nullable: true })
  purchase_units: string;
  
  @ManyToOne(() => UserEntity, (u) => u.payments, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;
}

        ### 📄 src/entities/video.entity.ts
        > **Context Summary**
        * 📦 Classes: VideoEntity

        ```ts
        import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'video' })
export class VideoEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  youtube_account_id: number;

  @Column({ type: 'varchar', nullable: true, default: null })
  text: string;

  @Column({ type: 'varchar', nullable: true, default: null })
  page_token: string;

  @Column({ type: 'longtext', nullable: false })
  content: string;
}

        ### 📄 src/entities/change_rank.entity.ts
        > **Context Summary**
        * 📦 Classes: ChangeRankEntity

        ```ts
        import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  import { UserEntity } from './user.entity';
  import { BaseEntity } from './base.entity';
  
  @Entity({ name: 'change_rank' })
  export class ChangeRankEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: 'bigint' })
    user_id: number;
  
    @Column({ type: 'varchar', nullable: true })
    current_rank: string;
  
    @Column({ type: 'varchar', nullable: true })
    change_rank: string;

    @Column({ type: 'json', nullable: true })
    keep_yt_account_id?: [];
    
    @OneToOne(() => UserEntity, (u) => u.changeRank, {
        createForeignKeyConstraints: false,
    })
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;
  }
  
        ### 📄 src/entities/user.entity.ts
        > **Context Summary**
        * 📦 Classes: UserEntity

        ```ts
        import { BaseEntity } from 'src/entities/base.entity';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {AccountType} from "../common/base.enum";
import {YoutubeAccountEntity} from "./youtube-account.entity";
import { ChangeRankEntity } from './change_rank.entity';
import { PaymentEntity } from './payment.entity';

@Entity('user')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Column({ type: 'varchar', nullable: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  phone: string;

  @Column({ type: 'varchar', nullable: true})
  password: string;

  @Column({ type: 'varchar', nullable: false, default: AccountType.NORMAL })
  type: string;

  @Column({ type: 'varchar', nullable: true })
  first_name: string;

  @Column({ type: 'varchar', nullable: true })
  last_name: string;

  @Column({ type: 'varchar', nullable: true })
  level: string;

  @Column({ name: 'is_verify', type: 'bool', nullable: false, default: false })
  is_verify: boolean;

  @Column({ type: 'varchar', nullable: true })
  phone_code: string; 

  @Column({ nullable: true })
  expire_verify: Date;

  @Column({ type: 'varchar', nullable: true })
  payer_id: string;

  @Column({ name: 'expire_date', nullable: true})
  expire_date: Date;

  @Column({ name: 'payment_date', nullable: true})
  payment_date: Date;

  @Column({ name: 'start_date', nullable: true})
  start_date: Date;

  @Column({ type: 'int' , default: 0})
  number_payment_err: number;
  
  @Column({
    name: 'verify_token',
    type: 'varchar',
    nullable: false,
    default: false,
  })
  verify_token: string;

  @Column({ type: 'boolean', default: true , comment: 'true send email verify and false send with phone'})
  type_verify: boolean;

  @Column({ name: 'payment_before_deadline', type: 'bool', nullable: true, default: false })
  payment_before_deadline: boolean;

  @OneToMany(() => YoutubeAccountEntity, (ya) => ya.user, {
    createForeignKeyConstraints: false,
    cascade: true,
  })
  youtubeAccounts: YoutubeAccountEntity[];

  @OneToMany(() => PaymentEntity, (pc) => pc.user, {
    createForeignKeyConstraints: false,
    cascade: true,
  })

  payments: PaymentEntity[];

  @OneToOne(() => ChangeRankEntity, (cr) => cr.user, {
    createForeignKeyConstraints: false,
  })
  changeRank: ChangeRankEntity;
}

        ### 📄 src/entities/caption.entity.ts
        > **Context Summary**
        * 📦 Classes: CaptionEntity

        ```ts
        import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'cation' })
export class CaptionEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  video_id: number;

  @Column({ type: 'varchar', nullable: true })
  caption_id: string;
  
  @Column({ type: 'longtext', nullable: true })
  text: string;

  @Column({ type: 'varchar', nullable: true })
  lang: string;
}

        ### 📄 src/entities/otp.entity.ts
        > **Context Summary**
        * 📦 Classes: OtpEntity

        ```ts
        import { BaseEntity } from 'src/entities/base.entity';
import { OTPTYPE } from 'src/common/base.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'otp' })
export class OtpEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  email: string;

  @Column({ type: 'varchar' })
  type: OTPTYPE;

  @Column({ default: false })
  is_resend: boolean;
}

        ### 📄 src/entities/video-push.entity.ts
        > **Context Summary**
        * 📦 Classes: VideoPushEntity

        ```ts
        import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'video_push' })
export class VideoPushEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  user_id: number;

  @Column({ type: 'varchar', nullable: false })
  video_id: string;

  @Column({ type: 'int', nullable: false })
  youtube_account_id: number;

  @Column({ type: 'longtext', nullable: false })
  localizations: string;

  @Column({ type: 'varchar', nullable: false })
  default_lang: string;

  @Column({ type: 'varchar', nullable: false })
  category_id: string;

  @Column({ type: 'varchar', nullable: true })
  exclude_title: string;

  @Column({ type: 'varchar', nullable: true })
  exclude_description: string;
}

        ### 📄 src/entities/caption-push.entity.ts
        > **Context Summary**
        * 📦 Classes: CaptionPushEntity

        ```ts
        import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'caption_push' })
export class CaptionPushEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  user_id: number;

  @Column({ type: 'varchar', nullable: false })
  video_id: string;

  @Column({ type: 'int', nullable: false })
  youtube_account_id: number;

  @Column({ type: 'longtext', nullable: false })
  content: string;

  @Column({ type: 'varchar', nullable: false })
  lang: string;

  @Column({ type: 'varchar', nullable: true })
  exclude_text: string;

  @Column({ type: 'boolean', default: false })
  is_default_lang: boolean;
}

        ### 📄 src/entities/base.entity.ts
        > **Context Summary**
        * 📦 Classes: BaseEntity

        ```ts
        import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

export class BaseEntity {
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  public createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    nullable: true,
  })
  public updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    nullable: true,
  })
  public deletedAt: Date;
}

        ### 📄 src/entities/token-key.entity.ts
        > **Context Summary**
        * 📦 Classes: TokenEntity

        ```ts
        import { AccountType } from 'src/common/base.enum';
import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity('token_key')
@Index('user_id_type', ['user_id', 'type'], { unique: true })
export class TokenEntity {
  @PrimaryColumn({ type: 'varchar', unique: true, length: '500' })
  key: string;

  @Column({
    name: 'user_id',
    type: 'int',
  })
  user_id: number;

  @Column({ type: 'varchar', default: AccountType.NORMAL })
  type: string;
}

        ### 📄 src/strategy/local-strategy.ts
        > **Context Summary**
        * 📦 Classes: LocalStrategy

        ```ts
        import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from 'src/services/auth.service';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email_or_phone',
      passwordField: 'password',
      passReqToCallback: true,
    });
  }

  async validate(payload: any) {
    return await this.authService.validateUser(payload.body.email_or_phone, payload.body.password, payload.body.phone_code);
  }
}

        ### 📄 src/strategy/auth-jwt.strategy.ts
        > **Context Summary**
        * 📦 Classes: AuthJwtStrategy, RefreshJwtStrategy

        ```ts
        import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from 'src/services/auth.service';
import { ConfigService } from '@nestjs/config';
import { SignUpReq } from 'src/dtos/auth.dto';

@Injectable()
export class AuthJwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_KEY'),
    });
  }

  async validate(payload: any) {
    return payload;
  }
}

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_KEY'),
    });
  }

  async validate(payload: any) {
    return payload;
  }
}

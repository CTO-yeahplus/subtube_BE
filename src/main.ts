/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import * as dns from 'dns';
const originalLookup = dns.lookup;
// lookup 함수 덮어쓰기 (무조건 family: 4 강제)
(dns as any).lookup = (hostname, options, callback) => {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  options = options || {};
  options.family = 4; // 👈 여기가 핵심! 무조건 IPv4만 찾아라!
  return originalLookup(hostname, options, callback);
};

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

  // 1. 서버 실행 (기다림)
  await app.listen(process.env.PORT || 3000, '0.0.0.0');

  // 2. 주소 출력
  console.log(`🚀 Application is running on: ${await app.getUrl()}`);
  }

bootstrap();

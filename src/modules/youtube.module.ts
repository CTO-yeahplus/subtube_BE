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

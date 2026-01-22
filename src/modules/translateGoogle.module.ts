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

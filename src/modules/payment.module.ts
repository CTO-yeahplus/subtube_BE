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

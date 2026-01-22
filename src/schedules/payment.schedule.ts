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
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
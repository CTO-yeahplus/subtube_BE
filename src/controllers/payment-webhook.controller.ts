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

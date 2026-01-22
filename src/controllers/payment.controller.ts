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

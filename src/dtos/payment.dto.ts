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

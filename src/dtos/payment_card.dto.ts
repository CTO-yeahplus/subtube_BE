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



import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import {Transform, Type} from "class-transformer";
import {NUMBER_PAGE} from "./constant";
import {
  IsArray,
  IsDefined,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min
} from "class-validator";
import {SORTBY} from "./base.enum";

export class BaseResDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty()
  code: number;
}

class SuccessContentDto {
  @ApiProperty()
  success: boolean;
}

export class SuccessResDto extends BaseResDto {
  @ApiProperty({ type: SuccessContentDto })
  data: SuccessContentDto;
}

export class ResponsePaginateDto {
  @ApiProperty()
  page: number;

  @ApiProperty()
  pageSize: number;

  @ApiProperty()
  total: number;

  @ApiProperty()
  pageCount: number;
}

export class ResponseWithPagingDto extends BaseResDto {
  @ApiProperty({ type: ResponsePaginateDto })
  pagination: BaseResDto;
}

export class BaseQueryReq {
  @ApiProperty({ required: false })
  @Transform((params) => (params.value === '' ? NUMBER_PAGE.PAGE : +params.value))
  @IsOptional()
  page?: number = 1;

  @ApiProperty({ required: false })
  @Transform((params) => (params.value === '' ? NUMBER_PAGE.PAGE_SIZE : +params.value))
  @IsOptional()
  pageSize?: number = 10;

  @ApiProperty({ required: false, enum: SORTBY })
  @IsOptional()
  @IsEnum(SORTBY)
  sortBy?: SORTBY = SORTBY.desc;

  @ApiProperty({ required: false })
  @IsOptional()
  sortField?: string;
}
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class FileReqDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
  @ApiProperty({ required: false })
  file_url: any;
  @ApiProperty({ required: true })
  @IsNotEmpty({
    message: i18nValidationMessage('message.COMMON.REQUIRED'),
  })
  @IsNumber({}, { message: i18nValidationMessage('message.COMMON.NUMBER') })
  @Min(1, { message: i18nValidationMessage('message.COMMON.MIN_PAGINATION') })
  @Type(() => Number)
  limit: number;

  @ApiProperty({ required: true })
  @IsNotEmpty({
    message: i18nValidationMessage('message.COMMON.REQUIRED'),
  })
  @IsNumber({}, { message: i18nValidationMessage('message.COMMON.NUMBER') })
  @Min(1, { message: i18nValidationMessage('message.COMMON.MIN_PAGINATION') })
  @Type(() => Number)
  page: number;
}
export class ReqBodyDto {
  @ApiProperty({ required: true })
  link: string;
}
export class fileReq {
  @ApiProperty({ required: true })
  fileId: number;
}

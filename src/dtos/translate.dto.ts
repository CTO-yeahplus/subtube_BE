import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, MaxLength } from 'class-validator';
import { BaseResDto } from 'src/common/base.dto';

export class ReqBodyDetectTranslateDto {
  @ApiProperty({ required: true })
  @IsOptional()
  text: string;
}

export class ReqBodyTranslateDto {
  @ApiProperty({ required: true })
  @IsOptional()
  @MaxLength(100)
  title: string;

  @ApiProperty({ required: true })
  @IsOptional()
  @MaxLength(5000)
  description: string;

  @ApiProperty({ required: true })
  @IsOptional()
  languages: [];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  exclude_titles?: [];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  exclude_descriptions?: [];
}
export class ReqBodyTranslateCaptionDto {
  @ApiProperty({ required: true })
  @IsOptional()
  @IsArray()
  captions?: [];

  @ApiProperty({ required: true })
  @IsOptional()
  languages: [];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  exclude_captions?: [];
}

export class translateRes extends BaseResDto {
  @ApiProperty({ type: ReqBodyTranslateDto })
  data: ReqBodyTranslateDto;
}


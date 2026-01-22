import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional } from 'class-validator';
import { OTPTYPE } from 'src/common/base.enum';

export class OtpCreateDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({ type: OTPTYPE })
  @IsEnum(OTPTYPE)
  type: OTPTYPE;

  is_resend?: boolean;
  token_verify?: string;
}

export class OtpCriteriaDto {
  @ApiProperty()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty()
  @IsOptional()
  code?: string;

  @ApiProperty({ type: OTPTYPE })
  @IsEnum(OTPTYPE)
  @IsOptional()
  type?: OTPTYPE;

  @ApiProperty()
  @IsOptional()
  is_resend?: boolean;
}

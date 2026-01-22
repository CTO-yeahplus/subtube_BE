import {ApiProperty, ApiResponseProperty} from '@nestjs/swagger';
import {IsEmail, IsNotEmpty, IsNumberString, IsOptional, IsString, Length, MaxLength, NotContains} from 'class-validator';

export class AuthDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  email_or_phone: string;

  @ApiProperty({ required: false })
  @IsOptional()
  phone_code: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @Length(8, 32)
  password: string;
}

export class RefreshTokenReq {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

export class VerifyAccount {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  id?: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  token?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @MaxLength(64)
  email?: string;
}

export class SignInRes {
  @ApiResponseProperty({ type: Number })
  id: number;

  @ApiResponseProperty({ type: String })
  access_token: string;

  @ApiResponseProperty({ type: String })
  name: string

  @ApiResponseProperty({ type: String })
  type: string

  @ApiResponseProperty({ type: String })
  email_or_phone: string

  @ApiResponseProperty({ type: String })
  refresh_token: string;
}

export class SignUpReq {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @MaxLength(64)
  first_name: string;

  @ApiProperty({ required: true })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  last_name: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(64)
  email: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @Length(8, 30)
  @IsNotEmpty({message: 'This field cannot be empty'})
  @NotContains(' ', { message: 'Password cannot contain space characters' })
  password: string;

  @ApiProperty({ required: true })
  @IsOptional()
  @IsNumberString()
  @MaxLength(15)
  @IsNotEmpty({message: 'This field cannot be empty'})
  phone: string;

  @ApiProperty({ required: true })
  @IsOptional()
  phone_code: string;
}

export class SignUpRes {
  @ApiResponseProperty({ type: Number })
  accountId: number;

  @ApiResponseProperty({ type: String })
  first_name: string;

  @ApiResponseProperty({ type: String })
  last_name: string;

  @ApiResponseProperty({ type: String })
  access_token: string;

  @ApiResponseProperty({ type: String })
  email: string;
}

export interface TokenContent {
  id?: number;
  email?: string;
  user_type?: string;
  key?: string;
  user_id?: number;
  language?: string;
  email_or_phone?: string;
}
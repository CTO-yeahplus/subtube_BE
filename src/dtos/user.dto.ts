import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  NotContains,
} from 'class-validator';
import { BaseQueryReq } from '../common/base.dto';
import { METHOD_VERIFY_USER, USERSORTFIELD } from '../common/base.enum';
import {BaseResDto, ResponseWithPagingDto} from "../common/base.dto";

export class UserDto extends BaseQueryReq {
  @ApiProperty({ required: false, enum: USERSORTFIELD })
  @IsOptional()
  @IsEnum(USERSORTFIELD)
  sortField?: string;
}

export class SearchUserAdminReq extends UserDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @MaxLength(200)
  search: string;

  @ApiProperty({ required: false })
  @IsOptional()
  filterUser?: string;
}

export class UserReqUpdate {
  @ApiProperty({ required: true })
  @IsOptional()
  @MaxLength(64)
  first_name: string;

  @ApiProperty({ required: true })
  @IsOptional()
  @MaxLength(64)
  last_name: string;

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

export class UserCreateReq extends UserReqUpdate {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @NotContains(' ', { message: 'Password cannot contain “space” characters' })
  @Length(8)
  password: string;

  @ApiProperty()
  @IsBoolean()
  isVerify: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsNotEmpty()
  @IsNumberString()
  @MaxLength(15)
  phone: string;
}

export class PhoneOrEmail {
  phone?: string;
  email?: string;
}

class UserContent {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  first_name: string;

  @ApiProperty()
  last_name: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  level: string;
}

export class UserRes extends BaseResDto {
  @ApiProperty({ type: UserContent })
  data: UserContent;
}

export class UserResPaginate extends ResponseWithPagingDto {
  @ApiProperty({ type: [UserContent] })
  data: UserContent[];
}

export class ChangePasswordReq {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  currentPassword: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  newPassword: string;
}

export class ForgetPasswordReq {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({ required: true, enum: METHOD_VERIFY_USER, description: 'Email, Phone' })
  @IsNotEmpty()
  @IsString()
  @IsEnum(METHOD_VERIFY_USER)
  method?: string;
}

export class VerifyUserReq {
  @ApiProperty({ required: false })
  @IsString()
  email_or_phone: string;

  @ApiProperty({ required: false })
  @IsString()
  phone_code: string;
}

export class VerifyForgetPasswordReq {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  token: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  email: string;
}
export class VerifyForgetPasswordSmsReq {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ required: true })
  @IsString()
  phone_code: string;
}

export class AuthVerifyByCode {
  @ApiProperty()
  @IsString()
  code: string;

  @ApiProperty()
  @IsEmail()
  email: string;
}

export class AuthResetPasswordDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  code: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty({ required: false })
  @IsOptional()
  phone: string;

  @ApiProperty({ required: false })
  @IsOptional()
  phone_code: string;
  
  @ApiProperty({ required: true, enum: METHOD_VERIFY_USER, description: 'Email, Phone' })
  @IsNotEmpty()
  @IsString()
  @IsEnum(METHOD_VERIFY_USER)
  method?: string;
}

export class ResendEmailReq {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  email: string;
}

export class AccountReq {
  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsBoolean()
  isVerify: boolean;
}

export class ChangePasswordByAdminReq {
  @ApiProperty()
  @IsString()
  password: string;
}
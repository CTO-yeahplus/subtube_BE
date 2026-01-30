import {
  BadRequestException, ForbiddenException, HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  AuthDto,
  SignUpReq,
  VerifyAccount,
  TokenContent,
} from '../dtos/auth.dto';
import { Connection, DataSource, EntityManager, Repository } from 'typeorm';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import {
  generateToken,
  hashPassword,
  comparePassword,
  hashCrypt,
  verifyToken,
  decryptHashedEmail,
} from '../utils';
import { AccountType, METHOD_VERIFY_USER, OTPTYPE } from '../common/base.enum';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { UserEntity } from '../entities/user.entity';
import { TokenService } from './token.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/services/mail.service';
import { OptService } from './otp.service';
import { VerifyForgetPasswordReq, VerifyForgetPasswordSmsReq, VerifyUserReq } from 'src/dtos/user.dto';
import { I18nService } from 'nestjs-i18n';
import { OtpEntity } from "../entities/otp.entity";
import { FirebaseService } from './firebase.service';
import { UserService } from './user.service';

@Injectable()
export class AuthService {

  constructor(
    @InjectConnection() private readonly connection: Connection,
    private configService: ConfigService,
    private mailService: MailService,
    @InjectRepository(UserEntity) private userEntity: Repository<UserEntity>,
    private tokenService: TokenService,
    private dataSource: DataSource,
    private otpService: OptService,
    private jwtService: JwtService,
    private firebaseService: FirebaseService,
    private userService: UserService,
    private readonly i18n: I18nService,
    @InjectRepository(OtpEntity) private otpEntity: Repository<OtpEntity>,
  ) {}

  async signUp(signUpReq: SignUpReq) {
    await this.connection.transaction(async (manager: EntityManager) => {
      const isNeedVerify = false;
      // Check email
      const checkEmail = await manager.findOne(UserEntity, {
        where: {
          email: signUpReq.email.toLowerCase(),
        }
      });

      if (checkEmail && checkEmail.is_verify === true) {
        throw new BadRequestException('err', 'EMAIL_TAKEN');
      }

      const timeDate = new Date();
      const verifyToken = crypto.randomBytes(32).toString('hex');
      const newAccount = await manager.upsert(
          UserEntity,
        {
          id: checkEmail?.id,
          password: hashPassword(signUpReq.password),
          type: AccountType.NORMAL,
          is_verify: isNeedVerify,
          verify_token: verifyToken,
          expire_verify: timeDate,
          email: signUpReq?.email.toLowerCase(),
        },
        ['id'],
      );

      const newAccountId = newAccount.raw.insertId;
      const verifyAccountPayload: TokenContent = {
        id: newAccountId,
        email: signUpReq.email,
        user_type: AccountType.NORMAL,
      };

      generateToken(
        verifyAccountPayload,
        this.configService.get('REFRESH_EXPIRE_TIME'),
        this.configService.get('JWT_KEY'),
      );

      const userActiveUrl = `${process.env.APP_DOMAIN}auth/verify?id=${newAccountId}&token=${verifyToken}`;
      // Send mail
      this.mailService
        .sendMail(signUpReq.email, userActiveUrl, signUpReq.last_name)
        .then(() => console.log('Send mail successfully'));
    });
    return {
      email: signUpReq.email,
    };
  }

  async handleResLogin(payload: TokenContent) {
    const { id, email } = payload;
    await this.tokenService.deleteToken(id);
    const accessTime = this.configService.get('EXPIRE_TIME');
    const refreshTime = this.configService.get('REFRESH_EXPIRE_TIME');
    const accessToken = generateToken(
      payload,
        accessTime,
      this.configService.get('JWT_KEY'),
    );
    const key = await hashCrypt(`${id}` + email);
    const createKey = await this.tokenService.create(id, key);
    const time = new Date();
    const refreshToken = generateToken(
      { key: createKey.key, id },
        refreshTime,
      this.configService.get('JWT_KEY'),
    );
    const expiredAccess = new Date(+time.getTime() + +accessTime);
    const expiredRefresh = new Date(+time.getTime() + +refreshTime);
    return { accessToken, refreshToken, expiredAccess, expiredRefresh };
  }

  async login(body: AuthDto) {
    let signIpRes = null;
    await this.connection.transaction(async (manager: EntityManager) => {
      const userInfo = await manager.findOne(UserEntity, {
        where: [{ email: body.email_or_phone }, { phone: body.email_or_phone }],
      });
      if (!userInfo) {
        throw new BadRequestException('err', 'USER_NOT_FOUND_EMAIL');
      }

      if (!userInfo.password) {
        throw new BadRequestException('err', 'INVALID_EMAIL');
      }
      if (!userInfo.is_verify) {
        signIpRes = {
          email: userInfo.email,
          accessToken: null,
          refreshToken: null,
          expired_access: null,
          expired_refresh: null,
        };

        throw new BadRequestException('err', 'USER_NOT_FOUND_EMAIL');
      } else {
        const checkPassword = comparePassword(
          body.password,
            userInfo.password,
        );
        if (!checkPassword) {
          throw new BadRequestException('err', 'WRONG_PASS_LOGIN');
        }
        const tokenPayload: TokenContent = {
          email: userInfo.email,
          user_type: AccountType.NORMAL,
          id: +userInfo.id,
        };
        signIpRes = await this.handleResLogin(tokenPayload);
      }
    });
    return signIpRes;
  }

  async verifyAccount(query: VerifyAccount) {
    const error = `${process.env.NEXT_PUBLIC_API_UR}/auth/signup/error`;
    const user = await this.userEntity.findOne({
      where: {
        id: query.id,
        verify_token: query.token,
      },
    });

    if (!user) {
      return error;
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const manager = queryRunner.manager;
      let deeplink = error;
      const dateNow = new Date();
      if (user.is_verify == false && dateNow < user.expire_verify) {
        await manager.update(UserEntity,
            {id: user.id},
            {is_verify: true}
        );
        const tokenPayload: TokenContent = {
          email_or_phone: user.email,
          user_type: AccountType.NORMAL,
          user_id: +user.id,
        };
        await this.handleResAuth(tokenPayload);
        deeplink = `${process.env.NEXT_PUBLIC_API_UR}/auth/verify-account`;
      }
      await queryRunner.commitTransaction();
      return deeplink;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(error, error.status);
    } finally {
      await queryRunner.release();
    }
  }

  async findUserByEmail(email: string) {
    const timeDate = new Date()
    const user = await this.userEntity
      .createQueryBuilder('us')
      .where('us.email = :email', { email })
      .getOne();
      
    if (!user || (user && user.expire_verify < timeDate && user.is_verify !== true)) {
      throw new BadRequestException('EMAIL_NOT_EXIST', 'EMAIL_NOT_EXIST');
    }

    if (user && !user.is_verify) {
      throw new NotFoundException('EMAIL_INFO_INVALID', 'EMAIL_INFO_INVALID');
    }

    return user;
  }

  async verifyAccountForgotPassword(query: VerifyForgetPasswordReq){
    const error = `${process.env.NEXT_PUBLIC_API_UR}/auth/verify-password/error`;
    const emailDecrypt = await decryptHashedEmail(query.email)
    let userByEmail = await this.findUserByEmail(emailDecrypt);
    let deeplink = error;
    const dateNow = new Date();

    if (!userByEmail) {
      return error;
    }

    const checkOtp = await this.otpService.findOne({
      email: emailDecrypt || '',
      code: query.token,
      type: OTPTYPE.FORGOT_PASSWORD,
    }, false);

    if (!checkOtp) {
      return deeplink;
    }

    if (!((dateNow.getDate() - checkOtp.createdAt.getDate()) * 1000 * 60 * 60 * 24 > 1000 * 60 * 60 * 24 * 2)) {
      deeplink = `${process.env.NEXT_PUBLIC_API_UR}/auth/new-password?token=${checkOtp.code}`;
    }

    return deeplink;
  }

  async verifyAccountForgotPasswordSms(data: VerifyForgetPasswordSmsReq){
    const user = await this.userService.findUserByPhone(data.phone, data.phone_code);
    if (user && !user.is_verify) {
      throw new NotFoundException('EMAIL_INFO_INVALID', 'EMAIL_INFO_INVALID');
    }
    if (user) return true
  }

  async sendAndCheckResetPass(data: any, lang: string = 'en') {
    if (data.method == METHOD_VERIFY_USER.EMAIL) {
      let userByEmail = await this.findUserByEmail(data.email);
      const otp = await this.deleteAndCreateToken(data.email)
      await this.mailService.sendMailResetPass(`${userByEmail.first_name} ${userByEmail.last_name}`, data.email, otp.code, lang);
    }
    
    return true
  }

  async resendVerify(query: VerifyUserReq, lang: string = 'en') {
    const userWithEmail = await this.checkEmailAndPhoneExistOneParam(query)
    const timeDate = new Date()

    if (userWithEmail.is_verify == true) {
      throw new BadRequestException('err', 'EMAIL_TAKEN');
    }

    if (timeDate.getTime() - userWithEmail.updatedAt.getTime() <= 30000) {
      throw new BadRequestException('err', 'NOT_ENOUGH_TIME_30S');
    }

    timeDate.setDate(timeDate.getDate() + 2)
    const verifyToken = crypto.randomBytes(32).toString('hex');
    await this.userEntity.update({id: userWithEmail.id},
      {
        verify_token: verifyToken,
        expire_verify: timeDate,
      }
    );

    const userActiveUrl = `${process.env.APP_DOMAIN}auth/verify?id=${userWithEmail.id}&token=${verifyToken}`;
    // Send mail
    this.mailService
      .sendMail(userWithEmail.email, userActiveUrl, `${userWithEmail.first_name} ${userWithEmail.last_name}`, lang)
      .then(() => console.log('Send mail successfully'));

    return true
  }

  async deleteAndCreateToken(email: string, methodSend = null){
    await this.otpService.deleteBy({ email, type: OTPTYPE.FORGOT_PASSWORD });

    const otp = await this.otpService.create({
      email,
      type: OTPTYPE.FORGOT_PASSWORD,
      is_resend: true,
    });
    
    return otp
  }

  async resetPassword(email: string, password: string) {
    const user = await this.userEntity.findOne({
      where: { email },
    });
    if (!user) {
      throw new BadRequestException('err', 'EMAIL_NOT_EXIST');
    }
    const newPass = hashPassword(password);
    return await this.userEntity.update(
      { id: user.id },
      { password: newPass }
    );
  }

  async resetPasswordWithPhoneNumber(phoneNumber: string, phoneCode: string, password: string, code: string) {
    const user = await this.userService.findUserByPhone(phoneNumber, phoneCode)
    if (user && !user.is_verify) {
      throw new NotFoundException('EMAIL_INFO_INVALID', 'EMAIL_INFO_INVALID');
    }
    const isValid = await this.firebaseService.verifyOtp(phoneNumber, phoneCode, code)
    if (!isValid) {
      throw new BadRequestException('BAD_REQUEST_EXCEPTION', 'BAD_REQUEST_EXCEPTION')
    }
    const newPass = hashPassword(password);
    return await this.userEntity.update(
      { id: user.id },
      { password: newPass }
    );
  }

  async checkAndRefreshToken(key: string, id: number) {
    const checkKey = await this.tokenService.findOne(key);
    if (checkKey && checkKey.user_id === id) {
      const user = await this.userEntity.findOne({
        where: { id: id },
      });
      if (!user) {
        throw new UnauthorizedException('UNAUTHORIZED', 'UNAUTHORIZED');
      }
      const payload = {
        id: id,
        email: user.email,
        user_type: AccountType.NORMAL,
      };
      const accessTime = this.configService.get('EXPIRE_TIME');
      const refreshTime = this.configService.get('REFRESH_EXPIRE_TIME');
      const accessToken = generateToken(
        payload,
          accessTime,
        this.configService.get('JWT_KEY'),
      );
      const time = new Date();
      const expiredAccess = new Date(+time.getTime() + +accessTime);
      const expiredRefresh = new Date(+time.getTime() + +refreshTime);
      return { accessToken, expiredAccess, expiredRefresh };
    } else {
      throw new UnauthorizedException('UNAUTHORIZED', 'UNAUTHORIZED');
    }
  }

  async checkEmailAndPhoneExist(phone: string, email: string, timeDate, phone_code){
    const userInfoWithPhones = await this.userEntity
        .createQueryBuilder('u')
        .where('u.phone = :phone and u.phone_code = :phoneCode and u.expire_verify >= :time', { phone: phone, phoneCode:phone_code, time: timeDate })
        .getMany();

    for (let key in userInfoWithPhones) {
      if (userInfoWithPhones[key].is_verify == true) {
        throw new BadRequestException('PHONE_TAKEN', 'PHONE_TAKEN');
      }

      if (userInfoWithPhones[key].is_verify == false && userInfoWithPhones[key].expire_verify > timeDate) {
        throw new BadRequestException('NUMBER_USED_NOT_VERIFIED', 'NUMBER_USED_NOT_VERIFIED');
      }
    }

    const userInfoWithEmails = await this.userEntity
        .createQueryBuilder('u')
        .where('u.email = :email and u.expire_verify >= :time', { email: email.toLowerCase(), time: timeDate })
        .getMany();
    for (let key in userInfoWithEmails) {
      if (userInfoWithEmails[key].is_verify == true) {
        throw new BadRequestException('EMAIL_TAKEN', 'EMAIL_TAKEN');
      }

      if (userInfoWithEmails[key].is_verify == false && userInfoWithEmails[key].expire_verify > timeDate) {
        throw new BadRequestException('EMAIL_EXISTED_NOT_VERIFIED', 'EMAIL_EXISTED_NOT_VERIFIED');
      }
    }
  }

  async checkEmailAndPhoneExistPassExpired(phone: string, email: string, phone_code: string, timeDate: any){
    const userInfoWithPhones = await this.userEntity
        .createQueryBuilder('u')
        .where('u.phone = :phone and u.phone_code = :phoneCode', { phone: phone, phoneCode:phone_code })
        .getOne();

    if (userInfoWithPhones && userInfoWithPhones?.is_verify == true && userInfoWithPhones?.expire_verify < timeDate) {
      throw new BadRequestException('PHONE_TAKEN', 'PHONE_TAKEN');
    }

    const userInfoWithEmails = await this.userEntity
        .createQueryBuilder('u')
        .where('u.email = :email', { email: email.toLowerCase() })
        .getOne();

    if (userInfoWithEmails && userInfoWithEmails?.is_verify == true && userInfoWithEmails?.expire_verify < timeDate) {
      throw new BadRequestException('EMAIL_TAKEN', 'EMAIL_TAKEN');
    }
  }

  async checkEmailAndPhoneExistOneParam(data: any){
    const timeDate = new Date();
    const user = await this.userEntity.findOne({
      where: [
        {email: data.email_or_phone.toLowerCase()}, 
        {phone : data.email_or_phone, phone_code: data.phone_code}
      ]
    });
    if (!user || (user && user.expire_verify < timeDate && user.is_verify !== true)) {
      throw new BadRequestException('EMAIL_OR_PHONE_NOT_EXIST', 'EMAIL_OR_PHONE_NOT_EXIST');
    }
    
    return user
  }

  async signUpJwt(signUpReq: SignUpReq, lang: string = 'en') {
    const timeDate = new Date();
    const { first_name, last_name, phone, email, password, phone_code } = signUpReq;
    await this.checkEmailAndPhoneExist(phone, email, timeDate, phone_code)
    await this.checkEmailAndPhoneExistPassExpired(phone, email, phone_code, timeDate)
    await this.connection.transaction(async (manager: EntityManager) => {
      const verifyToken = crypto.randomBytes(32).toString('hex');
      const userInfo = await this.userEntity.findOne({
        where: [
          { email: email.toLowerCase()}, 
          { phone: phone, phone_code: phone_code }
        ]
      });
      if (userInfo && userInfo.is_verify == false && userInfo.expire_verify < timeDate) {
        await manager.update(UserEntity,{id: userInfo.id},
          {
            email: "delete+" + email,
            phone: "delete+" + phone,
            deletedAt: timeDate
          });
      }
      //2 days
      timeDate.setDate(timeDate.getDate() + 2);
      let user = await manager.save(UserEntity,{
        first_name,
        last_name,
        phone,
        email,
        is_verify: false,
        verify_token: verifyToken,
        expire_verify: timeDate,
        password: hashPassword(password),
        phone_code: phone_code,
      });
      const userActiveUrl = `${process.env.APP_DOMAIN}auth/verify?id=${user.id}&token=${verifyToken}`;
      // Send mail
      this.mailService
      .sendMail(email, userActiveUrl, `${first_name} ${last_name}`, lang)
        .then(() => console.log('Send mail successfully'));
    });
    return {
      email: email,
    };
  }

  async validateUser(email: string, password: string, phone_code: string) {
    console.log('로그인 시도 데이터:', { email, phone_code }); // 데이터 확인
    return await this.connection.transaction(async (manager: EntityManager) => {
      const userInfo = await manager.findOne(UserEntity, {
        where: [
          { email: email.toLowerCase() }, 
          { phone: email, phone_code: phone_code }
        ],
      });
      const timeDate = new Date();

      if (!userInfo || (userInfo && userInfo.expire_verify < timeDate && userInfo.is_verify !== true)) {
        throw new BadRequestException('EMAIL_OR_PHONE_NOT_EXIST', 'EMAIL_OR_PHONE_NOT_EXIST');
      }

      console.log('계정 찾음:', userInfo.email);
  
      if (!userInfo.password) {
        console.log('결과: 비밀번호 틀림');
        throw new BadRequestException('INVALID_EMAIL', 'INVALID_EMAIL');
      }

      if (userInfo && userInfo.is_verify !== true) {
        throw new HttpException({
          code: HttpStatus.PRECONDITION_FAILED,
          message: this.i18n.t('error.VERIFY_EMAIL'),
          data: {is_verify: userInfo.is_verify}
        }, HttpStatus.PRECONDITION_FAILED);
      }
      console.log('비밀번호 비교 시작...');
      const checkPassword = comparePassword(
        password,
        userInfo.password,
      );
  
      if (!checkPassword) {
        console.log('결과: 비밀번호 틀림');
        throw new BadRequestException('WRONG_PASS_LOGIN', 'WRONG_PASS_LOGIN');
      }
      console.log('결과: 인증 성공');
      delete userInfo.password;
      return userInfo
    });
  }

  async loginJwt(body: AuthDto) {
    return await this.connection.transaction(async (manager: EntityManager) => {
      const userInfo = await manager.findOne(UserEntity, {
        where: [
          { email: body.email_or_phone.toLowerCase() }, 
          { phone: body.email_or_phone, phone_code: body.phone_code }
        ],
      });
      const timeDate = new Date();

      if (!userInfo || (userInfo && userInfo.expire_verify < timeDate && userInfo.is_verify !== true)) {
        throw new BadRequestException('EMAIL_OR_PHONE_NOT_EXIST', 'EMAIL_OR_PHONE_NOT_EXIST');
      }

      if (userInfo && userInfo.is_verify !== true) {
        throw new HttpException({
          code: HttpStatus.PRECONDITION_FAILED,
          message: this.i18n.t('error.VERIFY_EMAIL'),
        }, HttpStatus.PRECONDITION_FAILED);
      }
      
      const tokenPayload: TokenContent = {
        email_or_phone: body.email_or_phone,
        user_type: AccountType.NORMAL,
        user_id: +userInfo.id,
      };
      
      return await this.handleResAuth(tokenPayload);
    });
  }

  async refreshTokenJwt(refreshToken: string, req: any) {
    try {
      const payload: any = verifyToken(
        refreshToken,
        this.configService.get('JWT_KEY'),
      );

      if (!payload) {
        throw new ForbiddenException('ACCESS_DENIED', 'ACCESS_DENIED');
      }
      const checkRefreshKey = await this.tokenService.findOne(refreshToken);
      if (!checkRefreshKey && checkRefreshKey.user_id !== +payload.user_id) {
        throw new ForbiddenException('ACCESS_DENIED', 'ACCESS_DENIED');
      }
      const tokenPayload: TokenContent = {
        email_or_phone: payload.email_or_phone,
        user_type: AccountType.NORMAL,
        user_id: +payload.user_id,
      };

      return {
        access_token: this.jwtService.sign(tokenPayload),
      };
    } catch (error) {
      throw new ForbiddenException('ACCESS_DENIED', 'ACCESS_DENIED');
    }
  }

  async handleResAuth(payload: TokenContent) {
    const { user_id, email_or_phone } = payload;
    await this.tokenService.deleteToken(user_id);
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: this.configService.get('REFRESH_EXPIRE_TIME_JWT') });
    await this.tokenService.create(user_id, refreshToken);
    return { email_or_phone: email_or_phone, access_token: accessToken, refresh_token: refreshToken };
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { OTPTYPE } from 'src/common/base.enum';
import { OtpEntity } from 'src/entities/otp.entity';
import { Repository } from 'typeorm';
import { OtpCreateDto, OtpCriteriaDto } from '../dtos/otp.dto';

@Injectable()
export class OptService {
  constructor(
    @InjectRepository(OtpEntity) private otpEntity: Repository<OtpEntity>,
    private readonly i18n: I18nService,
  ) {}

  async create(data: OtpCreateDto) {
    const digits =
      data.type === OTPTYPE.RESET_PASSWORD
        ? 'abcdefghABCDEFGH0123456789'
        : '0123456789';
    const length = data.type === OTPTYPE.RESET_PASSWORD ? 42 : 6;
    let OTP = '';
    let check = false;
    while (check === false) {
      for (let i = 0; i < length; i++) {
        OTP += digits[Math.floor(Math.random() * digits.length)];
      }
      const code = await this.otpEntity.findOne({
        where: {
          code: OTP,
          type: data.type,
          email: data.email,
        },
      });
      if (code) {
        OTP = '';
      } else {
        check = true;
      }
    }
    if (data.type === OTPTYPE.VERIFY_USER) {
      OTP = data.token_verify
    }
    return await this.otpEntity.save(
      this.otpEntity.create({
        ...data,
        code: OTP,
      })
    );
  }

  async findOne(data: OtpCriteriaDto, err = true) {
    const otp = await this.otpEntity.findOne({
      where: data,
    });

    if (!otp && err) {
      throw new NotFoundException(this.i18n.t('error.DATA_NOT_FOUND'));
    }

    return otp;
  }

  async deleteBy(data: OtpCriteriaDto) {
    await this.otpEntity.delete(data);
  }
}

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { Connection, Not, Repository } from 'typeorm';
import {
  SearchUserAdminReq,
  UserReqUpdate,
  PhoneOrEmail,
} from '../dtos/user.dto';
import { comparePassword, hashPassword } from 'src/utils';
import { SORTBY } from 'src/common/base.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private userEntity: Repository<UserEntity>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async findById(id: number) {
    const user = await this.userEntity.findOne({
      where: { id: id },
      relations: ['payments', 'youtubeAccounts', 'changeRank'],
      select: {
        payments: {
          id: true,
          user_id: true,
          rank: true,
          payment_status: true,
          status: true,
          tax: true,
          sub_total: true,
          total: true,
          expire_date: true,
          payment_date: true,
          start_date: true,
        }
      }
    });

    if (!user) {
      throw new NotFoundException('err', 'USER_NOT_FOUND');
    }
    delete user.password;

    return user;
  }

  async searchUsers(data: SearchUserAdminReq) {
    const { page, pageSize, sortBy, search, filterUser } = data;
    const sortField = data.sortField || 'id';
    const newSortBy = sortBy.toLowerCase() == SORTBY.asc ? SORTBY.ASC : SORTBY.DESC;
    let query = '';

    if (search) {
      query += `${query ? ' AND' : ''} u.${filterUser} like '%${search}%'`;
    }

    const [users, total] = await this.userEntity
      .createQueryBuilder('u')
      .where(query)
      .take(pageSize)
      .skip((page - 1) * pageSize)
      .orderBy(`u.${sortField}`, newSortBy)
      .getManyAndCount();

    return { users, total };
  }

  async findOneByEmailOrPhone(data: PhoneOrEmail, throw_err = false) {
    const user = await this.userEntity.findOne({
      where: [{ email: data.email }, { phone: data.phone }],
    });
    if (throw_err) {
      const checkEmail = await this.userEntity.findOne({
        where: {
          email: data.email.toLowerCase(),
        },
      });

      if (checkEmail) {
        throw new BadRequestException('err', 'EMAIL_TAKEN');
      }
      const checkUsername = await this.userEntity.findOne({
        where: [
          { phone: data.phone },
          { email: data.email.toLowerCase() }
        ],
      });

      if (checkUsername) {
        throw new BadRequestException('err', 'USER_TAKEN');
      }
    }
    delete user.password;

    return user;
  }

  async updateUser(id: number, data: UserReqUpdate) {
    if (data.constructor === Object && Object.keys(data).length > 0) {
      const findPhoneNumber = await this.userEntity.findOne({
        where: {phone : data?.phone, id: Not(id), phone_code: data.phone_code}
      })
      
      if (findPhoneNumber) {
        throw new BadRequestException('PHONE_TAKEN', 'PHONE_TAKEN');
      }

      await this.userEntity.update(
        { id },
        {
          first_name: data?.first_name,
          last_name: data?.last_name,
          phone: data?.phone,
          phone_code: data?.phone_code
        },
      );
    }
    const user = await this.userEntity.findOne({
      where: { id },
    });
    delete user.password;

    return user;
  }

  async changePassword(id: number, oldPassword: string, password: string) {
    const user = await this.userEntity.findOne({
      where: { id: id }
    });

    if (!user) {
      throw new NotFoundException('err', 'USER_NOT_FOUND');
    }

    const compare = comparePassword(oldPassword, user.password);
    if (!compare) {
      throw new BadRequestException('WRONG_PASS_LOGIN', 'WRONG_PASS_LOGIN');
    }
    const newPass = hashPassword(password);
    await this.userEntity.update({ id }, { password: newPass });
    return true;
  }

  async changePasswordWithoutOldPass(id: number, password: string) {
    await this.findById(id);
    const newPass = hashPassword(password);
    return await this.userEntity.update({ id }, { password: newPass, updatedAt: new Date() });
  }

  async findByEmailOrPhoneNumber(emailOrPhone: string) {
    const user = await this.userEntity.findOne({
      where: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    });

    if (!user) {
      throw new NotFoundException('err', 'USER_NOT_FOUND');
    }
    delete user.password;

    return user;
  }

  async findUserByPhone(phoneNumber: string, phoneCode: string, err = true){
    const user = await this.userEntity.findOne({
      where: { phone : phoneNumber, phone_code: phoneCode}
    })

    if (!user && err) {
      throw new NotFoundException('PHONE_NOT_EXIST', 'PHONE_NOT_EXIST');
    }
    delete user.password;

    return user;
  }
}

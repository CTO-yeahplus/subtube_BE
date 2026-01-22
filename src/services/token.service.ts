import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenEntity } from 'src/entities/token-key.entity';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(TokenEntity) private tokenEntity: Repository<TokenEntity>,
    @InjectRepository(UserEntity) private userEntity: Repository<UserEntity>,
  ) {}

  async findOne(key: string) {
    const token = await this.tokenEntity.findOne({
      where: { key },
    });
    if (token) return token;
    return null;
  }

  async create(user_id: number, key: string) {
    return await this.tokenEntity.save(
      this.tokenEntity.create({
        user_id: user_id,
        key,
      }),
    );
  }

  async deleteToken(user_id: number) {
    await this.tokenEntity.delete({
      user_id: user_id,
    });
  }
}

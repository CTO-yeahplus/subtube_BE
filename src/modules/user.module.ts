import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { UserService } from '../services/user.service';
import { UserController } from '../controllers/user.controller';
import { AuthModule } from './auth.module';
import { TokenEntity } from 'src/entities/token-key.entity';
import { FileModule } from './file.module';
import { MailModule } from 'src/modules/mail.module';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      TokenEntity,
    ]),
    AuthModule,
    FileModule,
    MailModule
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}

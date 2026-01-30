import { Module } from '@nestjs/common';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { OtpModule } from './opt.module';
import { TokenEntity } from 'src/entities/token-key.entity';
import { TokenService } from '../services/token.service';
import { FileService } from '../services/file.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  AuthJwtStrategy,
  RefreshJwtStrategy,
} from 'src/strategy/auth-jwt.strategy';
import { LocalStrategy } from 'src/strategy/local-strategy';
import { MailModule } from 'src/modules/mail.module';
import { SessionSerializer } from './serializer/session.serializer';
import { CustomLogger } from 'src/services/logger.service';
import { SmsService } from 'src/services/sms.service';
import {OtpEntity} from "../entities/otp.entity";
import { FirebaseService } from 'src/services/firebase.service';

@Module({
  imports: [
    MailModule,
    HttpModule,
    TypeOrmModule.forFeature([UserEntity, TokenEntity, OtpEntity]),
    OtpModule,
    PassportModule.register({
      session: true,
      secret: '234234234234',
      resave: false,
      saveUninitialized: false,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_KEY'),
        signOptions: {
          expiresIn: configService.get('EXPIRE_TIME_JWT'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenService,
    FileService,
    AuthJwtStrategy,
    LocalStrategy,
    RefreshJwtStrategy,
    SessionSerializer,
    SmsService,
    CustomLogger,
    FirebaseService,
  ],
  exports: [AuthService, TokenService, FileService, JwtModule, PassportModule],
})
export class AuthModule {}

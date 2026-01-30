import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from 'src/services/auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthJwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // 🚨 수정: 환경변수가 없으면 'default_secret'을 대신 사용 (서버 다운 방지)
      secretOrKey: configService.get('JWT_KEY') || 'default_secret_key_1234',
    });
  }

  async validate(payload: any) {
    return payload;
  }
}

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      // 🚨 수정: 여기도 안전장치 추가
      secretOrKey: configService.get('JWT_KEY') || 'default_secret_key_1234',
    });
  }

  async validate(payload: any) {
    return payload;
  }
}
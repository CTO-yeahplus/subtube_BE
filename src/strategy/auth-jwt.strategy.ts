import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from 'src/services/auth.service';
import { ConfigService } from '@nestjs/config';
import { SignUpReq } from 'src/dtos/auth.dto';

@Injectable()
export class AuthJwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_KEY'),
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
      secretOrKey: configService.get('JWT_KEY'),
    });
  }

  async validate(payload: any) {
    return payload;
  }
}

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from 'src/services/auth.service';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email_or_phone',
      passwordField: 'password',
      passReqToCallback: true,
    });
  }

  async validate(payload: any) {
    return await this.authService.validateUser(payload.body.email_or_phone, payload.body.password, payload.body.phone_code);
  }
}

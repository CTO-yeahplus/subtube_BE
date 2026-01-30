import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from 'src/services/auth.service';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      // 🚨 핵심 수정: 프론트엔드에서 보내는 실제 필드명인 'email'로 변경
      usernameField: 'email_or_phone', 
      passwordField: 'password',
      passReqToCallback: true,
    });
  }

  async validate(req: any, email: string, password: string): Promise<any> {
    // 프론트엔드에서 phone_code도 같이 보낸다면 req.body에서 꺼냅니다.
    const phone_code = req.body.phone_code || '';
    
    // validateUser 호출
    const user = await this.authService.validateUser(email, password, phone_code);
    
    if (!user) {
      // 인증 실패 시
      throw new UnauthorizedException('ID 또는 비밀번호를 확인해주세요.');
    }
    
    // 인증 성공 시 유저 객체 반환
    return user;
  }
}
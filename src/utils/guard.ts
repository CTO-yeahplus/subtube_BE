import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { verifyToken } from './utils';
import { ConfigService } from '@nestjs/config';
import { I18nService } from 'nestjs-i18n';
import { UserService } from 'src/services/user.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/services/auth.service';

@Injectable()
export class AuthenUserGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private readonly i18n: I18nService,
    private userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (type !== 'Bearer') {
      throw new UnauthorizedException('UNAUTHORIZED', 'UNAUTHORIZED');
    }
    try {
      const payload: any = verifyToken(
        token,
        this.configService.get('JWT_KEY'),
      );
      if (payload?.key) {
        throw new UnauthorizedException('UNAUTHORIZED', 'UNAUTHORIZED');
      }
      await this.userService.findById(+payload.user_id);
      request['account'] = payload;
      const language = request.headers.language;
      if (!language) request['language'] = payload.language;
    } catch (error) {
      if (error.message === 'jwt expired') {
        throw new UnauthorizedException(
          'Your login session has been expired. Please login again !',
          'TOKEN_EXPIRED',
        );
      }
      throw new UnauthorizedException('UNAUTHORIZED', 'UNAUTHORIZED');
    }
    return true;
  }
}

@Injectable()
export class AuthenAdminGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private readonly i18n: I18nService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (type !== 'Bearer') {
      throw new UnauthorizedException('UNAUTHORIZED', 'UNAUTHORIZED');
    }
    try {
      const payload = verifyToken(token, this.configService.get('JWT_KEY')) as {
        id: number;
        email: string;
        type: string;
        key: string;
      };
      if (payload?.key) {
        throw new UnauthorizedException('UNAUTHORIZED', 'UNAUTHORIZED');
      }
      if (!['admin', 'superadmin'].includes(payload.type)) {
        throw new UnauthorizedException('UNAUTHORIZED', 'UNAUTHORIZED');
      }
      request['admin'] = payload;
    } catch (error) {
      if (error.message === 'jwt expired') {
        throw new UnauthorizedException(
          'Your login session has been expired. Please login again !',
          'TOKEN_EXPIRED',
        );
      }
      throw new UnauthorizedException('UNAUTHORIZED', 'UNAUTHORIZED');
    }
    return true;
  }
}

@Injectable()
export class AuthenSuperAdminGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (type !== 'Bearer') {
      throw new UnauthorizedException('UNAUTHORIZED', 'UNAUTHORIZED');
    }
    try {
      const payload = verifyToken(token, this.configService.get('JWT_KEY')) as {
        id: number;
        email: string;
        type: string;
        key: string;
      };
      if (payload?.key) {
        throw new UnauthorizedException('UNAUTHORIZED', 'UNAUTHORIZED');
      }
      if (payload.type !== 'superadmin') {
        throw new ForbiddenException('FORBIDDEN_ROLE', 'FORBIDDEN_ROLE');
      }
      request['admin'] = payload;
    } catch (error) {
      if (error.message === 'jwt expired') {
        throw new UnauthorizedException(
          'Your login session has been expired. Please login again !',
          'TOKEN_EXPIRED',
        );
      }
      throw new UnauthorizedException('UNAUTHORIZED', 'UNAUTHORIZED');
    }
    return true;
  }
}

@Injectable()
export class AuthJwtUserGuard extends AuthGuard('jwt')  {
  private readonly logger = new Logger(AuthJwtUserGuard.name);
  constructor(
    private configService: ConfigService,
    private readonly i18n: I18nService,
    private userService: UserService,
  ) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (type !== 'Bearer') {
      throw new UnauthorizedException('UNAUTHORIZED', 'UNAUTHORIZED');
    }
    try {
      const payload: any = verifyToken(
        token,
        this.configService.get('JWT_KEY'),
      );
      await this.userService.findByEmailOrPhoneNumber(payload.email_or_phone);
      request['account'] = payload;
      const language = request.headers.language;
      if (!language) request['language'] = payload.language;
    } catch (error) {
      if (error.message === 'jwt expired') {
        throw new UnauthorizedException(
          'Your login session has been expired. Please login again !',
          'TOKEN_EXPIRED',
        );
      }
      throw new UnauthorizedException('UNAUTHORIZED', 'UNAUTHORIZED');
    }

    return true;
  }
}

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  private readonly logger = new Logger(LocalAuthGuard.name);
  constructor(private authService: AuthService) {
    super();
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    this.logger.error(err, user, info);
    
    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    return user;
  }

  async canActivate(context: ExecutionContext) {
    const result = (await super.canActivate(context)) as boolean;
    const request = context.switchToHttp().getRequest();
    await super.logIn(request);

    return result;
  }
}

@Injectable()
export class RefreshJwtGuard extends AuthGuard('jwt-refresh') {
  private readonly logger = new Logger(RefreshJwtGuard.name);
  constructor(
    private configService: ConfigService,
    private readonly i18n: I18nService,
    private userService: UserService,
  ) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.body.refreshToken;
    try {
      const payload: any = verifyToken(
        token,
        this.configService.get('JWT_KEY'),
      );
      await this.userService.findByEmailOrPhoneNumber(payload.email_or_phone.toLowerCase());
      request['account'] = payload;
      const language = request.headers.language;
      if (!language) request['language'] = payload.language;
    } catch (error) {
      throw new UnauthorizedException('UNAUTHORIZED', 'UNAUTHORIZED');
    }

    return true;
  }
}

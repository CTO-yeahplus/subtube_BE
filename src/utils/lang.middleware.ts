import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class LanguageMiddleware implements NestMiddleware {
  use(req: Request, res: any, next: (error?: any) => void) {
    const lang = req.headers['language'];
    req['language'] = lang;
    next();
  }
}

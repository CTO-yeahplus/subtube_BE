import { Injectable, ValidationPipe } from '@nestjs/common';
import { errorFatory } from './error';
@Injectable()
export class ValidationBodyPipe extends ValidationPipe {
  constructor() {
    super({
      transform: true,
    });
  }
  exceptionFactory = errorFatory([]);
}

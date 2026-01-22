import { Injectable } from '@nestjs/common';
import * as winston from 'winston';
import { Logger } from '@nestjs/common';

@Injectable()
export class CustomLogger extends Logger {
  private logger;
  constructor() {
    super();
    this.logger = winston.createLogger({
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({
          level: 'error',
          filename: 'error.log',
        }),
        new winston.transports.File({
          level: 'info',
          filename: 'combined.log',
        }),
      ],
    });
  }

  log(message: any) {
    this.logger.info(message);
  }

  error(message: string, trace: string) {
    this.logger.error(message, trace);
  }

  debug(message: any) {
    this.logger.debug(message);
  }

  order(order: any, data: any) {
    this.logger.info(order, data);
  }
}

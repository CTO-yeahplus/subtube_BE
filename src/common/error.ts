import { ValidationError } from '@nestjs/common';
import { ERROR_RES } from './constant';

export class ErrorObject {
  property: string;
  message: string[];
}

export class BaseError implements Error {
  protected readonly isError: boolean = true;
  statusCode: number;
  messageCode: string;
  name: string;
  constraints: ErrorObject[];
  messageKey: string;
  messageContent = '';
  constructor(
    messageKey: string,
    name: string,
    statusCode: number,
    constraints?: ErrorObject[],
  ) {
    this.messageKey = messageKey;
    this.name = name;
    this.statusCode = statusCode;
    this.constraints = constraints;
  }
  message: string;
  stack?: string;
}

export class InputValidationError extends BaseError {
  constructor(message: string) {
    super(
      message,
      ERROR_RES['VALIDATION_ERROR'].name,
      ERROR_RES['VALIDATION_ERROR'].statusCode,
    );
  }
}

// validation
export const errorFatory = (constraints: ErrorObject[]) => {
  let arrConstraints = constraints;
  return (errors: ValidationError[]) => {
    arrConstraints = [];
    errors.forEach((item) => {
      const objErr = new ErrorObject();
      objErr.property = item.property;
      objErr.message = [];
      for (const key of Object.keys(item.constraints)) {
        objErr.message.push(item.constraints[key]);
      }
      arrConstraints.push(objErr);
    });
    return new InputValidationError(
      'message.MESSAGE.ERROR.REQUEST_BODY_VALIDATION',
    );
  };
};
export class ConflictError extends BaseError {
  constructor(messageKey: string) {
    super(
      messageKey,
      ERROR_RES['CONFLICT_ERROR'].name,
      ERROR_RES['CONFLICT_ERROR'].statusCode,
    );
  }
}

import { errorStatusCodeMap } from '../utils/helpers';

export type ErrorType = keyof typeof errorStatusCodeMap;

export class CustomError extends Error {
  errorType: ErrorType;
  messages: string[];
  constructor(errorType: ErrorType, messages: string[]) {
    super(messages[0]);
    this.name = this.constructor.name;
    this.errorType = errorType;
    this.messages = messages;
    Object.setPrototypeOf(this, CustomError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string) {
    super('NOT_FOUND_ERROR', [message]);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
export class ValidationError extends CustomError {
  constructor(message: string) {
    super('VALIDATION_ERROR', [message]);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
export class UnauthorizedError extends CustomError {
  constructor(message: string) {
    super('UNAUTHORIZED_ERROR', [message]);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}
export class ForbiddenError extends CustomError {
  constructor(message: string) {
    super('FORBIDDEN_ERROR', [message]);
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}
export class InternalError extends CustomError {
  constructor(message: string) {
    super('INTERNAL_SERVER_ERROR', [message]);
    Object.setPrototypeOf(this, InternalError.prototype);
  }
}

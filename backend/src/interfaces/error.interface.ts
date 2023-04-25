import { errorStatusCodeMap } from '../utils/helpers';

export type ErrorType = keyof typeof errorStatusCodeMap;

export class CustomError extends Error {
  errorType: ErrorType;
  messages: string[];
  constructor(errorType: ErrorType, errorMessage: string[]) {
    super();
    this.name = 'CustomError';
    this.messages = errorMessage;
    this.errorType = errorType;
  }
}

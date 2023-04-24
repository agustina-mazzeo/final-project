export const errorStatusCodeMap = {
  VALIDATION_ERROR: 400,
  UNAUTHORIZED_ERROR: 401,
  FORBIDDEN_ERROR: 403,
  NOT_FOUND_ERROR: 404,
  CONFLICT_ERROR: 409,
  INTERNAL_SERVER_ERROR: 500,
  // Add more error types and corresponding status codes as needed
};

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

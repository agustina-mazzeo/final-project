import * as dotenv from 'dotenv';
dotenv.config();

const SYMBOLS = process.env.SYMBOLS as string;

export const currencies: string[] = SYMBOLS.split(',');

export const errorStatusCodeMap = {
  VALIDATION_ERROR: 400,
  UNAUTHORIZED_ERROR: 401,
  FORBIDDEN_ERROR: 403,
  NOT_FOUND_ERROR: 404,
  CONFLICT_ERROR: 409,
  INTERNAL_SERVER_ERROR: 500,
  // Add more error types and corresponding status codes as needed
};

export const addOnePercent = (num: number): number => {
  const onePercent = (num * 1) / 100; // Calculate 1% of the input number
  return num + onePercent; // Add 1% to the input number
};

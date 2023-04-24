import { sign } from 'jsonwebtoken';
import { User, TokenData, DataStoredInToken } from '../interfaces';
import * as dotenv from 'dotenv';
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY as string;
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

export function createToken(user: User): TokenData {
  const expiresIn = `${1000 * 60 * 60}`; //1 hour
  const payload: DataStoredInToken = { id: user.id, email: user.email };
  const token = sign(payload, SECRET_KEY, { expiresIn });
  return { expiresIn, token };
}

export const addOnePercent = (num: number): number => {
  const onePercent = (num * 1) / 100; // Calculate 1% of the input number
  return num + onePercent; // Add 1% to the input number
};

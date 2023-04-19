import { sign } from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY as string;

export interface User extends UserData {
  id: number;
}

export interface UserData {
  name?: string;
  email: string;
  password: string;
}

export interface Account {
  id: number;
  id_user: number;
  currency: string;
  balance: number;
}
export interface Currency {
  name: string;
}
export const currencies: Currency[] = [{ name: 'USD' }, { name: 'UYU' }, { name: 'EU' }];

export interface TokenData {
  token: string;
  expiresIn: string;
}

export interface DataStoredInToken {
  email: string;
  id: number;
}

export function createToken(user: User): TokenData {
  const expiresIn = `${1000 * 60 * 60}`; //1 hour
  const payload: DataStoredInToken = { id: user.id, email: user.email };
  const token = sign(payload, SECRET_KEY, { expiresIn });
  return { expiresIn, token };
}

import { sign } from 'jsonwebtoken';
import { User, TokenData, DataStoredInToken } from '../../interfaces';
import * as dotenv from 'dotenv';
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY as string;

export function createToken(user: User): TokenData {
  const expiresIn = `${1000 * 60 * 60}`; //1 hour
  const payload: DataStoredInToken = { id: user.id, email: user.email };
  const token = sign(payload, SECRET_KEY, { expiresIn });
  return { expiresIn, token };
}

import { sign } from 'jsonwebtoken';
import { TokenData, DataStoredInToken } from '../../interfaces';
import * as dotenv from 'dotenv';
import { UserOutputDTO } from '../../services/dtos';
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY as string;

export function createToken(user: UserOutputDTO): TokenData {
  const expiresIn = `${1000 * 60 * 60}`; //1 hour
  const payload: DataStoredInToken = { id: user.id, email: user.email };
  const token = sign(payload, SECRET_KEY, { expiresIn });
  return { expiresIn, token };
}

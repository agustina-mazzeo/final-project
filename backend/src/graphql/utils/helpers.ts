import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();
import { DataStoredInToken } from '../../interfaces';

const SECRET_KEY = process.env.SECRET_KEY as string;

export function decodeAuthHeader(authHeader: String): DataStoredInToken | undefined {
  const token = authHeader.replace('Bearer ', '');
  return jwt.verify(token, SECRET_KEY) as DataStoredInToken;
}

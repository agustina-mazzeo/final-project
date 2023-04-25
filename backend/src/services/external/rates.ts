import { axiosClient } from './rates.index';
import * as dotenv from 'dotenv';
dotenv.config();
const SYMBOLS = process.env.SYMBOLS as string;
const BASE = process.env.BASE as string;
export async function getRates() {
  try {
    const response = await axiosClient.get('/latest', { params: { symbols: SYMBOLS, base: BASE } });
    return response.data;
  } catch (error) {
    return error;
  }
}

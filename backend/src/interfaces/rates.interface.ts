import * as dotenv from 'dotenv';
dotenv.config();
const SYMBOLS = process.env.SYMBOLS as string;

export interface ExchangeRate {
  name: string;
  rates: { USD_TO: number; USD_FROM: number };
}
export interface Rates {
  [currency: string]: number;
}

export const currencies: string[] = SYMBOLS.split(',');

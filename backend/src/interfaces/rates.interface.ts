export interface ExchangeRate {
  name: string;
  rates: { USD_TO: number; USD_FROM: number };
}
export interface Rates {
  [currency: string]: number;
}

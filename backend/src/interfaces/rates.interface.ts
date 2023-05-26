export interface ExchangeRate {
  name: string;
  rates: {
    usdFrom: number;
    usdTo: number;
  };
}

export interface Rates {
  [currency: string]: number;
}

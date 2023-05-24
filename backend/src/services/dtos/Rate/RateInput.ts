import { ExchangeRate } from '../../../interfaces';

export type RateCreateInputDTO = {
  name: string;
  referenceRate: {
    [currency: string]: number;
  };
};

export type RateUpdateInputDTO = ExchangeRate;

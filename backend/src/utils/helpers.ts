import CacheLocal from '../cache/cache';

import * as dotenv from 'dotenv';
import { getRates } from '../services/external/rates';
import { InternalError, Rates } from '../interfaces';
import { IRateWriteService } from '../services/interfaces';
dotenv.config();

const SYMBOLS = process.env.SYMBOLS as string;
const TTL = process.env.TTL as unknown as number;
export const currencies: string[] = SYMBOLS.split(',');

const cacheInstance = CacheLocal.getInstance();

export const selectAccountOptions = { user_id: true, balance: true, currency: true, id: true };
export const selectRateOptions = { created_at: true, name: true, USD_FROM: true, USD_TO: true };

export enum operators {
  equal = 'equals',
  not = 'not',
  gte = 'gte',
  lte = 'lte',
  in = 'in',
}

export const addFilters = (filters: { filterBy: any; value: any; operator: operators }[]) => {
  return filters.reduce((acumulator: { [key: string]: any }, current) => {
    const operator = current.operator;
    const key = current.filterBy;
    const value = current.value;
    acumulator[key] = { ...acumulator[key], [operator]: value };
    return acumulator;
  }, {});
};

export const errorStatusCodeMap = {
  VALIDATION_ERROR: 400,
  UNAUTHORIZED_ERROR: 401,
  FORBIDDEN_ERROR: 403,
  NOT_FOUND_ERROR: 404,
  CONFLICT_ERROR: 409,
  INTERNAL_SERVER_ERROR: 500,
  // Add more error types and corresponding status codes as needed
};

export const addOnePercent = (num: number): number => {
  const onePercent = (num * 1) / 100; // Calculate 1% of the input number
  return num + onePercent; // Add 1% to the input number
};

export const updateRates = async (rateWriteService: IRateWriteService) => {
  const result: { [key: string]: any } = {};
  console.log('fetching rates');
  const data = await getRates();
  if (data.error) {
    throw new InternalError('Error updating Rates');
  } else {
    const referenceRate: Rates = data.rates;
    for (const name of currencies) {
      //creates a table entry and updates the cache for each currency.
      const lastRate = await rateWriteService.create({ name, referenceRate });
      cacheInstance.set(name, lastRate, TTL);
      result[name] = lastRate;
    }
    return result;
  }
};

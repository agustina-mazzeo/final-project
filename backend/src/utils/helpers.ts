import * as dotenv from 'dotenv';
dotenv.config();

const SYMBOLS = process.env.SYMBOLS as string;

export const currencies: string[] = SYMBOLS.split(',');
export const selectAccountOptions = { userId: true, balance: true, currency: true, id: true };
export const selectRateOptions = { createdAt: true, name: true, usdFrom: true, usdTo: true };

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

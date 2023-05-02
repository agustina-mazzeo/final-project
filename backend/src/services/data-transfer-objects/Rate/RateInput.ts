export type RateCreateInputDTO = {
  name: string;
  referenceRate: {
    [currency: string]: number;
  };
};

export type RateUpdateInputDTO = {
  name: string;
  rates: { USD_TO: number; USD_FROM: number };
};

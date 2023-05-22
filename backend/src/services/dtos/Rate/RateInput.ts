export type RateCreateInputDTO = {
  name: string;
  referenceRate: {
    [currency: string]: number;
  };
};

export type RateUpdateInputDTO = {
  name: string;
  rates: { usdTo: number; usdFrom: number };
};

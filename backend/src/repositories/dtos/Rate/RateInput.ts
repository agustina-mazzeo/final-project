export type RateInputDTO = {
  name: string;
  rates: { USD_FROM: number; USD_TO: number };
};
export type RateGetterDTO = RateInputDTO['name'];

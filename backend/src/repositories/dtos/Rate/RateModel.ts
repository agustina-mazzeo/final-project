export type RateModelDTO = {
  name: string;
  rates: {
    USD_FROM: number;
    USD_TO: number;
  };
  created_at: string;
};

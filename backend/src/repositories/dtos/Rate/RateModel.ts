export type RateModelDTO = {
  name: string;
  rates: {
    usdFrom: number;
    usdTo: number;
  };
  createdAt: string;
};

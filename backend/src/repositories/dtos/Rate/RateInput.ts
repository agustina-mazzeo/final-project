import { RateModelDTO } from './RateModel';

export type RateInputDTO = {
  name: string;
  rates: { usdFrom: number; usdTo: number };
};
export type RateGetterDTO = { name: RateModelDTO['name']; createdAt: RateModelDTO['createdAt'] };

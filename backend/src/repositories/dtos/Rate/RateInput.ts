import { RateModelDTO } from './RateModel';

export type RateInputDTO = {
  name: string;
  rates: { USD_FROM: number; USD_TO: number };
};
export type RateGetterDTO = { name: RateModelDTO['name']; created_at: RateModelDTO['created_at'] };

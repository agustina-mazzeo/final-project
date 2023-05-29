import { ExchangeRate } from '../../../interfaces';
import { RateModelDTO } from './RateModel';

export type RateInputDTO = ExchangeRate;
export type RateGetterDTO = { name: RateModelDTO['name']; createdAt: RateModelDTO['createdAt'] };

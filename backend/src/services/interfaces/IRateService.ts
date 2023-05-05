import { ExchangeRate } from '../../interfaces/rates.interface';
import { IService } from './IService';

export interface IRateService extends IService<ExchangeRate> {
  getMultiplier(currency_from: string, currency_to: string): Promise<number>;
}

import { rates } from '../../database';
import { ExchangeRate } from '../interfaces';
import { IRepository } from './interfaces';

export class RateRepository implements IRepository<ExchangeRate> {
  public async getAll(): Promise<ExchangeRate[]> {
    return rates;
  }

  public getByID = async (name: string): Promise<ExchangeRate | undefined> => {
    return rates.find(rate => rate.name === name);
  };

  public create = async (rate: ExchangeRate): Promise<ExchangeRate> => {
    rates.push(rate);
    return rate;
  };

  public update = async (rateToUpdate: ExchangeRate): Promise<ExchangeRate> => {
    const index = rates.findIndex(({ name }) => rateToUpdate.name === name);
    rates[index] = rateToUpdate;
    return rateToUpdate;
  };
}

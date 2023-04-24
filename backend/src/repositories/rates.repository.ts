import { ExchangeRate } from 'interfaces';
import { IRepository } from './interfaces/IRepository';

export class RatesRepository implements IRepository<ExchangeRate> {
  private rates: ExchangeRate[];
  constructor() {
    this.rates = [];
  }
  public async getAll(): Promise<ExchangeRate[]> {
    return this.rates;
  }

  public getByID = async (name: string): Promise<ExchangeRate | undefined> => {
    return this.rates.find(rate => rate.name === name);
  };

  public create = async (rate: ExchangeRate): Promise<ExchangeRate> => {
    this.rates.push(rate);
    return rate;
  };

  public update = async (rateToUpdate: ExchangeRate): Promise<ExchangeRate> => {
    const index = this.rates.findIndex(({ name }) => rateToUpdate.name === name);
    this.rates[index] = rateToUpdate;
    return rateToUpdate;
  };
}

export const ratesRepository = new RatesRepository();

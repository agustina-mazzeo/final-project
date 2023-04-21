import { IService } from './interfaces/IService';
import { IRepository } from '../repositories/interfaces/IRepository';
import { ExchangeRate, Rates } from 'interfaces/rates.interface';
import { ratesRepository } from '../repositories/rates.repository';
import * as dotenv from 'dotenv';
dotenv.config();
const BASE = process.env.BASE as string;

class RatesService implements IService<ExchangeRate> {
  constructor(private ratesRepository: IRepository<ExchangeRate>) {}

  public async getAll(): Promise<ExchangeRate[]> {
    return this.ratesRepository.getAll();
  }
  public async create(referenceRates: Rates, newRateName: string): Promise<ExchangeRate> {
    const newRate: ExchangeRate = this.createExchangeRate(referenceRates, newRateName);
    const savedRate = await this.ratesRepository.getByID?.(newRateName);
    if (savedRate) this.update(newRate);
    else this.ratesRepository.create(newRate);
    return newRate;
  }
  public async update(newRate: ExchangeRate): Promise<ExchangeRate> {
    return (await this.ratesRepository.update?.(newRate)) as ExchangeRate;
  }

  private createExchangeRate(referenceRate: Rates, name: string): ExchangeRate {
    if (name === BASE) return { name, rates: { USD_TO: 1, USD_FROM: 1 } };
    else {
      const newExchangeRate: ExchangeRate = { name, rates: { USD_TO: referenceRate[name], USD_FROM: 1 / referenceRate[name] } };
      return newExchangeRate;
    }
  }
}

export const ratesService = new RatesService(ratesRepository);

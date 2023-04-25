import { IRepository } from '../repositories/interfaces/IRepository';
import { ratesRepository } from '../repositories/rates.repository';
import { IRatesService } from './interfaces/IRatesService';
import * as dotenv from 'dotenv';
import { CustomError, ExchangeRate, Rates } from '../interfaces';
dotenv.config();
const BASE = process.env.BASE as string;

class RatesService implements IRatesService {
  constructor(private ratesRepository: IRepository<ExchangeRate>) {}

  public async getAll(): Promise<ExchangeRate[]> {
    return this.ratesRepository.getAll();
  }
  public create = async (referenceRates: Rates, newRateName: string): Promise<ExchangeRate> => {
    const newRate: ExchangeRate = this.createExchangeRate(referenceRates, newRateName);
    const savedRate = await this.ratesRepository.getByID?.(newRateName);
    if (savedRate) this.update(newRate);
    else this.ratesRepository.create(newRate);
    return newRate;
  };
  public update = async (newRate: ExchangeRate): Promise<ExchangeRate> => {
    return (await this.ratesRepository.update?.(newRate)) as ExchangeRate;
  };

  public getMultiplier = async (currency_from: string, currency_to: string): Promise<number> => {
    const rate_from = await this.ratesRepository.getByID?.(currency_from);
    const rate_to = await this.ratesRepository.getByID?.(currency_to);
    if (rate_from && rate_to) return rate_from.rates.USD_FROM * rate_to.rates.USD_TO;
    else throw new CustomError('VALIDATION_ERROR', ['Could not make transfer']);
  };

  private createExchangeRate = (referenceRate: Rates, name: string): ExchangeRate => {
    if (name === BASE) return { name, rates: { USD_TO: 1, USD_FROM: 1 } };
    else {
      const newExchangeRate: ExchangeRate = { name, rates: { USD_TO: referenceRate[name], USD_FROM: 1 / referenceRate[name] } };
      return newExchangeRate;
    }
  };

  public getByID = (): Promise<ExchangeRate> => {
    throw new CustomError('FORBIDDEN_ERROR', ['Forbidden']);
  };
}

export const ratesService = new RatesService(ratesRepository);

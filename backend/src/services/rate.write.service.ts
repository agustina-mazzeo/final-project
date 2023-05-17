import { ForbiddenError, InternalError, Rates, ValidationError } from '../interfaces';
import { IRateWriteRepository } from '../repositories/interfaces';
import { IRateWriteService } from './interfaces';
import { RateCreateInputDTO, RateOutputDTO } from './dtos';
import { getRates } from './external/rates';
import CacheLocal from '../cache/cache';
import { currencies } from '../utils/helpers';
const cacheInstance = CacheLocal.getInstance();

import * as dotenv from 'dotenv';
dotenv.config();
const BASE = process.env.BASE as string;
const TTL = process.env.TTL as unknown as number;

export class RateWriteService implements IRateWriteService {
  constructor(private rateWriteRepository: IRateWriteRepository) {}

  public create = async ({ name, referenceRate }: RateCreateInputDTO): Promise<RateOutputDTO> => {
    try {
      const newRate = this.createRate(referenceRate, name);
      const result = await this.rateWriteRepository.create({ name, rates: newRate });
      return result;
    } catch (error: any) {
      throw error;
    }
  };

  private createRate = (referenceRate: Rates, name: string) => {
    if (name === BASE) return { USD_TO: 1, USD_FROM: 1 };
    else {
      return { USD_TO: referenceRate[name], USD_FROM: 1 / referenceRate[name] };
    }
  };

  public getMultiplier = async (currency_from: string, currency_to: string): Promise<number> => {
    try {
      let rate_from: RateOutputDTO | undefined;
      let rate_to: RateOutputDTO | undefined;
      if (cacheInstance.has(currency_from) && cacheInstance.has(currency_to)) {
        rate_from = cacheInstance.get(currency_from);
        rate_to = cacheInstance.get(currency_to);
      } else {
        const lastRates = await this.updateRates();
        rate_from = lastRates[currency_from];
        rate_to = lastRates[currency_to];
      }
      if (rate_from && rate_to) return rate_from.rates.USD_FROM * rate_to.rates.USD_TO;
      else throw new ValidationError('Could not make transfer');
    } catch (error: any) {
      throw error;
    }
  };

  public updateRates = async () => {
    const result: { [key: string]: any } = {};
    const data = await getRates();
    if (data.error) {
      throw new InternalError('Error updating Rates');
    } else {
      const referenceRate: Rates = data.rates;
      for (const name of currencies) {
        //creates a table entry and updates the cache for each currency.
        const lastRate = await this.create({ name, referenceRate });
        cacheInstance.set(name, lastRate, TTL);
        result[name] = lastRate;
      }
      return result;
    }
  };

  public update = async (): Promise<RateOutputDTO> => {
    throw new ForbiddenError('Forbidden');
  };
}

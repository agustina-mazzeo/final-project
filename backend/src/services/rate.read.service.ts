import { IRateReadRepository } from '../repositories/interfaces';
import { ForbiddenError, ValidationError } from '../interfaces';
import { IRateReadService, IRateWriteService } from './interfaces';
import { RateOutputDTO } from './dtos';
import CacheLocal from '../cache/cache';
import { updateRates } from '../utils/helpers';
const cacheInstance = CacheLocal.getInstance();

export class RateReadService implements IRateReadService {
  constructor(private rateReadRepository: IRateReadRepository, private rateWriteService: IRateWriteService) {}

  public getAll = async (): Promise<RateOutputDTO[]> => {
    try {
      return this.rateReadRepository.getAll();
    } catch (error: any) {
      throw error;
    }
  };

  public getMultiplier = async (currency_from: string, currency_to: string): Promise<number> => {
    try {
      //const rate_from = await this.rateReadRepository.getByID(currency_from);
      //const rate_to = await this.rateReadRepository.getByID(currency_to);
      let rate_from: RateOutputDTO | undefined;
      let rate_to: RateOutputDTO | undefined;
      if (cacheInstance.has(currency_from) && cacheInstance.has(currency_to)) {
        rate_from = cacheInstance.get(currency_from);
        rate_to = cacheInstance.get(currency_to);
      } else {
        const lastRates = await updateRates(this.rateWriteService);
        rate_from = lastRates[currency_from];
        rate_to = lastRates[currency_to];
      }
      if (rate_from && rate_to) return rate_from.rates.USD_FROM * rate_to.rates.USD_TO;
      else throw new ValidationError('Could not make transfer');
    } catch (error: any) {
      throw error;
    }
  };

  public getByID = (): Promise<RateOutputDTO> => {
    throw new ForbiddenError('Forbidden');
  };
}

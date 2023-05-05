import { IRateReadRepository } from '../repositories/interfaces';
import { CustomError } from '../interfaces';
import { IRateReadService } from './interfaces';
import { RateOutputDTO } from './dtos';

export class RateReadService implements IRateReadService {
  constructor(private rateReadRepository: IRateReadRepository) {}

  public getAll = async (): Promise<RateOutputDTO[]> => {
    return this.rateReadRepository.getAll();
  };

  public getMultiplier = async (currency_from: string, currency_to: string): Promise<number> => {
    const rate_from = await this.rateReadRepository.getByID(currency_from);
    const rate_to = await this.rateReadRepository.getByID(currency_to);
    if (rate_from && rate_to) return rate_from.rates.USD_FROM * rate_to.rates.USD_TO;
    else throw new CustomError('VALIDATION_ERROR', ['Could not make transfer']);
  };

  public getByID = (): Promise<RateOutputDTO> => {
    throw new CustomError('FORBIDDEN_ERROR', ['Forbidden']);
  };
}

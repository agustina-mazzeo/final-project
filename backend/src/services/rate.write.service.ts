import { CustomError, Rates } from '../interfaces';
import { IRateReadRepository, IRateWriteRepository } from '../repositories/interfaces';
import { IRateWriteService } from './interfaces';
import { RateCreateInputDTO, RateOutputDTO, RateUpdateInputDTO } from './dtos';

import * as dotenv from 'dotenv';
dotenv.config();
const BASE = process.env.BASE as string;

export class RateWriteService implements IRateWriteService {
  constructor(private rateReadRepository: IRateReadRepository, private rateWriteRepository: IRateWriteRepository) {}

  public create = async ({ name, referenceRate }: RateCreateInputDTO): Promise<RateOutputDTO> => {
    try {
      const savedRate = await this.rateReadRepository.getByID(name);
      const newRate = this.createRate(referenceRate, name);
      let result: RateOutputDTO;
      if (savedRate) result = await this.update({ name, rates: newRate });
      else result = await this.rateWriteRepository.create({ name, rates: newRate });
      return result;
    } catch (error: any) {
      throw new CustomError(error.errorType, error.messages);
    }
  };

  private createRate = (referenceRate: Rates, name: string) => {
    if (name === BASE) return { USD_TO: 1, USD_FROM: 1 };
    else {
      return { USD_TO: referenceRate[name], USD_FROM: 1 / referenceRate[name] };
    }
  };

  public update = async (newRate: RateUpdateInputDTO): Promise<RateOutputDTO> => {
    try {
      return await this.rateWriteRepository.update(newRate);
    } catch (error: any) {
      throw new CustomError(error.errorType, error.messages);
    }
  };
}

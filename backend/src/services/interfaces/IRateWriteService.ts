import { RateOutputDTO, RateCreateInputDTO, RateUpdateInputDTO } from '../dtos';
import { IWriteService } from '.';

export interface IRateWriteService extends IWriteService<RateOutputDTO, RateCreateInputDTO, RateUpdateInputDTO, unknown> {
  getMultiplier(currency_from: string, currency_to: string): Promise<number>;
  updateRates(): Promise<{
    [key: string]: any;
  }>;
}

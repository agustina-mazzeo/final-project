import { RateOutputDTO } from '../data-transfer-objects';
import { IReadService } from '.';

export interface IRateReadService extends IReadService<RateOutputDTO, unknown, unknown> {
  getMultiplier(currency_from: string, currency_to: string): Promise<number>;
}

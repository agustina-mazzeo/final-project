import { RateGetterDTO, RateModelDTO } from '../dtos';
import { IReadRepository } from '.';

export interface IRateReadRepository extends IReadRepository<RateModelDTO, unknown, unknown> {
  getLastRates(id: RateGetterDTO): Promise<RateModelDTO[]>;
}

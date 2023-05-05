import { rates } from '../../database';
import { RateGetterDTO, RateModelDTO } from './dtos';
import { IRateReadRepository } from './interfaces';

export class RateReadRepository implements IRateReadRepository {
  public async getAll(): Promise<RateModelDTO[]> {
    return rates;
  }

  public getByID = async (name: RateGetterDTO): Promise<RateModelDTO | undefined> => {
    return rates.find(rate => rate.name === name);
  };
}

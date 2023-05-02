import { rates } from '../../database';
import { RateModelDTO, RateInputDTO } from './data-transfer-objects';
import { IRateWriteRepository } from './interfaces';

export class RateWriteRepository implements IRateWriteRepository {
  public create = async (rate: RateInputDTO): Promise<RateModelDTO> => {
    rates.push(rate);
    return rate;
  };

  public update = async (rateToUpdate: RateInputDTO): Promise<RateModelDTO> => {
    const index = rates.findIndex(({ name }) => rateToUpdate.name === name);
    rates[index] = rateToUpdate;
    return rateToUpdate;
  };
}

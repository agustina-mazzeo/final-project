import { IRateReadRepository } from '../repositories/interfaces';
import { ForbiddenError } from '../interfaces';
import { IRateReadService } from './interfaces';
import { RateOutputDTO } from './dtos';

export class RateReadService implements IRateReadService {
  constructor(private rateReadRepository: IRateReadRepository) {}

  public getAll = async (): Promise<RateOutputDTO[]> => {
    try {
      return this.rateReadRepository.getAll();
    } catch (error: any) {
      throw error;
    }
  };

  public getByID = (): Promise<RateOutputDTO> => {
    throw new ForbiddenError('Forbidden');
  };
}

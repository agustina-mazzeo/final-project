import { ForbiddenError, InternalError } from '../interfaces';
import prisma from '../config/prisma';
import { RateModelDTO, RateInputDTO } from './dtos';
import { IRateWriteRepository } from './interfaces';
import { selectRateOptions } from '../utils/helpers';

export class RateWriteRepository implements IRateWriteRepository {
  public create = async (rate: RateInputDTO): Promise<RateModelDTO> => {
    const { name, rates } = rate;
    const { usdFrom, usdTo } = rates;
    try {
      const { createdAt } = await prisma.rate.create({
        select: selectRateOptions,
        data: {
          name,
          usdFrom,
          usdTo,
        },
      });
      return { ...rate, createdAt: createdAt.toISOString() };
    } catch (error: any) {
      throw new InternalError('Error trying to save rate');
    }
  };

  public update = async (): Promise<RateModelDTO> => {
    throw new ForbiddenError('Forbidden');
  };
}

import { ForbiddenError, InternalError } from '../interfaces';
import prisma from '../config/prisma';
import { RateModelDTO, RateInputDTO } from './dtos';
import { IRateWriteRepository } from './interfaces';
import { selectRateOptions } from '../utils/helpers';

export class RateWriteRepository implements IRateWriteRepository {
  public create = async (rate: RateInputDTO): Promise<RateModelDTO> => {
    const { name, rates } = rate;
    const { USD_FROM, USD_TO } = rates;
    try {
      const { created_at } = await prisma.rate.create({
        select: selectRateOptions,
        data: {
          name,
          USD_FROM,
          USD_TO,
        },
      });
      return { ...rate, created_at: created_at.toISOString() };
    } catch (error: any) {
      //if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') throw new ValidationError('Rate already exists');
      throw new InternalError('Error trying to save rate');
    }
    //rates.push(rate);
  };

  public update = async (): Promise<RateModelDTO> => {
    throw new ForbiddenError('Forbidden');
  };
}

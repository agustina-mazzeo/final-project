//import { rates } from '../../database';
import { InternalError, ForbiddenError } from '../interfaces';
import prisma from '../config/prisma';
import { RateGetterDTO, RateModelDTO } from './dtos';
import { IRateReadRepository } from './interfaces';
import { selectRateOptions } from '../utils/helpers';

export class RateReadRepository implements IRateReadRepository {
  public async getAll(): Promise<RateModelDTO[]> {
    try {
      const rates = await prisma.rate.findMany({ select: selectRateOptions });
      return rates.map(({ name, usdFrom, usdTo, createdAt }) => {
        return { name, rates: { usdFrom, usdTo }, createdAt: createdAt.toISOString() };
      });
    } catch (error: any) {
      console.log(error);
      throw new InternalError('Error at rate get all');
    }
  }

  public getByID = async (): Promise<RateModelDTO | null> => {
    throw new ForbiddenError('Forbidden');
  };

  public getLastRates = async ({ name: nameToGet, createdAt }: RateGetterDTO): Promise<RateModelDTO[]> => {
    try {
      const rates = await prisma.rate.findMany({ select: selectRateOptions, where: { createdAt: { gte: createdAt }, name: nameToGet } });
      return rates.map(({ name, usdFrom, usdTo, createdAt }) => {
        return { name, rates: { usdFrom, usdTo }, createdAt: createdAt.toISOString() };
      });
    } catch (error: any) {
      console.log(error);
      throw new InternalError('Error at rate get by id');
    }
  };
}

//import { rates } from '../../database';
import { InternalError } from '../interfaces';
import prisma from '../config/prisma';
import { RateGetterDTO, RateModelDTO } from './dtos';
import { IRateReadRepository } from './interfaces';

export class RateReadRepository implements IRateReadRepository {
  public async getAll(): Promise<RateModelDTO[]> {
    try {
      const rates = await prisma.rate.findMany();
      return rates.map(({ name, USD_FROM, USD_TO }) => {
        return { name, rates: { USD_FROM, USD_TO } };
      });
    } catch (error: any) {
      console.log(error);
      throw new InternalError('Error at rate get all');
    }
  }

  public getByID = async (nameToGet: RateGetterDTO): Promise<RateModelDTO | null> => {
    try {
      const { name, USD_FROM, USD_TO } = await prisma.rate.findUniqueOrThrow({ where: { name: nameToGet } });
      return { name: name, rates: { USD_FROM, USD_TO } };
    } catch (error: any) {
      console.log(error);
      throw new InternalError('Error at rate get by id');
    }
  };
}

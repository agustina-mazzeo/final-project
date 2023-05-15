//import { rates } from '../../database';
import { Prisma } from '@prisma/client';
import { CustomError } from '../interfaces';
import prisma from '../config/prisma';
import { RateModelDTO, RateInputDTO } from './dtos';
import { IRateWriteRepository } from './interfaces';

export class RateWriteRepository implements IRateWriteRepository {
  public create = async (rate: RateInputDTO): Promise<RateModelDTO> => {
    const { name, rates } = rate;
    const { USD_FROM, USD_TO } = rates;
    try {
      await prisma.rate.create({
        data: {
          name,
          USD_FROM,
          USD_TO,
        },
      });
      return rate;
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002')
        throw new CustomError('VALIDATION_ERROR', ['Rate already exists']);
      throw new CustomError('INTERNAL_SERVER_ERROR', ['There was an internal error']);
    }
    //rates.push(rate);
  };

  public update = async (rateToUpdate: RateInputDTO): Promise<RateModelDTO> => {
    const { name, rates } = rateToUpdate;
    const { USD_FROM, USD_TO } = rates;
    try {
      await prisma.rate.update({
        where: {
          name,
        },
        data: {
          USD_FROM,
          USD_TO,
        },
      });
      return rateToUpdate;
    } catch (error: any) {
      console.log(error);
      throw new CustomError('INTERNAL_SERVER_ERROR', ['Error at rate update']);
    }
    //const index = rates.findIndex(({ name }) => rateToUpdate.name === name);
    //rates[index] = rateToUpdate;
  };
}

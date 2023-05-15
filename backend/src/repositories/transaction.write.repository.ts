import { PrismaContext } from '../services/dtos';
import prisma from '../config/prisma';
import { CustomError } from '../interfaces';
import { TransactionInputDTO, TransactionModelDTO } from './dtos';
import { ITransactionWriteRepository } from './interfaces';

export class TransactionWriteRepository implements ITransactionWriteRepository {
  public create = async (transfer: TransactionInputDTO, prismaTransaction: PrismaContext): Promise<TransactionModelDTO> => {
    const prismaInstance = prismaTransaction ?? prisma;
    try {
      const createdTransaction = await prismaInstance.transaction.create({
        data: {
          ...transfer,
        },
      });
      return { ...createdTransaction, created_at: createdTransaction.created_at.toISOString() } as TransactionModelDTO;
    } catch (error: any) {
      console.log(error);
      throw new CustomError('INTERNAL_SERVER_ERROR', ['Error at transaction create']);
    }
  };

  public update = (): Promise<TransactionModelDTO> => {
    throw new CustomError('FORBIDDEN_ERROR', ['Forbidden']);
  };
}

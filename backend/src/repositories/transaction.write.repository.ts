import { PrismaContext } from '../services/dtos';
import prisma from '../config/prisma';
import { ForbiddenError, InternalError } from '../interfaces';
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
      return { ...createdTransaction, createdAt: createdTransaction.createdAt.toISOString() } as TransactionModelDTO;
    } catch (error: any) {
      console.log(error);
      throw new InternalError('Error trying to make transfer');
    }
  };

  public update = (): Promise<TransactionModelDTO> => {
    throw new ForbiddenError('Forbidden');
  };
}

import { Prisma } from '@prisma/client';
import prisma from '../config/prisma';
import { ForbiddenError, InternalError } from '../interfaces';
import { TransactionModelDTO, TransactionGetAllInputDTO } from './dtos';
import { ITransactionReadRepository } from './interfaces';
import { addFilters } from '../utils/helpers';

export class TransactionReadRepository implements ITransactionReadRepository {
  public getAll = async ({ filters, usersAccountsId }: TransactionGetAllInputDTO): Promise<TransactionModelDTO[]> => {
    const where: Prisma.TransactionWhereInput = {
      AND: {
        OR: {
          accountFromId: { in: usersAccountsId },
          accountToId: { in: usersAccountsId },
        },
        ...addFilters(filters),
      },
    };
    try {
      const transactions = await prisma.transaction.findMany({ where });
      return transactions.map(transaction => {
        const createdAt = transaction.createdAt.toISOString();
        return { ...transaction, createdAt };
      }) as TransactionModelDTO[];
    } catch (error: any) {
      throw new InternalError('Error trying to get users transactions');
    }
  };

  public getUsersTransactions = async (usersAccounts: number[]): Promise<TransactionModelDTO[]> => {
    const where: Prisma.TransactionWhereInput = {
      OR: {
        accountFromId: { in: usersAccounts },
        accountToId: { in: usersAccounts },
      },
    };
    try {
      const transactions = await prisma.transaction.findMany({ where });
      return transactions.map(transaction => {
        const createdAt = transaction.createdAt.toISOString();
        return { ...transaction, createdAt };
      }) as TransactionModelDTO[];
    } catch (error: any) {
      throw new InternalError('Error trying to get users transactions');
    }
  };

  public getByID = (): Promise<TransactionModelDTO | null> => {
    throw new ForbiddenError('Forbidden');
  };
}

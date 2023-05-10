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
          account_from_id: { in: usersAccountsId },
          account_to_id: { in: usersAccountsId },
        },
        ...addFilters(filters),
      },
    };
    try {
      const transactions = await prisma.transaction.findMany({ where });
      return transactions.map(transaction => {
        const created_at = transaction.created_at.toISOString();
        return { ...transaction, created_at };
      }) as TransactionModelDTO[];
    } catch (error: any) {
      throw new InternalError('Error at txn get all');
    }
  };

  public getUsersTransactions = async (usersAccounts: number[]): Promise<TransactionModelDTO[]> => {
    const where: Prisma.TransactionWhereInput = {
      OR: {
        account_from_id: { in: usersAccounts },
        account_to_id: { in: usersAccounts },
      },
    };
    try {
      const transactions = await prisma.transaction.findMany({ where });
      return transactions.map(transaction => {
        const created_at = transaction.created_at.toISOString();
        return { ...transaction, created_at };
      }) as TransactionModelDTO[];
    } catch (error: any) {
      throw new InternalError('Error at txn get users txn');
    }
  };

  public getByID = (): Promise<TransactionModelDTO | null> => {
    throw new ForbiddenError('Forbidden');
  };
}

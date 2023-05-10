import { Prisma } from '@prisma/client';
import prisma from '../config/prisma';
import { CustomError } from '../interfaces';
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
      return JSON.parse(JSON.stringify(await prisma.transaction.findMany({ where }))) as TransactionModelDTO[];
    } catch (error: any) {
      throw new CustomError('INTERNAL_SERVER_ERROR', ['Error at txn get all']);
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
      return JSON.parse(JSON.stringify(await prisma.transaction.findMany({ where }))) as TransactionModelDTO[];
    } catch (error: any) {
      throw new CustomError('INTERNAL_SERVER_ERROR', ['Error at txn get users txn']);
    }
  };

  public getByID = (): Promise<TransactionModelDTO | null> => {
    throw new CustomError('FORBIDDEN_ERROR', ['Forbidden']);
  };
}

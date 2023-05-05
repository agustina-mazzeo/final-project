//import { transactions } from '../../database';
import { Prisma } from '@prisma/client';
import prisma from '../config/prisma';
import { CustomError } from '../interfaces';
import { TransactionModelDTO, TransactionGetAllDTO } from './dtos';
import { ITransactionReadRepository } from './interfaces';

export class TransactionReadRepository implements ITransactionReadRepository {
  public getAll = async ({ filters, usersAccountsId }: TransactionGetAllDTO): Promise<TransactionModelDTO[]> => {
    const where: Prisma.TransactionWhereInput = {
      AND: {
        OR: {
          account_from: { in: usersAccountsId },
          account_to: { in: usersAccountsId },
        },
        account_from: filters.find(({ filterBy }) => filterBy === 'account_from')?.value,
        createdAt: {
          gte: filters.find(({ filterBy }) => filterBy === 'createdAt')?.value,
          lte: filters.find(({ filterBy }) => filterBy === 'createdAt')?.value,
        },
      },
    };
    try {
      return JSON.parse(JSON.stringify(await prisma.transaction.findMany({ where }))) as TransactionModelDTO[];
    } catch (error: any) {
      throw new CustomError('INTERNAL_SERVER_ERROR', ['Error at txn get all']);
    }
    // const transactionsModel: TransactionModelDTO[] = transactions;
    // const usersTransactions = transactionsModel.filter(({ account_from, account_to }) => {
    //   return usersAccountsId.some(id => id === account_from || id === account_to);
    // });
    // return usersTransactions.filter(txn =>
    //   filters.every(({ filterBy, value, operator }) => {
    //     return operator(txn[filterBy], value);
    //   }),
    // );
  };

  public getUsersTransactions = async (usersAccounts: number[]): Promise<TransactionModelDTO[]> => {
    const where: Prisma.TransactionWhereInput = {
      OR: {
        account_from: { in: usersAccounts },
        account_to: { in: usersAccounts },
      },
    };
    try {
      return JSON.parse(JSON.stringify(await prisma.transaction.findMany({ where }))) as TransactionModelDTO[];
    } catch (error: any) {
      throw new CustomError('INTERNAL_SERVER_ERROR', ['Error at txn get users txn']);
    }
    // return transactions.filter(({ account_from, account_to }) => {
    //   return usersAccounts.some(id => id === account_from || id === account_to);
    // });
  };

  public getByID = (): Promise<TransactionModelDTO | null> => {
    throw new CustomError('FORBIDDEN_ERROR', ['Forbidden']);
  };
}

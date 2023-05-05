import { transactions } from '../../database';
import { CustomError, Transaction, Transfer } from '../interfaces';
import { ITransactionRepository } from './interfaces';

export class TransactionRepository implements ITransactionRepository {
  public getAll = async (filter?: { filterBy: keyof Transaction; value: any }[]): Promise<Transaction[]> => {
    if (!filter) return transactions;
    return transactions.filter(txn =>
      filter.every(({ filterBy, value }) => {
        return txn[filterBy] === value;
      }),
    );
  };

  public getUsersTransactions = async (usersAccounts: number[]): Promise<Transaction[]> => {
    return transactions.filter(({ account_from, account_to }) => {
      return usersAccounts.some(id => id === account_from || id === account_to);
    });
  };

  public create = async (transfer: Transfer): Promise<Transaction> => {
    const newTransfer: Transaction = {
      id: Math.random(),
      createdAt: new Date().toISOString(),
      ...transfer,
    };
    transactions.push(newTransfer);
    return newTransfer;
  };

  public getByID = (): Promise<Transaction | undefined> => {
    throw new CustomError('FORBIDDEN_ERROR', ['Forbidden']);
  };

  public update = (): Promise<Transaction> => {
    throw new CustomError('FORBIDDEN_ERROR', ['Forbidden']);
  };
}

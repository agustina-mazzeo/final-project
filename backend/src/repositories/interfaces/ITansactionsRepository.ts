import { IRepository } from './IRepository';
import { Transaction } from 'interfaces/transaction.interface';

export interface ITransactionsRepository extends IRepository<Transaction> {
  getUsersTransactions(usersAccounts: number[]): Promise<Transaction[]>;
}

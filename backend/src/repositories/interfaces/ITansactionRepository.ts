import { IRepository } from './IRepository';
import { Transaction } from 'interfaces/transaction.interface';

export interface ITransactionRepository extends IRepository<Transaction> {
  getUsersTransactions(usersAccounts: number[]): Promise<Transaction[]>;
}

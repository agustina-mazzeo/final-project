import { Transaction, Transfer } from '../interfaces';
import { ITransactionsRepository } from './interfaces/ITansactionsRepository';
class TransactionsRepository implements ITransactionsRepository {
  private transactions: Transaction[];
  constructor() {
    this.transactions = [
      //dummy data
      { id: 1, account_from: 12345, account_to: 67890, amount: 100, createdAt: '2023-04-13T09:30:00.000Z', description: 'Transaction 1' },
      { id: 2, account_from: 67890, account_to: 12345, amount: 200, createdAt: '2023-04-12T14:45:00.000Z', description: 'Transaction 2' },
      { id: 3, account_from: 45678, account_to: 98765, amount: 50, createdAt: '2023-04-11T18:15:00.000Z', description: 'Transaction 3' },
      { id: 4, account_from: 98765, account_to: 45678, amount: 300, createdAt: '2023-04-10T12:30:00.000Z', description: 'Transaction 4' },
      { id: 5, account_from: 11111, account_to: 22222, amount: 75, createdAt: '2023-04-09T21:00:00.000Z', description: 'Transaction 5' },
      { id: 6, account_from: 22222, account_to: 11111, amount: 150, createdAt: '2023-04-08T16:30:00.000Z', description: 'Transaction 6' },
      { id: 7, account_from: 33333, account_to: 44444, amount: 200, createdAt: '2023-04-07T08:45:00.000Z', description: 'Transaction 7' },
      { id: 8, account_from: 44444, account_to: 33333, amount: 100, createdAt: '2023-04-06T10:15:00.000Z', description: 'Transaction 8' },
      { id: 9, account_from: 55555, account_to: 66666, amount: 250, createdAt: '2023-04-05T15:00:00.000Z', description: 'Transaction 9' },
      { id: 10, account_from: 66666, account_to: 55555, amount: 50, createdAt: '2023-04-04T19:30:00.000Z', description: 'Transaction 10' },
    ];
  }
  public getAll = async (filter?: { filterBy: keyof Transaction; value: any }[]): Promise<Transaction[]> => {
    if (!filter) return this.transactions;
    return this.transactions.filter(txn =>
      filter.every(({ filterBy, value }) => {
        return txn[filterBy] === value;
      }),
    );
  };

  public getUsersTransactions = async (usersAccounts: number[]): Promise<Transaction[]> => {
    return this.transactions.filter(({ account_from, account_to }) => {
      return usersAccounts.some(id => id === account_from || id === account_to);
    });
  };
  public create = async (transfer: Transfer): Promise<Transaction> => {
    const newTransfer: Transaction = {
      id: Math.random(),
      createdAt: new Date().toISOString(),
      ...transfer,
    };
    this.transactions.push(newTransfer);
    return newTransfer;
  };
}

export const transactionsRepository = new TransactionsRepository();

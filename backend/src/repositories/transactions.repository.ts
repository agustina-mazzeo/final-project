import { TransferBody } from '../api/transactions/transactions.schema';
import { Transaction } from '../interfaces/transaction.interface';
import { IRepository } from './IRepositories';

export class TxnsRepository implements IRepository<Transaction> {
  private transactions: Transaction[]; //my transaction in memory
  constructor() {
    this.transactions = [
      { id: 100, account_from: 12345, account_to: 67890, amount: 100, createdAt: '2023-04-13T09:30:00.000Z', description: 'Transaction 1' },
      { id: 101, account_from: 67890, account_to: 12345, amount: 200, createdAt: '2023-04-12T14:45:00.000Z', description: 'Transaction 2' },
      { id: 102, account_from: 45678, account_to: 98765, amount: 50, createdAt: '2023-04-11T18:15:00.000Z', description: 'Transaction 3' },
      { id: 103, account_from: 98765, account_to: 45678, amount: 300, createdAt: '2023-04-10T12:30:00.000Z', description: 'Transaction 4' },
      { id: 104, account_from: 11111, account_to: 22222, amount: 75, createdAt: '2023-04-09T21:00:00.000Z', description: 'Transaction 5' },
      { id: 105, account_from: 22222, account_to: 11111, amount: 150, createdAt: '2023-04-08T16:30:00.000Z', description: 'Transaction 6' },
      { id: 106, account_from: 33333, account_to: 44444, amount: 200, createdAt: '2023-04-07T08:45:00.000Z', description: 'Transaction 7' },
      { id: 107, account_from: 44444, account_to: 33333, amount: 100, createdAt: '2023-04-06T10:15:00.000Z', description: 'Transaction 8' },
      { id: 108, account_from: 55555, account_to: 66666, amount: 250, createdAt: '2023-04-05T15:00:00.000Z', description: 'Transaction 9' },
      { id: 109, account_from: 66666, account_to: 55555, amount: 50, createdAt: '2023-04-04T19:30:00.000Z', description: 'Transaction 10' },
    ];
  }
  public async getAll(): Promise<Transaction[]> {
    return this.transactions;
  }
  public async create(tranfer: TransferBody): Promise<Transaction> {
    const newTransfer: Transaction = {
      id: Math.random(),
      createdAt: new Date().toISOString(),
      account_from: tranfer.account_from,
      account_to: tranfer.account_to,
      amount: tranfer.amount,
      description: tranfer.description,
    };
    this.transactions.push(newTransfer);
    return newTransfer;
  }
}

import { IService } from './IService';
import { Transaction, Transfer } from '../interfaces/transaction.interface';
import { IRepository } from '../repositories/interfaces/IRepository';
import { QueryParams } from 'api/transactions/transactions.dto';
import { accountsRepository } from '../repositories/accounts.repository';

export class TransactionsService implements IService<Transaction> {
  constructor(private transactionsRepository: IRepository<Transaction>) {}

  public async getAll(id: number, params: QueryParams): Promise<Transaction[]> {
    if (!id) {
      throw new Error("Couldn't get user's transactions");
    }
    let transactions = await this.transactionsRepository.getAll();
    const userAccounts = await accountsRepository.getUserAccounts(id);
    if (userAccounts.length === 0) {
      throw new Error("Couldn't get user's accounts");
    }
    //filter transactions by users accounts
    transactions = transactions.filter(({ account_from, account_to }) => {
      return userAccounts.some(({ id }) => id === account_from || id === account_to);
    });
    if (Object.keys(params).length !== 0) {
      transactions = transactions.filter(({ account_from, createdAt }) => {
        return (
          (!params.account_from || account_from === params.account_from) &&
          (!params.from || createdAt >= params.from) &&
          (!params.to || createdAt <= params.to)
        );
      });
    }
    return transactions;
  }
  public async create(id: number, transfer: Transfer): Promise<Transaction> {
    const userAccounts = await accountsRepository.getUserAccounts(id);
    const account_from = userAccounts.find(({ id }) => transfer.account_from === id);
    const account_to = accountsRepository.getByID(transfer.account_to);
    if (!account_from || !account_to || account_from.balance - transfer.amount < 0) {
      throw new Error('Cannot make transfer');
    }
    //make transfer ie update account from and account to (take into account the currencies and fees)

    const newTransfer = await this.transactionsRepository.create(transfer);
    return newTransfer;
  }
}

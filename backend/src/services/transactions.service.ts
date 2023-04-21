import { IService } from './interfaces/IService';
import { Transaction, Transfer } from '../interfaces/transaction.interface';
import { QueryParams } from '../api/transactions/transactions.dto';
import { accountsRepository } from '../repositories/accounts.repository';
import { accountsService } from './accounts.service';
import { transactionsRepository } from '../repositories/transactions.repository';
import { ITransactionsRepository } from '../repositories/interfaces/ITansactionsRepository';

class TransactionsService implements IService<Transaction> {
  constructor(private transactionsRepository: ITransactionsRepository) {}

  public async getAll(params: QueryParams, id: number): Promise<Transaction[]> {
    if (!id) {
      throw new Error("Couldn't get user's transactions");
    }
    const userAccounts = await accountsService.getUserAccounts(id);
    if (userAccounts.length === 0) {
      throw new Error("Couldn't get user's transactions");
    }
    const usersAccountsID = userAccounts.map(({ id }) => {
      return id;
    });
    let usersTransactions = await this.transactionsRepository.getUsersTransactions(usersAccountsID);
    usersTransactions = usersTransactions.filter(({ account_from, createdAt }) => {
      return (
        (!params.account_from || account_from === params.account_from) &&
        (!params.from || createdAt >= params.from) &&
        (!params.to || createdAt <= params.to)
      );
    });
    return usersTransactions;
  }
  public async create(transfer: Transfer, id: number): Promise<Transaction> {
    const userAccounts = await accountsService.getUserAccounts(id);
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

export const transactionsService = new TransactionsService(transactionsRepository);

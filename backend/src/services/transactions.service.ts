import { IService } from './interfaces/IService';
import { CustomError, Transaction, Transfer } from '../interfaces';
import { QueryParams } from '../api/transactions/transactions.dto';
import { accountsRepository } from '../repositories/accounts.repository';
import { accountsService } from './accounts.service';
import { transactionsRepository } from '../repositories/transactions.repository';
import { ITransactionsRepository } from '../repositories/interfaces/ITansactionsRepository';
import { ratesService } from './rates.service';
import { addOnePercent } from '../utils/helpers';

class TransactionsService implements IService<Transaction> {
  constructor(private transactionsRepository: ITransactionsRepository) {}

  public async getAll(params: QueryParams, id: number): Promise<Transaction[]> {
    if (!id) {
      throw new CustomError('VALIDATION_ERROR', ["Couldn't get user's transactions"]);
    }
    const userAccounts = await accountsService.getAll(id);
    if (userAccounts.length === 0) {
      throw new CustomError('NOT_FOUND_ERROR', ["Couldn't get user's transactions"]);
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
    const userAccounts = await accountsService.getAll(id);
    const account_from = userAccounts.find(({ id }) => transfer.account_from === id);
    const account_to = await accountsRepository.getByID(transfer.account_to);
    if (!account_from || !account_to) {
      throw new CustomError('VALIDATION_ERROR', ['Could not make transfer']);
    }

    let amount_from = transfer.amount;
    //add comission
    if (account_to.id_user !== id) {
      amount_from = addOnePercent(transfer.amount);
    }
    //check balance
    if (account_from.balance - amount_from < 0) {
      throw new CustomError('VALIDATION_ERROR', ['Insufficient funds']);
    }
    //substract funds
    account_from.balance = account_from.balance - amount_from;
    //convert the amount
    const currency_to = await accountsService.getAccountCurrency(account_to.id);
    const currency_from = await accountsService.getAccountCurrency(account_from.id);
    const multiplier = await ratesService.getMultiplier(currency_from, currency_to);
    const amount_to = transfer.amount * multiplier;
    //deposit funds
    account_to.balance = account_to.balance + amount_to;
    //update accounts
    accountsRepository.update(account_from);
    accountsRepository.update(account_to);

    const newTransfer = await this.transactionsRepository.create(transfer);
    return newTransfer;
  }

  public getByID = (): Promise<Transaction> => {
    throw new CustomError('FORBIDDEN_ERROR', ['Forbidden']);
  };
  public update = (): Promise<Transaction> => {
    throw new CustomError('FORBIDDEN_ERROR', ['Forbidden']);
  };
}

export const transactionsService = new TransactionsService(transactionsRepository);

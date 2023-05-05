import { IService } from './interfaces/IService';
import { CustomError, Transaction, Transfer } from '../interfaces';
import { ITransactionRepository } from '../repositories/interfaces';
import { IAccountService } from './interfaces';
import { QueryParams } from '../api/transactions/transactions.dto';

export class TransactionService implements IService<Transaction> {
  constructor(private transactionsRepository: ITransactionRepository, private accountsService: IAccountService) {}

  public create = async (transfer: Transfer, id: number): Promise<Transaction> => {
    try {
      const userAccounts = await this.accountsService.getAll(id);
      const account_from = userAccounts.find(({ id }) => transfer.account_from === id);
      if (!account_from) {
        throw new CustomError('VALIDATION_ERROR', ['Could not make transfer']);
      }
      const account_to = await this.accountsService.getByID(transfer.account_to); //throws
      const amount = transfer.amount;
      await this.accountsService.updateAccounts(account_from, account_to, amount, id); //throws

      const newTransaction = await this.transactionsRepository.create(transfer);
      return newTransaction;
    } catch (error: any) {
      throw new CustomError(error.errorType, error.messages);
    }
  };

  public getAll = async (params: QueryParams, id: number): Promise<Transaction[]> => {
    try {
      if (!id) {
        throw new CustomError('VALIDATION_ERROR', ["Couldn't get user's transactions"]);
      }
      const userAccounts = await this.accountsService.getAll(id);
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
    } catch (error: any) {
      throw new CustomError(error.errorType, error.messages);
    }
  };

  public getByID = (): Promise<Transaction> => {
    throw new CustomError('FORBIDDEN_ERROR', ['Forbidden']);
  };
  public update = (): Promise<Transaction> => {
    throw new CustomError('FORBIDDEN_ERROR', ['Forbidden']);
  };
}

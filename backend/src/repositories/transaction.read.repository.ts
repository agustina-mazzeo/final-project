import { transactions } from '../../database';
import { CustomError } from '../interfaces';
import { TransactionModelDTO, TransactionGetAllDTO } from './dtos';
import { ITransactionReadRepository } from './interfaces';

export class TransactionReadRepository implements ITransactionReadRepository {
  public getAll = async ({ filters, usersAccountsId }: TransactionGetAllDTO): Promise<TransactionModelDTO[]> => {
    const transactionsModel: TransactionModelDTO[] = transactions;
    const usersTransactions = transactionsModel.filter(({ account_from, account_to }) => {
      return usersAccountsId.some(id => id === account_from || id === account_to);
    });
    return usersTransactions.filter(txn =>
      filters.every(({ filterBy, value, operator }) => {
        return operator(txn[filterBy], value);
      }),
    );
  };

  public getUsersTransactions = async (usersAccounts: number[]): Promise<TransactionModelDTO[]> => {
    return transactions.filter(({ account_from, account_to }) => {
      return usersAccounts.some(id => id === account_from || id === account_to);
    });
  };

  public getByID = (): Promise<TransactionModelDTO | undefined> => {
    throw new CustomError('FORBIDDEN_ERROR', ['Forbidden']);
  };
}

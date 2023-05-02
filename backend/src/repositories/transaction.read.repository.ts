import { transactions } from '../../database';
import { CustomError } from '../interfaces';
import { TransactionModelDTO, TransactionGetAllDTO } from './data-transfer-objects';
import { ITransactionReadRepository } from './interfaces';

export class TransactionReadRepository implements ITransactionReadRepository {
  public getAll = async (filter?: TransactionGetAllDTO): Promise<TransactionModelDTO[]> => {
    const transactionsModel: TransactionModelDTO[] = transactions;
    if (!filter) return transactionsModel;
    return transactionsModel.filter(txn =>
      filter.every(({ filterBy, value }) => {
        return txn[filterBy] === value;
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

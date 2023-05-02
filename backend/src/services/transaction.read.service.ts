import { CustomError } from '../interfaces';
import { ITransactionReadRepository } from '../repositories/interfaces';
import { TransactionOutputDTO, TransactionGetAllDTO } from './data-transfer-objects';
import { IAccountReadService, ITransactionReadService } from './interfaces';

export class TransactionReadService implements ITransactionReadService {
  constructor(private transactionReadRepository: ITransactionReadRepository, private accountReadService: IAccountReadService) {}

  public getAll = async ({ userId, queryParams }: TransactionGetAllDTO): Promise<TransactionOutputDTO[]> => {
    try {
      const userAccounts = await this.accountReadService.getAll(userId);
      if (userAccounts.length === 0) {
        throw new CustomError('NOT_FOUND_ERROR', ["Couldn't get user's transactions"]);
      }
      const usersAccountsID = userAccounts.map(({ id }) => {
        return id;
      });
      let usersTransactions = await this.transactionReadRepository.getUsersTransactions(usersAccountsID);
      usersTransactions = usersTransactions.filter(({ account_from, createdAt }) => {
        return (
          (!queryParams.account_from || account_from === queryParams.account_from) &&
          (!queryParams.from || createdAt >= queryParams.from) &&
          (!queryParams.to || createdAt <= queryParams.to)
        );
      });
      return usersTransactions;
    } catch (error: any) {
      throw new CustomError(error.errorType, error.messages);
    }
  };

  public getByID = (): Promise<TransactionOutputDTO> => {
    throw new CustomError('FORBIDDEN_ERROR', ['Forbidden']);
  };
}

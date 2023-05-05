import { CustomError } from '../interfaces';
import { ITransactionReadRepository } from '../repositories/interfaces';
import { TransactionOutputDTO, TransactionGetAllDTO } from './dtos';
import { IAccountReadService, ITransactionReadService } from './interfaces';

export class TransactionReadService implements ITransactionReadService {
  constructor(private transactionReadRepository: ITransactionReadRepository, private accountReadService: IAccountReadService) {}

  public getAll = async ({ userId, queryParams }: TransactionGetAllDTO): Promise<TransactionOutputDTO[]> => {
    try {
      if (!userId) throw new CustomError('VALIDATION_ERROR', ['Invalid Credentials']);
      const userAccounts = await this.accountReadService.getAll(userId);
      if (userAccounts.length === 0) {
        throw new CustomError('NOT_FOUND_ERROR', ["Couldn't get user's transactions"]);
      }
      const usersAccountsId = userAccounts.map(({ id }) => {
        return id;
      });

      const filters = [];
      if (queryParams.account_from_id) filters.push({ value: queryParams.account_from_id, filterBy: 'account_from_id', operator: '===' });
      if (queryParams.from) filters.push({ value: queryParams.from, filterBy: 'created_at', operator: '>=' });
      if (queryParams.to) filters.push({ value: queryParams.to, filterBy: 'created_at', operator: '<=' });

      const filteredTransactions = await this.transactionReadRepository.getAll({ filters, usersAccountsId });
      return filteredTransactions;
    } catch (error: any) {
      throw new CustomError(error.errorType, error.messages);
    }
  };

  public getByID = (): Promise<TransactionOutputDTO> => {
    throw new CustomError('FORBIDDEN_ERROR', ['Forbidden']);
  };
}

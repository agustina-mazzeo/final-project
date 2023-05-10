import { operators } from '../utils/helpers';
import { CustomError, NotFoundError } from '../interfaces';
import { ITransactionReadRepository } from '../repositories/interfaces';
import { TransactionOutputDTO, TransactionGetAllDTO } from './dtos';
import { IAccountReadService, ITransactionReadService } from './interfaces';

export class TransactionReadService implements ITransactionReadService {
  constructor(private transactionReadRepository: ITransactionReadRepository, private accountReadService: IAccountReadService) {}

  public getAll = async ({ userId, queryParams }: TransactionGetAllDTO): Promise<TransactionOutputDTO[]> => {
    try {
      if (!userId) throw new CustomError('UNAUTHORIZED_ERROR', ['Invalid Credentials']);
      const userAccounts = await this.accountReadService.getAll(userId);
      if (userAccounts.length === 0) {
        throw new NotFoundError("Couldn't get user's transactions");
      }
      const usersAccountsId = userAccounts.map(({ id }) => {
        return id;
      });

      const filters: {
        filterBy: keyof TransactionOutputDTO;
        value: any;
        operator: operators;
      }[] = [];
      if (queryParams.account_from_id) filters.push({ value: queryParams.account_from_id, filterBy: 'account_from_id', operator: operators.equal });
      if (queryParams.from) filters.push({ value: queryParams.from, filterBy: 'created_at', operator: operators.gte });
      if (queryParams.to) filters.push({ value: queryParams.to, filterBy: 'created_at', operator: operators.lte });

      const filteredTransactions = await this.transactionReadRepository.getAll({ filters, usersAccountsId });
      return filteredTransactions;
    } catch (error: any) {
      throw error;
    }
  };

  public getByID = (): Promise<TransactionOutputDTO> => {
    throw new CustomError('FORBIDDEN_ERROR', ['Forbidden']);
  };
}

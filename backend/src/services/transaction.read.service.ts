import { operators } from '../utils/helpers';
import { ForbiddenError, NotFoundError, UnauthorizedError } from '../interfaces';
import { ITransactionReadRepository } from '../repositories/interfaces';
import { TransactionOutputDTO, TransactionGetAllDTO } from './dtos';
import { IAccountReadService, ITransactionReadService } from './interfaces';

export class TransactionReadService implements ITransactionReadService {
  constructor(private transactionReadRepository: ITransactionReadRepository, private accountReadService: IAccountReadService) {}

  public getAll = async ({ user, queryParams }: TransactionGetAllDTO): Promise<TransactionOutputDTO[]> => {
    try {
      if (!user) throw new UnauthorizedError('Invalid Credentials');
      let usersAccountsId = undefined;
      if (user.role !== 'ADMIN') {
        const userAccounts = await this.accountReadService.getAll(user.id);
        if (userAccounts.length === 0) {
          throw new NotFoundError("Couldn't get user's transactions");
        }
        usersAccountsId = userAccounts.map(({ id }) => {
          return id;
        });
      }

      const filters: {
        filterBy: keyof TransactionOutputDTO;
        value: any;
        operator: operators;
      }[] = [];
      if (queryParams.accountFromId) filters.push({ value: queryParams.accountFromId, filterBy: 'accountFromId', operator: operators.equal });
      if (queryParams.from) filters.push({ value: queryParams.from, filterBy: 'createdAt', operator: operators.gte });
      if (queryParams.to) filters.push({ value: queryParams.to, filterBy: 'createdAt', operator: operators.lte });

      const filteredTransactions = await this.transactionReadRepository.getAll({ filters, usersAccountsId });
      return filteredTransactions;
    } catch (error: any) {
      throw error;
    }
  };

  public getByID = (): Promise<TransactionOutputDTO> => {
    throw new ForbiddenError('Forbidden');
  };
}

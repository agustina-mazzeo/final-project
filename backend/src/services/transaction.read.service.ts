import { operators } from '../utils/helpers';
import { ForbiddenError, NotFoundError, UnauthorizedError } from '../interfaces';
import { ITransactionReadRepository } from '../repositories/interfaces';
import { TransactionOutputDTO, TransactionGetAllDTO } from './dtos';
import { IAccountReadService, ITransactionReadService } from './interfaces';

export class TransactionReadService implements ITransactionReadService {
  constructor(private transactionReadRepository: ITransactionReadRepository, private accountReadService: IAccountReadService) {}

  public getAll = async ({
    user,
    queryParams: { accountFromId, from, to, pageNumber, pageSize, orderBy, sortBy },
  }: TransactionGetAllDTO): Promise<TransactionOutputDTO[]> => {
    try {
      if (!user) throw new UnauthorizedError('Invalid Credentials');
      let usersAccountsId: number[] | undefined = undefined;
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
      if (accountFromId) filters.push({ value: accountFromId, filterBy: 'accountFromId', operator: operators.equal });
      if (from) filters.push({ value: from, filterBy: 'createdAt', operator: operators.gte });
      if (to) filters.push({ value: to, filterBy: 'createdAt', operator: operators.lte });
      const sorting = { pageNumber, pageSize, orderBy, sortBy };

      const filteredTransactions = await this.transactionReadRepository.getAll({
        filters,
        usersAccountsId,
        sorting,
      });
      return filteredTransactions;
    } catch (error: any) {
      throw error;
    }
  };

  public getByID = (): Promise<TransactionOutputDTO> => {
    throw new ForbiddenError('Forbidden');
  };
}

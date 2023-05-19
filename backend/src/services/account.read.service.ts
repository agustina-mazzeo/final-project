import { IAccountReadRepository } from '../repositories/interfaces';
import { UnauthorizedError, ValidationError } from '../interfaces';
import { IAccountReadService } from './interfaces';
import { AccountOutputDTO, AccountGetterDTO, AccountGetAllInputDTO } from './dtos';
import { operators } from '../utils/helpers';

export class AccountReadService implements IAccountReadService {
  constructor(private accountReadRepository: IAccountReadRepository) {}

  public getAll = async (userId: AccountGetAllInputDTO): Promise<AccountOutputDTO[]> => {
    if (!userId) throw new UnauthorizedError('Invalid Credentials');
    return this.accountReadRepository.getAll([{ filterBy: 'user_id', value: userId, operator: operators.equal }]);
  };

  public getByID = async (id: AccountGetterDTO): Promise<AccountOutputDTO> => {
    const account = await this.accountReadRepository.getByID(id);
    if (account) return account;
    else throw new ValidationError('Invalid account');
  };

  public getAccountCurrency = async (account_id: number): Promise<string> => {
    try {
      return (await this.getByID(account_id)).currency;
    } catch (error: any) {
      throw error;
    }
  };
}

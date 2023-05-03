import { IAccountReadRepository } from '../repositories/interfaces';
import { CustomError } from '../interfaces';
import { IAccountReadService } from './interfaces';
import { AccountOutputDTO, AccountGetterDTO } from './dtos';

export class AccountReadService implements IAccountReadService {
  constructor(private accountReadRepository: IAccountReadRepository) {}

  public getAll = async (userId: AccountGetterDTO): Promise<AccountOutputDTO[]> => {
    return this.accountReadRepository.getAll([{ filterBy: 'id_user', value: userId, operator: (arg1: number, arg2: number) => arg1 === arg2 }]);
  };

  public getByID = async (id: AccountGetterDTO): Promise<AccountOutputDTO> => {
    const account = await this.accountReadRepository.getByID(id);
    if (account) return account;
    else throw new CustomError('VALIDATION_ERROR', ['Invalid account']);
  };

  public getAccountCurrency = async (account_id: number): Promise<string> => {
    return (await this.getByID(account_id)).currency;
  };
}

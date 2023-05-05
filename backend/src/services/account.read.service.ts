import { IAccountReadRepository } from '../repositories/interfaces';
import { CustomError } from '../interfaces';
import { IAccountReadService } from './interfaces';
import { AccountOutputDTO, AccountGetterDTO } from './dtos';

export class AccountReadService implements IAccountReadService {
  constructor(private accountReadRepository: IAccountReadRepository) {}

  public getAll = async (userId: AccountGetterDTO): Promise<AccountOutputDTO[]> => {
    try {
      return this.accountReadRepository.getAll([{ filterBy: 'user_id', value: userId, operator: (arg1: number, arg2: number) => arg1 === arg2 }]);
    } catch (error: any) {
      throw new CustomError(error.errorType, error.messages);
    }
  };

  public getByID = async (id: AccountGetterDTO): Promise<AccountOutputDTO> => {
    const account = await this.accountReadRepository.getByID(id);
    if (account) return account;
    else throw new CustomError('VALIDATION_ERROR', ['Invalid account']);
  };

  public getAccountCurrency = async (account_id: number): Promise<string> => {
    try {
      return (await this.getByID(account_id)).currency;
    } catch (error: any) {
      throw new CustomError(error.errorType, error.messages);
    }
  };
}

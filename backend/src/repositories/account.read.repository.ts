import { accounts } from '../../database';
import { AccountModelDTO, AccountGetAllDTO, AccountGetterDTO } from './dtos';
import { IAccountReadRepository } from './interfaces';

export class AccountReadRepository implements IAccountReadRepository {
  public async getAll(filter?: AccountGetAllDTO): Promise<AccountModelDTO[]> {
    if (!filter) {
      return accounts;
    }
    return accounts.filter(acc => filter.every(({ filterBy, value, operator }) => operator(acc[filterBy], value)));
  }

  public getByID = async (id: AccountGetterDTO): Promise<AccountModelDTO | undefined> => {
    return accounts.find(acc => acc.id === id);
  };
}

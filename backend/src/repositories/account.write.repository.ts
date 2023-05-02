import { accounts, inc_acc } from '../../database';
import { Account } from '../interfaces';
import { AccountModelDTO, AccountCreateInputDTO, AccountUpdateInputDTO } from './data-transfer-objects';
import { IAccountWriteRepository } from './interfaces';

export class AccountWriteRepository implements IAccountWriteRepository {
  public create = async ({ id_user, currency }: AccountCreateInputDTO): Promise<AccountModelDTO> => {
    const newAccount: Account = {
      id: inc_acc(),
      id_user,
      currency,
      balance: Math.floor(Math.random() * 100),
    };
    accounts.push(newAccount);
    return newAccount;
  };

  public update = async ({ balance, id: accountToUpdateID }: AccountUpdateInputDTO): Promise<AccountModelDTO> => {
    const index = accounts.findIndex(({ id }) => accountToUpdateID === id);
    let accountToUpdate: AccountModelDTO = accounts[index];
    accountToUpdate = { ...accountToUpdate, balance };
    accounts[index] = accountToUpdate;
    return accountToUpdate;
  };
}

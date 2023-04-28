import { accounts, inc_acc } from '../../database';
import { Account } from '../interfaces';
import { IRepository } from './interfaces';

export class AccountRepository implements IRepository<Account> {
  public async getAll(filter?: { filterBy: keyof Account; value: any }[]): Promise<Account[]> {
    if (!filter) {
      return accounts;
    }
    return accounts.filter(acc => filter.every(({ filterBy, value }) => acc[filterBy] === value));
  }

  public getByID = async (id: number): Promise<Account | undefined> => {
    return accounts.find(acc => acc.id === id);
  };

  public create = async ({ userId, currency }: { userId: number; currency: string }): Promise<Account> => {
    const newAccount: Account = {
      id: inc_acc(),
      id_user: userId,
      currency,
      balance: Math.floor(Math.random() * 100),
    };
    accounts.push(newAccount);
    return newAccount;
  };

  public update = async (account: Account): Promise<Account> => {
    const index = accounts.findIndex(({ id }) => account.id === id);
    accounts[index] = account;
    return account;
  };
}

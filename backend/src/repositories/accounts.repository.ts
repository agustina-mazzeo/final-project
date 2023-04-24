import { Account } from '../interfaces';
import { IRepository } from './interfaces/IRepository';

let acc_id = 0;
export class AccountsRepository implements IRepository<Account> {
  private accounts: Account[];
  constructor() {
    this.accounts = [];
  }
  public async getAll(filter?: { filterBy: keyof Account; value: any }[]): Promise<Account[]> {
    if (!filter) {
      return this.accounts;
    }
    return this.accounts.filter(acc => filter.every(({ filterBy, value }) => acc[filterBy] === value));
  }

  public getByID = async (id: number): Promise<Account | undefined> => {
    return this.accounts.find(acc => acc.id === id);
  };

  public create = async ({ userId, currency }: { userId: number; currency: string }): Promise<Account> => {
    const newAccount: Account = {
      id: ++acc_id,
      id_user: userId,
      currency,
      balance: Math.floor(Math.random() * 100),
    };
    this.accounts.push(newAccount);
    return newAccount;
  };

  public update = async (account: Account): Promise<Account> => {
    const index = this.accounts.findIndex(({ id }) => account.id === id);
    this.accounts[index] = account;
    return account;
  };
}

export const accountsRepository = new AccountsRepository();

import { Account, currencies } from '../interfaces/user.interface';

import { IAccountsRepository } from './interfaces/IAccountsRepository';

export class AccountsRepository implements IAccountsRepository {
  private accounts: Account[];
  constructor() {
    this.accounts = [];
  }
  public async getAll(): Promise<Account[]> {
    return this.accounts;
  }

  public async getByID(id: number): Promise<Account | undefined> {
    return this.accounts.find(acc => acc.id === id);
  }
  public async create({ userId, currency }: { userId: number; currency: string }): Promise<Account> {
    const newAccount: Account = {
      id: Math.floor(Math.random() * 3),
      id_user: userId,
      currency,
      balance: Math.floor(Math.random() * 100),
    };
    this.accounts.push(newAccount);
    return newAccount;
  }

  public async createUserAccounts(userId: number): Promise<void> {
    currencies.map(curr => this.create({ userId, currency: curr.name }));
  }
  public async getUserAccounts(userId: number): Promise<Account[]> {
    const userAccounts = await this.getAll();
    return userAccounts.filter(({ id_user }) => id_user === userId);
  }
}

export const accountsRepository = new AccountsRepository();

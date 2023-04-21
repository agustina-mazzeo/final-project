import { IAccountsService } from './interfaces/IAccountsService';
import { IRepository } from '../repositories/interfaces/IRepository';
import { accountsRepository } from '../repositories/accounts.repository';
import { Account } from '../interfaces/user.interface';
import { currencies } from '../interfaces/rates.interface';

class AccountsService implements IAccountsService {
  constructor(private accountsRepository: IRepository<Account>) {}

  public async createUserAccounts(userId: number): Promise<void> {
    currencies.map(curr => this.accountsRepository.create({ userId, currency: curr }));
  }
  public async getUserAccounts(userId: number): Promise<Account[]> {
    return this.accountsRepository.getAll([{ filterBy: 'id_user', value: userId }]);
  }
}

export const accountsService = new AccountsService(accountsRepository);

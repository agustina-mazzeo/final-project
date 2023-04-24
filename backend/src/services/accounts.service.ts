import { IAccountsService } from './interfaces/IAccountsService';
import { IRepository } from '../repositories/interfaces/IRepository';
import { accountsRepository } from '../repositories/accounts.repository';
import { Account, currencies, CustomError } from '../interfaces';

class AccountsService implements IAccountsService {
  constructor(private accountsRepository: IRepository<Account>) {}

  public createUserAccounts = async (userId: number): Promise<void> => {
    currencies.map(curr => this.accountsRepository.create({ userId, currency: curr }));
  };
  public getUserAccounts = async (userId: number): Promise<Account[]> => {
    return this.accountsRepository.getAll([{ filterBy: 'id_user', value: userId }]);
  };

  public getAccountCurrency = async (accountId: number): Promise<string> => {
    const account = await this.accountsRepository.getByID?.(accountId);
    if (!account) throw new CustomError('NOT_FOUND_ERROR', ['Could not fetch account']);
    return account.currency;
  };
}

export const accountsService = new AccountsService(accountsRepository);

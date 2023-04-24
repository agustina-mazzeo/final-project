import { IRepository } from '../repositories/interfaces/IRepository';
import { accountsRepository } from '../repositories/accounts.repository';
import { Account, CustomError } from '../interfaces';
import { IService } from './interfaces/IService';
import { currencies } from '../utils/helpers';

class AccountsService implements IService<Account> {
  constructor(private accountsRepository: IRepository<Account>) {}

  public create = async (userId: number): Promise<any> => {
    currencies.map(currency => this.accountsRepository.create({ userId, currency }));
  };
  public getAll = async (userId: number): Promise<Account[]> => {
    return this.accountsRepository.getAll([{ filterBy: 'id_user', value: userId }]);
  };

  public getAccountCurrency = async (accountId: number): Promise<string> => {
    const account = await this.accountsRepository.getByID?.(accountId);
    if (!account) throw new CustomError('NOT_FOUND_ERROR', ['Could not fetch account']);
    return account.currency;
  };

  public getByID = (): Promise<Account> => {
    throw new CustomError('FORBIDDEN_ERROR', ['Forbidden']);
  };
  public update = (): Promise<Account> => {
    throw new CustomError('FORBIDDEN_ERROR', ['Forbidden']);
  };
}

export const accountsService = new AccountsService(accountsRepository);

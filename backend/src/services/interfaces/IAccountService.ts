import { Account } from '../../interfaces';
import { IService } from './IService';

export interface IAccountService extends IService<Account> {
  createUsersAccounts(userId: number): Promise<void>;
  updateAccounts(account_from: Account, account_to: Account, amount: number, userId: number): Promise<{ account_from: Account; account_to: Account }>;
}

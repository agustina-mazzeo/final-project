import { Account } from '../../interfaces';
import { IService } from './IService';

export interface IAccountService extends IService<Account> {
  createUsersAccounts(userId: number): Promise<void>;
}

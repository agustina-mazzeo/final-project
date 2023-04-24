import { Account } from '../../interfaces/user.interface';
import { IService } from './IService';

export interface IAccountsService extends IService<Account> {
  createUserAccounts(userId: number): Promise<void>;
  getUserAccounts(userId: number): Promise<Account[]>;
}

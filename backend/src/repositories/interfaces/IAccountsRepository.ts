import { Account } from 'interfaces/user.interface';
import { IRepository } from './IRepository';

export interface IAccountsRepository extends IRepository<Account> {
  getUserAccounts(id: number): Promise<Account[]>;
  createUserAccounts(id: number): Promise<void>;
}

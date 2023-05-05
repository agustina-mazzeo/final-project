import { User } from 'interfaces/user.interface';
import { IRepository } from './IRepository';

export interface IUserRepository extends IRepository<User> {
  getByEmail(email: string): Promise<User | undefined>;
}

import { User } from '../../interfaces';
import { IService } from './IService';

export interface IUserService extends IService<User> {
  getByEmail(email: string): Promise<User>;
}

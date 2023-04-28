import { users } from '../../database';
import { CustomError, User, UserData } from '../interfaces';
import { IUserRepository } from './interfaces';

export class UserRepository implements IUserRepository {
  public getAll = async (): Promise<User[]> => {
    return users;
  };
  public create = async (user: UserData): Promise<User> => {
    const newUser: User = {
      ...user,
      id: Math.random(),
    };
    users.push(newUser);
    return newUser;
  };

  public getByEmail = async (email: string): Promise<User | undefined> => {
    return users.find(user => user.email === email);
  };

  public getByID = async (id: number): Promise<User | undefined> => {
    return users.find(user => user.id === id);
  };

  public update = (): Promise<User> => {
    throw new CustomError('FORBIDDEN_ERROR', ['Forbidden']);
  };
}

import { User, UserData } from 'interfaces/user.interface';
import { IUsersRepository } from './interfaces/IUsersRepository';

class UsersRepository implements IUsersRepository {
  private users: User[];
  constructor() {
    this.users = [];
  }
  public async getAll(): Promise<User[]> {
    return this.users;
  }
  public async create(user: UserData): Promise<User> {
    const newUser: User = {
      ...user,
      id: Math.random(),
    };
    this.users.push(newUser);
    return newUser;
  }

  public async getByEmail(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }
  public async getByID(id: number): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }
}

export const usersRepository = new UsersRepository();

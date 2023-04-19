import { User, UserData } from 'interfaces/user.interface';
import { hash } from 'bcrypt';
import { accountsRepository } from './accounts.repository';
import { IUsersRepository } from './interfaces/IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private users: User[];
  constructor() {
    this.users = [];
  }
  public async getAll(): Promise<User[]> {
    return this.users;
  }
  public async create(user: UserData): Promise<UserData> {
    const findUser: User | undefined = await this.getByEmail(user.email);
    if (findUser) throw new Error(`This email ${user.email} already exists`);
    const password = await hash(user.password, 10);
    const newUser: User = {
      ...user,
      password,
      id: Math.random(),
    };
    this.users.push(newUser);
    //create user's accounts
    accountsRepository.createUserAccounts(newUser.id);
    return user;
  }

  public async getByEmail(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }
  public async getByID(id: number): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }
}

export const usersRepository = new UsersRepository();

import { hash } from 'bcrypt';
import { IService } from './interfaces/IService';
import { CustomError, User, UserData } from '../interfaces';
import { usersRepository } from '../repositories/users.repository';
import { IUsersRepository } from 'repositories/interfaces/IUsersRepository';
import { accountsService } from './accounts.service';

class UsersService implements IService<User> {
  constructor(private usersRepository: IUsersRepository) {}

  public async getAll(): Promise<User[]> {
    return this.usersRepository.getAll();
  }

  public async create(user: UserData): Promise<User> {
    const findUser: User | undefined = await this.usersRepository.getByEmail(user.email);
    if (findUser) throw new CustomError('VALIDATION_ERROR', [`This email ${user.email} already exists`]);

    const password = await hash(user.password, 10);
    const newUser: User = await this.usersRepository.create({ ...user, password });
    //create user's accounts
    accountsService.createUserAccounts(newUser.id);
    return newUser;
  }
}

export const usersService = new UsersService(usersRepository);

import { hash } from 'bcrypt';
import { CustomError, User, UserData } from '../interfaces';
import { IAccountService, IUserService } from './interfaces';
import { IUserRepository } from '../repositories/interfaces';

export class UserService implements IUserService {
  constructor(private usersRepository: IUserRepository, private accountsService: IAccountService) {}

  public getAll = async (): Promise<User[]> => {
    return this.usersRepository.getAll();
  };

  public getByEmail = async (email: string): Promise<User> => {
    const user = await this.usersRepository.getByEmail(email);
    if (user) return user;
    else throw new CustomError('VALIDATION_ERROR', ['Invalid credentials']);
  };

  public getByID = async (id: number): Promise<User> => {
    const user = await this.usersRepository.getByID(id);
    if (user) return user;
    else throw new CustomError('VALIDATION_ERROR', ['Invalid credentials']);
  };

  public create = async (user: UserData): Promise<User> => {
    try {
      const findUser: User | undefined = await this.usersRepository.getByEmail(user.email);
      if (findUser) throw new CustomError('VALIDATION_ERROR', [`This email ${user.email} already exists`]);

      const password = await hash(user.password, 10);
      const newUser: User = await this.usersRepository.create({ ...user, password });
      //create user's accounts
      this.accountsService.createUsersAccounts(newUser.id);
      return newUser;
    } catch (error: any) {
      throw new CustomError(error.errorType, error.messages);
    }
  };

  public update = (): Promise<User> => {
    throw new CustomError('FORBIDDEN_ERROR', ['Forbidden']);
  };
}

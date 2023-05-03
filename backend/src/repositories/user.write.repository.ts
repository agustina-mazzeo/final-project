import { users } from '../../database';
import { CustomError, User } from '../interfaces';
import { UserCreateInputDTO, UserModelDTO } from './dtos';
import { IUserWriteRepository } from './interfaces';

export class UserWriteRepository implements IUserWriteRepository {
  public create = async (user: UserCreateInputDTO): Promise<UserModelDTO> => {
    const newUser: User = {
      ...user,
      id: Math.random(),
    };
    users.push(newUser);
    return newUser;
  };

  public update = (): Promise<UserModelDTO> => {
    throw new CustomError('FORBIDDEN_ERROR', ['Forbidden']);
  };
}

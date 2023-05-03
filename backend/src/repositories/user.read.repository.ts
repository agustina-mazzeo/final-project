import { users } from '../../database';
import { UserGetterDTO, UserModelDTO } from './dtos';
import { IUserReadRepository } from './interfaces';

export class UserReadRepository implements IUserReadRepository {
  public getAll = async (): Promise<UserModelDTO[]> => {
    return users;
  };

  public getByEmail = async (email: string): Promise<UserModelDTO | undefined> => {
    return users.find(user => user.email === email);
  };

  public getByID = async (id: UserGetterDTO): Promise<UserModelDTO | undefined> => {
    return users.find(user => user.id === id);
  };
}

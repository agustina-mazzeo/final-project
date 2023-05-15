import { UnauthorizedError } from '../interfaces';
import { IUserReadService } from './interfaces';
import { IUserReadRepository } from '../repositories/interfaces';
import { UserGetterDTO, UserOutputDTO } from './dtos';

export class UserReadService implements IUserReadService {
  constructor(private userReadRepository: IUserReadRepository) {}

  public getAll = async (): Promise<UserOutputDTO[]> => this.userReadRepository.getAll();

  public getByEmail = async (email: string): Promise<UserOutputDTO> => {
    const user = await this.userReadRepository.getByEmail(email);
    if (user) return user;
    else throw new UnauthorizedError('Invalid credentials');
  };

  public getByID = async (id: UserGetterDTO): Promise<UserOutputDTO> => {
    const user = await this.userReadRepository.getByID(id);
    if (user) return user;
    else throw new UnauthorizedError('Invalid credentials');
  };
}

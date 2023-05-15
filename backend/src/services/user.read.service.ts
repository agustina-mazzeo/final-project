import { CustomError } from '../interfaces';
import { IUserReadService } from './interfaces';
import { IUserReadRepository } from '../repositories/interfaces';
import { UserGetterDTO, UserOutputDTO } from './dtos';

export class UserReadService implements IUserReadService {
  constructor(private userReadRepository: IUserReadRepository) {}

  public getAll = async (): Promise<UserOutputDTO[]> => {
    try {
      return this.userReadRepository.getAll();
    } catch (error: any) {
      throw new CustomError(error.errorType, error.messages);
    }
  };

  public getByEmail = async (email: string): Promise<UserOutputDTO> => {
    const user = await this.userReadRepository.getByEmail(email);
    if (user) return user;
    else throw new CustomError('VALIDATION_ERROR', ['Invalid credentials']);
  };

  public getByID = async (id: UserGetterDTO): Promise<UserOutputDTO> => {
    const user = await this.userReadRepository.getByID(id);
    if (user) return user;
    else throw new CustomError('VALIDATION_ERROR', ['Invalid credentials']);
  };
}

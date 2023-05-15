import { hash } from 'bcrypt';
import { ForbiddenError, ValidationError } from '../interfaces';
import { IAccountWriteService, IUserWriteService } from './interfaces';
import { IUserReadRepository, IUserWriteRepository } from '../repositories/interfaces';
import { UserOutputDTO, UserCreateInputDTO } from './dtos';

export class UserWriteService implements IUserWriteService {
  constructor(
    private userReadRepository: IUserReadRepository,
    private userWriteRepository: IUserWriteRepository,
    private accountWriteService: IAccountWriteService,
  ) {}

  public create = async (user: UserCreateInputDTO): Promise<UserOutputDTO> => {
    const findUser: UserOutputDTO | null = await this.userReadRepository.getByEmail(user.email);
    if (findUser) throw new ValidationError(`This email ${user.email} already exists`);

    const password = await hash(user.password, 10);
    const newUser: UserOutputDTO = await this.userWriteRepository.create({ ...user, password });
    //create user's accounts
    this.accountWriteService.createUsersAccounts(newUser.id);
    return newUser;
  };

  public update = (): Promise<UserOutputDTO> => {
    throw new ForbiddenError('Forbidden');
  };
}

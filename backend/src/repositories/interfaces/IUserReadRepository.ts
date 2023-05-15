import { UserModelDTO, UserGetterDTO } from '../dtos';
import { IReadRepository } from '.';

export interface IUserReadRepository extends IReadRepository<UserModelDTO, unknown, UserGetterDTO> {
  getByEmail(email: string): Promise<UserModelDTO | null>;
}

import { UserModelDTO, UserGetterDTO } from '../data-transfer-objects';
import { IReadRepository } from '.';

export interface IUserReadRepository extends IReadRepository<UserModelDTO, unknown, UserGetterDTO> {
  getByEmail(email: string): Promise<UserModelDTO | undefined>;
}

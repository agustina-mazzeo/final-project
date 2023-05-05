import { UserOutputDTO, UserGetterDTO } from '../dtos';
import { IReadService } from '.';

export interface IUserReadService extends IReadService<UserOutputDTO, unknown, UserGetterDTO> {
  getByEmail(email: string): Promise<UserOutputDTO>;
}

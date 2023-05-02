import { UserOutputDTO, UserGetterDTO } from '../data-transfer-objects';
import { IReadService } from '.';

export interface IUserReadService extends IReadService<UserOutputDTO, unknown, UserGetterDTO> {
  getByEmail(email: string): Promise<UserOutputDTO>;
}

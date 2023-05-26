import { User } from '../../../interfaces';
import { UserOutputDTO } from './UserOutput';

export type UserCreateInputDTO = User;

export type UserGetterDTO = UserOutputDTO['id'];

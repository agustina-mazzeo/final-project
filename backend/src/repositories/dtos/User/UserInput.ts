import { User } from '../../../interfaces';
import { UserModelDTO } from './UserModel';

export type UserCreateInputDTO = User;

export type UserGetterDTO = UserModelDTO['id'];

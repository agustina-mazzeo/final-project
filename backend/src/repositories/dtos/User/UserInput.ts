import { User } from '../../../interfaces';

export type UserCreateInputDTO = { email: string; password: string; name?: string };

export type UserGetterDTO = User['id'];

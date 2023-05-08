import { UserModelDTO } from './UserModel';

export type UserCreateInputDTO = { email: string; password: string; name?: string };

export type UserGetterDTO = UserModelDTO['id'];

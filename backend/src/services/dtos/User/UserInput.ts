import { UserOutputDTO } from './UserOutput';

export type UserCreateInputDTO = { email: string; password: string; name?: string };

export type UserGetterDTO = UserOutputDTO['id'];

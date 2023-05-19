import { AccountOutputDTO } from './AccountOutput';

export type AccountCreateInputDTO = Pick<AccountOutputDTO, 'currency' | 'userId'>;
export type AccountUpdateInputDTO = Pick<AccountOutputDTO, 'balance' | 'id'>;

export type AccountGetAllInputDTO = AccountOutputDTO['userId'];
export type AccountGetterDTO = AccountOutputDTO['id'];

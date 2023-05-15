import { AccountOutputDTO } from './AccountOutput';

export type AccountCreateInputDTO = Pick<AccountOutputDTO, 'currency' | 'user_id'>;
export type AccountUpdateInputDTO = Pick<AccountOutputDTO, 'balance' | 'id'>;

export type AccountGetAllInputDTO = AccountOutputDTO['user_id'];
export type AccountGetterDTO = AccountOutputDTO['id'];

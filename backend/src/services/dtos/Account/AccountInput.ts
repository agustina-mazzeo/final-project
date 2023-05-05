import { Account } from '../../../interfaces';

export type AccountCreateInputDTO = Pick<Account, 'currency' | 'user_id'>;
export type AccountUpdateInputDTO = Pick<Account, 'balance' | 'id'>;

export type AccountGetterDTO = number;

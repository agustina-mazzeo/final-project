import { Account } from '../../../interfaces';

export type AccountCreateInputDTO = Pick<Account, 'currency' | 'id_user'>;
export type AccountUpdateInputDTO = Pick<Account, 'balance' | 'id'>;

export type AccountGetAllDTO = { filterBy: keyof Account; value: any }[];
export type AccountGetterDTO = number;

import { Account } from '../../../interfaces';

export type AccountCreateInputDTO = Pick<Account, 'currency' | 'id_user'>;
export type AccountUpdateInputDTO = Pick<Account, 'balance' | 'id'>;

export type AccountGetAllDTO = { filterBy: keyof Account; value: any; operator: (arg1: any, arg2: any) => boolean }[];
export type AccountGetterDTO = number;

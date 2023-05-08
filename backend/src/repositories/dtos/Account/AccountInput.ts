import { AccountModelDTO } from './AccountModel';

export type AccountCreateInputDTO = Pick<AccountModelDTO, 'currency' | 'user_id'>;
export type AccountUpdateInputDTO = Pick<AccountModelDTO, 'balance' | 'id'>;

export type AccountGetAllDTO = { filterBy: keyof AccountModelDTO; value: any; operator: (arg1: any, arg2: any) => boolean }[];
export type AccountGetterDTO = AccountModelDTO['id'] | AccountModelDTO['user_id'];

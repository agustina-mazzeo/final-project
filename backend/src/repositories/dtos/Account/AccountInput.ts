import { AccountModelDTO } from './AccountModel';
//import { operators } from '../../../utils/helpers';

export type AccountCreateInputDTO = Pick<AccountModelDTO, 'currency' | 'user_id'>;
export type AccountUpdateInputDTO = Pick<AccountModelDTO, 'balance' | 'id'>;

//export type AccountGetAllInputDTO = { filterBy: keyof AccountModelDTO; value: any; operator: keyof typeof operators }[];
export type AccountGetAllInputDTO = { filterBy: keyof AccountModelDTO; value: any; operator: string }[];
export type AccountGetterDTO = AccountModelDTO['id'] | AccountModelDTO['user_id'];

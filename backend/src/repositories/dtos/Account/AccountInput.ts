import { AccountModelDTO } from './AccountModel';
import { operators } from '../../../utils/helpers';

export type AccountCreateInputDTO = Pick<AccountModelDTO, 'currency' | 'userId'>;
export type AccountUpdateInputDTO = Pick<AccountModelDTO, 'balance' | 'id'>;

export type AccountGetAllInputDTO = { filterBy: keyof AccountModelDTO; value: any; operator: operators }[];
export type AccountGetterDTO = AccountModelDTO['id'] | AccountModelDTO['userId'];

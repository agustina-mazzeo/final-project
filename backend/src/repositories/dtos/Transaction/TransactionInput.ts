import { operators } from '../../../utils/helpers';
import { TransactionModelDTO } from './TransactionModel';

export type TransactionInputDTO = Pick<TransactionModelDTO, 'accountFromId' | 'accountToId' | 'amount' | 'description'>;

export type TransactionGetAllInputDTO = {
  usersAccountsId?: number[];
  filters: { filterBy: keyof TransactionModelDTO; value: any; operator: operators }[];
  sorting: { pageNumber?: number; pageSize?: number; sortBy?: keyof TransactionModelDTO; orderBy?: 'desc' | 'asc' };
};

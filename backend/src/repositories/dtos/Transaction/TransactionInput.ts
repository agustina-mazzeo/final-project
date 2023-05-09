//import { operators } from '../../../utils/helpers';
import { TransactionModelDTO } from './TransactionModel';

export type TransactionInputDTO = Pick<TransactionModelDTO, 'account_from_id' | 'account_to_id' | 'amount' | 'description'>;

export type TransactionGetAllInputDTO = {
  usersAccountsId: number[];
  filters: { filterBy: keyof TransactionModelDTO; value: any; operator: string }[];
  //filters: { filterBy: keyof TransactionModelDTO; value: any; operator: keyof typeof operators }[];
};

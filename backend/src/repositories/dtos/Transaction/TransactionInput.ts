import { TransactionModelDTO } from './TransactionModel';

export type TransactionInputDTO = Pick<TransactionModelDTO, 'account_from_id' | 'account_to_id' | 'amount' | 'description'>;

export type TransactionGetAllDTO = {
  usersAccountsId: number[];
  filters: { filterBy: keyof TransactionModelDTO; value: any; operator: (arg1: any, arg2: any) => boolean }[];
};

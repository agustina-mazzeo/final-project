import { Transaction } from '../../../interfaces';

export type TransactionInputDTO = Pick<Transaction, 'account_from' | 'account_to' | 'amount' | 'description'>;

export type TransactionGetAllDTO = {
  usersAccountsId: number[];
  filters: { filterBy: keyof Transaction; value: any; operator: (arg1: any, arg2: any) => boolean }[];
};

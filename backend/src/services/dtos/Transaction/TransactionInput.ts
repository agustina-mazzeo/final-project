import { Transaction } from '../../../interfaces';

export type TransactionInputDTO = {
  userId: number;
  transfer: Pick<Transaction, 'account_from' | 'account_to' | 'amount' | 'description'>;
};
export type TransactionGetAllDTO = {
  userId: number;
  queryParams: {
    from?: string;
    to?: string;
    account_from?: number;
  };
};

import { TransactionOutputDTO } from './TransactionOutput';

export type TransactionInputDTO = {
  userId: string;
  transfer: Pick<TransactionOutputDTO, 'account_from_id' | 'account_to_id' | 'amount' | 'description'>;
};
export type TransactionGetAllDTO = {
  userId: string;
  queryParams: {
    from?: string;
    to?: string;
    account_from_id?: number;
  };
};

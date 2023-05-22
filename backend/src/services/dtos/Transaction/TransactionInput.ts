import { TransactionOutputDTO } from './TransactionOutput';

export type TransactionInputDTO = {
  userId: string | undefined;
  transfer: Pick<TransactionOutputDTO, 'accountFromId' | 'accountToId' | 'amount' | 'description'>;
};
export type TransactionGetAllDTO = {
  userId: string | undefined;
  queryParams: {
    from?: string;
    to?: string;
    accountFromId?: number;
  };
};

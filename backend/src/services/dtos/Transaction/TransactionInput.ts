import { ClientRole } from '../../../utils/helpers';
import { TransactionOutputDTO } from './TransactionOutput';

export type TransactionInputDTO = {
  userId: string | undefined;
  transfer: Pick<TransactionOutputDTO, 'accountFromId' | 'accountToId' | 'amount' | 'description'>;
};
export type TransactionGetAllDTO = {
  user: { id: string | undefined; role: ClientRole | undefined };
  queryParams: {
    from?: string;
    to?: string;
    accountFromId?: number;
  };
};

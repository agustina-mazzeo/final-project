import { Transaction } from '../../../interfaces';

export type TransactionOutputDTO = Transaction & {
  id: string;
  createdAt: string;
};

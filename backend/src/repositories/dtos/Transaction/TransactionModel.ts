import { Transaction } from '../../../interfaces';

export type TransactionModelDTO = Transaction & {
  id: string;
  createdAt: string;
};

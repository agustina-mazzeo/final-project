import { Transaction } from '../../../interfaces';

export type TransactionInputDTO = Pick<Transaction, 'account_from' | 'account_to' | 'amount' | 'description'>;

export type TransactionGetAllDTO = { filterBy: keyof Transaction; value: any }[];

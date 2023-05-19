import { TransactionsQuery } from './transactions.schema';
import { TransferBody } from './transactions.schema';

export type TransacitonInputDTO = {
  account_from_id: number;
  account_to_id: number;
  amount: number;
  description?: string | undefined;
};

export const transactionToDTO = ({ account_from, account_to, amount, description }: TransferBody): TransacitonInputDTO => {
  const result: TransacitonInputDTO = {
    account_to_id: account_to,
    account_from_id: account_from,
    amount,
  };
  if (description) result.description = description;
  return result;
};

export type QueryParamsDTO = {
  account_from_id?: number;
  from?: string;
  to?: string;
};

export const queryToDTO = ({ account_from, from, to }: TransactionsQuery): QueryParamsDTO => {
  const result: QueryParamsDTO = {};
  if (account_from) result.account_from_id = account_from;
  if (from) result.from = from;
  if (to) result.to = to;
  return result;
};

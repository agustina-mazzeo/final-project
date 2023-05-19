import { TransactionsQuery } from './transactions.schema';
import { TransferBody } from './transactions.schema';

export type TransacitonInputDTO = {
  accountFromId: number;
  accountToId: number;
  amount: number;
  description?: string | undefined;
};

export const transactionToDTO = ({ account_from, account_to, amount, description }: TransferBody): TransacitonInputDTO => {
  const result: TransacitonInputDTO = {
    accountToId: account_to,
    accountFromId: account_from,
    amount,
  };
  if (description) result.description = description;
  return result;
};

export type QueryParamsDTO = {
  accountFromId?: number;
  from?: string;
  to?: string;
};

export const queryToDTO = ({ account_from, from, to }: TransactionsQuery): QueryParamsDTO => {
  const result: QueryParamsDTO = {};
  if (account_from) result.accountFromId = account_from;
  if (from) result.from = from;
  if (to) result.to = to;
  return result;
};

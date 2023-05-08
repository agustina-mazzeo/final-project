import { TransactionsQuery } from './transactions.schema';
import { TransferBody } from './transactions.schema';

export type TransacitonInputDTO = {
  account_from_id: number;
  account_to_id: number;
  amount: number;
  description?: string | undefined;
};

export const transactionToDTO = ({ account_from, account_to, amount, description }: TransferBody): TransacitonInputDTO => {
  return {
    account_from_id: account_from,
    account_to_id: account_to,
    amount,
    description,
  };
};

export type QueryParamsDTO = {
  account_from_id?: number;
  from?: string;
  to?: string;
};

export const queryToDTO = ({ account_from, from, to }: TransactionsQuery): QueryParamsDTO => {
  return {
    account_from_id: account_from,
    from,
    to,
  };
};

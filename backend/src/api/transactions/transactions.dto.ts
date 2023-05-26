import { Pagination, Sorting, Filters, Transaction } from '../../interfaces';
import { TransactionOutputDTO } from '../../services/dtos';
import { TransactionsQuery } from './transactions.schema';
import { TransferBody } from './transactions.schema';

export type TransacitonInputDTO = Transaction;

export const transactionToDTO = ({ account_from, account_to, amount, description }: TransferBody): TransacitonInputDTO => {
  const result: TransacitonInputDTO = {
    accountToId: account_to,
    accountFromId: account_from,
    amount,
  };
  if (description) result.description = description;
  return result;
};

export type QueryParamsDTO = Sorting & Pagination & Filters;

export const queryToDTO = ({ account_from, from, to, page_number, page_size, order_by, sort_by }: TransactionsQuery): QueryParamsDTO => {
  const result: QueryParamsDTO = {};
  if (order_by) result.orderBy = order_by;
  if (sort_by) result.sortBy = sort_by as keyof TransactionOutputDTO;
  if (page_number) result.pageNumber = page_number;
  if (page_size) result.pageSize = page_size;
  if (account_from) result.accountFromId = account_from;
  if (from) result.from = from;
  if (to) result.to = to;
  return result;
};

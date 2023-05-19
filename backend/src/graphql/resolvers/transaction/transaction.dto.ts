import { TransacitonInputDTO } from '../../../api/transactions/transactions.dto';
import { QueryInput, TransactionInput } from '../../validation';

export const queryToDTO = ({ accountFrom, from, to }: QueryInput['query']) => {
  const result: Record<string, any> = {};
  if (accountFrom) result.account_from_id = accountFrom;
  if (from) result.from = from;
  if (to) result.to = to;
  return result;
};

export const transferToDTO = ({ accountFrom, accountTo, amount, description }: TransactionInput['transfer']) => {
  const result: TransacitonInputDTO = {
    account_from_id: accountFrom,
    account_to_id: accountTo,
    amount,
  };
  if (description) result.description = description;
  return result;
};

import { CustomError } from '../../../interfaces';
import { Context } from '../../context';
import { GraphQLError } from 'graphql';
import { QueryInput, queryInputSchema, validateArgs } from '../../validation';
import { queryToDTO } from './transaction.dto';

export const transactionQueries = {
  transactions: async (parent: undefined, args: QueryInput, contextValue: Context) => {
    try {
      const { query } = (await validateArgs(queryInputSchema, args)) as QueryInput;
      const userId = contextValue.userId;
      const transactions = await contextValue.dataSources.transactionReadService.getAll({ queryParams: queryToDTO(query), userId });
      return transactions.map(transaction => {
        return {
          ...transaction,
          createdAt: transaction.created_at,
          accountFromId: transaction.account_from_id,
          accountToId: transaction.account_to_id,
        };
      });
    } catch (error: any) {
      if (error instanceof CustomError)
        throw new GraphQLError(error.message, {
          extensions: { code: error.errorType },
        });
      throw error;
    }
  },
};

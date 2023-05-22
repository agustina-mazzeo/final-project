import { CustomError } from '../../../interfaces';
import { Context } from '../../context';
import { GraphQLError } from 'graphql';
import { QueryInput, queryInputSchema, validateArgs } from '../../validation';
import { queryToDTO } from './transaction.dto';

export const transactionQueries = {
  transactions: async (parent: undefined, args: QueryInput, contextValue: Context) => {
    try {
      const { query } = (await validateArgs(queryInputSchema, args)) as QueryInput;
      const user = { id: contextValue.userId, role: contextValue.role };
      return await contextValue.dataSources.transactionReadService.getAll({ queryParams: queryToDTO(query), user });
    } catch (error: any) {
      if (error instanceof CustomError)
        throw new GraphQLError(error.message, {
          extensions: { code: error.errorType },
        });
      throw error;
    }
  },
};

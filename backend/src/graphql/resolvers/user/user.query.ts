import { GraphQLError } from 'graphql';
import { CustomError } from '../../../interfaces';
import { Context } from '../../context';

export const userQueries = {
  users: async (parent: undefined, args: Record<string, any>, contextValue: Context) => {
    try {
      const users = await contextValue.dataSources.userReadService.getAll();
      return users;
    } catch (error: any) {
      if (error instanceof CustomError)
        throw new GraphQLError(error.message, {
          extensions: { code: error.errorType },
        });
      throw error;
    }
  },
  accounts: async (parent: undefined, args: Record<string, any>, contextValue: Context) => {
    try {
      const userId = contextValue.userId;
      const accounts = await contextValue.dataSources.accountReadService.getAll(userId);
      return accounts.map(account => {
        return { ...account, userId };
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

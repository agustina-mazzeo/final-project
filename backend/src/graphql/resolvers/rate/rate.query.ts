import { CustomError } from '../../../interfaces';
import { Context } from '../../context';
import { GraphQLError } from 'graphql';

export const rateQueries = {
  rates: async (parent: undefined, args: Record<string, any>, contextValue: Context) => {
    try {
      const rates = await contextValue.dataSources.rateReadService.getAll();
      return rates.map(({ name, createdAt, rates: { usdFrom, usdTo } }) => {
        return { name, createdAt, conversion: { usdFrom, usdTo } };
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

import { CustomError } from '../../../interfaces';
import { Context } from '../../context';
import { GraphQLError } from 'graphql';

export const rateQueries = {
  rates: async (parent: undefined, args: Record<string, any>, contextValue: Context) => {
    try {
      const rates = await contextValue.dataSources.rateReadService.getAll();
      return rates.map(({ name, created_at, rates }) => {
        return { name, createdAt: created_at, conversion: { usdFrom: rates.USD_FROM, usdTo: rates.USD_TO } };
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

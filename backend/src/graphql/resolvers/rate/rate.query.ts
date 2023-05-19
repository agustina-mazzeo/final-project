import { Context } from '../../context';

export const rateQueries = {
  rates: async (parent: undefined, args: Record<string, any>, contextValue: Context) => {
    const rates = await contextValue.dataSources.rateReadService.getAll();
    return rates.map(({ name, created_at, rates }) => {
      return { name, createdAt: created_at, conversion: { usdFrom: rates.USD_FROM, usdTo: rates.USD_TO } };
    });
  },
};

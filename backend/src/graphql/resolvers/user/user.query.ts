import { Context } from '../../context';

export const userQueries = {
  users: async (parent: undefined, args: Record<string, any>, contextValue: Context) => {
    const users = await contextValue.dataSources.userReadService.getAll();
    return users;
  },
  accounts: async (parent: undefined, args: Record<string, any>, contextValue: Context) => {
    const userId = contextValue.userId;
    const accounts = await contextValue.dataSources.accountReadService.getAll(userId);
    return accounts.map(account => {
      return { ...account, userId };
    });
  },
};

import { Context } from '../../context';

export const userQueries = {
  users: async (parent: undefined, args: Record<string, any>, contextValue: Context) => {
    const users = await contextValue.dataSources.userReadService.getAll();
    return users;
  },
};

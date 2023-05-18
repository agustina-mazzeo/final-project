import { Context } from '../../context';

export const userMutations = {
  createUser: async (parent: undefined, args: Record<string, any>, contextValue: Context) => {
    const { name, email } = await contextValue.dataSources.userWriteService.create(args.user);
    return { name, email };
  },
};

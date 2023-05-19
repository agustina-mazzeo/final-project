import { CustomError, UnauthorizedError } from '../../../interfaces';
import { createToken } from '../../../api/utils/helpers';
import { Context } from '../../context';
import { compare } from 'bcrypt';
import { GraphQLError } from 'graphql';
export const userMutations = {
  createUser: async (parent: undefined, args: Record<string, any>, contextValue: Context) => {
    try {
      const { name, email } = await contextValue.dataSources.userWriteService.create(args.user);
      return { name, email };
    } catch (error: any) {
      if (error instanceof CustomError)
        throw new GraphQLError(error.message, {
          extensions: { code: error.errorType },
        });
      throw error;
    }
  },
  login: async (parent: undefined, { user }: any, contextValue: Context) => {
    try {
      const savedUser = await contextValue.dataSources.userReadService.getByEmail(user.email);
      if (!(await compare(user.password, savedUser.password))) {
        throw new UnauthorizedError('Invalid credentials');
      } else return { user: { name: savedUser, email: savedUser.email }, token: createToken(savedUser) };
    } catch (error: any) {
      if (error instanceof CustomError)
        throw new GraphQLError(error.message, {
          extensions: { code: error.errorType },
        });
      throw error;
    }
  },
};

import { CustomError, UnauthorizedError } from '../../../interfaces';
import { createToken } from '../../../api/utils/helpers';
import { Context } from '../../context';
import { compare } from 'bcrypt';
import { GraphQLError } from 'graphql';
import { UserCreateInput, userCreateInputSchema, validateArgs, UserLoginInput, userLoginInputSchema } from '../../validation/';

export const userMutations = {
  createUser: async (parent: undefined, args: UserCreateInput, contextValue: Context) => {
    try {
      const { user } = (await validateArgs(userCreateInputSchema, args)) as UserCreateInput;
      const { name, email } = await contextValue.dataSources.userWriteService.create(user);
      return { name, email };
    } catch (error: any) {
      if (error instanceof CustomError)
        throw new GraphQLError(error.message, {
          extensions: { code: error.errorType },
        });
      throw error;
    }
  },
  login: async (parent: undefined, args: UserLoginInput, contextValue: Context) => {
    try {
      const { user } = (await validateArgs(userLoginInputSchema, args)) as UserLoginInput;
      const savedUser = await contextValue.dataSources.userReadService.getByEmail(user.email);
      if (!(await compare(user.password, savedUser.password))) throw new UnauthorizedError('Invalid credentials');
      return { user: { name: savedUser, email: savedUser.email }, token: createToken(savedUser) };
    } catch (error: any) {
      if (error instanceof CustomError)
        throw new GraphQLError(error.message, {
          extensions: { code: error.errorType },
        });
      throw error;
    }
  },
};

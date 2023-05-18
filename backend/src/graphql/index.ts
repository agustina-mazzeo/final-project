import { CustomError } from '../interfaces';
import { ApolloServer } from '@apollo/server';
import schema from './schema';
import { Context } from './context';

export const server = new ApolloServer<Context>({
  schema,
  includeStacktraceInErrorResponses: false,
  formatError: (formattedError, error) => {
    if (error instanceof CustomError) {
      return { message: error.message, extensions: { code: error.errorType } };
    } else return formattedError;
  },
});

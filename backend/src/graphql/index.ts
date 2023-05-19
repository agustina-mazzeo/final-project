import { Router } from 'express';
import { json } from 'body-parser';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import schema from './schema';
import { Context, context } from './context';
import { CustomError } from '../interfaces';

export const server = new ApolloServer<Context>({
  schema,
  includeStacktraceInErrorResponses: false,
  formatError: (formattedError, error) => {
    if (error instanceof CustomError) {
      return { message: error.message, extensions: { code: error.errorType } };
    } else return formattedError;
  },
});

export const graphqlRouter = Router();
(async () => {
  try {
    await server.start();
    graphqlRouter.use(cors<cors.CorsRequest>(), json(), expressMiddleware(server, { context }));
  } catch (error) {
    console.log(error);
  }
})();

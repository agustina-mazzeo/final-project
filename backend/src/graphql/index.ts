import schema from './schema';
import { Context, context } from './context';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import { json } from 'body-parser';
import express from 'express';

const port = Number(process.env.GQL_PORT) || 4000;

const app = express();

const server = new ApolloServer<Context>({
  schema,
});

(async () => {
  try {
    await server.start();
    app.use('/', cors<cors.CorsRequest>(), json(), expressMiddleware(server, { context }));
  } catch (error) {
    console.log(error);
  }
})();

app.listen(port, async () => {
  console.log(`Listening on port ${port}`);
});

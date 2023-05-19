import { makeExecutableSchema } from '@graphql-tools/schema';
import resolvers from './resolvers';
import { query, mutation, account, transaction, rate, user } from './typedefs';

const schema = makeExecutableSchema({
  typeDefs: [query, mutation, account, user, transaction, rate],
  resolvers,
});

export default schema;

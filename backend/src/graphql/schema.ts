import { makeExecutableSchema } from '@graphql-tools/schema';
import resolvers from './resolvers';
import { query, mutation, account, transaction, rate, user } from './typedefs';
import { attachAuthDirective } from './directives';

const schema = makeExecutableSchema({
  typeDefs: [query, mutation, account, user, transaction, rate],
  resolvers,
});

const newSchema = attachAuthDirective(schema, 'auth');
export default newSchema;

import { rateQueries } from './rate';
import { userQueries, userMutations } from './user';
import { transactionQueries, transactionMutations } from './transaction';

export default {
  Query: { ...rateQueries, ...userQueries, ...transactionQueries },
  Mutation: { ...userMutations, ...transactionMutations },
};

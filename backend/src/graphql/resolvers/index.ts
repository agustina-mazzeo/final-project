import { rateQueries } from './rate';
import { userQueries, userMutations } from './user';

export default {
  Query: { ...rateQueries, ...userQueries },
  Mutation: { ...userMutations },
};

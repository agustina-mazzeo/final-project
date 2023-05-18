import { rateQueries } from './rate';
import { userQueries } from './user';

export default {
  Query: { ...rateQueries, ...userQueries },
  Mutation: {},
};

import { Router } from 'express';
import { TransactionRoutes } from './transaction.routes';
import { UserRoutes } from './user.routes';
import { RatesRoutes } from './rates.routes';
export { graphqlRouter } from '../../graphql';

const transactionsRouter = new TransactionRoutes().router;
const userRouter = new UserRoutes().router;
const ratesRouter = new RatesRoutes().router;

export const apiRouter = Router();

apiRouter.use(userRouter);
apiRouter.use(transactionsRouter);
apiRouter.use(ratesRouter);

import { Router } from 'express';
import { TransactionRoutes } from './transaction.routes';
import { UserRoutes } from './user.routes';
import { RatesRoutes } from './rates.routes';

const transactionsRouter = new TransactionRoutes().router;
const userRouter = new UserRoutes().router;
const ratesRouter = new RatesRoutes().router;

export const indexRouter = Router();

indexRouter.use(userRouter);
indexRouter.use(transactionsRouter);
indexRouter.use(ratesRouter);

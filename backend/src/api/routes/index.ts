import { Application } from 'express';
import { TransactionRoutes } from './transaction.routes';
import { UserRoutes } from './user.routes';
import { RatesRoutes } from './rates.routes';

const transactionsRouter = new TransactionRoutes().router;
const userRouter = new UserRoutes().router;
const ratesRouter = new RatesRoutes().router;

export const setRoutes = (app: Application) => {
  app.use(userRouter);
  app.use(transactionsRouter);
  app.use(ratesRouter);
};

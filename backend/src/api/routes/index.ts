import express, { Router } from 'express';
import passport from 'passport';
import cors from 'cors';
import { TransactionRoutes } from './transaction.routes';
import { UserRoutes } from './user.routes';
import { RatesRoutes } from './rates.routes';
import errorManager from '../middleware/errorManager';
export { graphqlRouter } from '../../graphql';

const transactionsRouter = new TransactionRoutes().router;
const userRouter = new UserRoutes().router;
const ratesRouter = new RatesRoutes().router;

export const apiRouter = Router();

apiRouter.use(cors());
apiRouter.use(express.json());
apiRouter.use(passport.initialize());

apiRouter.use(userRouter);
apiRouter.use(transactionsRouter);
apiRouter.use(ratesRouter);

apiRouter.use(errorManager);

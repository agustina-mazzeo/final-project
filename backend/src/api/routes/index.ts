import { TransactionsRoutes } from './transactions.routes';
import { UserRoutes } from './user.routes';
import { RatesRoutes } from './rates.routes';

export const transactionsRouter = new TransactionsRoutes().router;
export const userRouter = new UserRoutes().router;
export const ratesRouter = new RatesRoutes().router;

import { TransactionsRoutes } from './transactions.routes';
import UserRoutes from './user.routes';

export const transactionsRouter = new TransactionsRoutes().router;
export const userRouter = new UserRoutes().router;

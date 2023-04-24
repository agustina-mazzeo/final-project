import { Router } from 'express';
import validateRequest from '../middleware/validateRequest';
import { TransactionsController } from '../transactions/transactions.controller';
import { transactionsSchema, transferSchema } from '../transactions/transactions.schema';
import { transactionsService } from '../../services/transactions.service';
import { authJwt } from '../middleware/authPassport';

export class TransactionsRoutes {
  public path = '/transactions';
  public pathTransfer = '/transfer';
  public router = Router();
  public transactionsController = new TransactionsController(transactionsService);

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes = () => {
    // this.router.use(authJwt);
    this.router.get(`${this.path}`, authJwt, validateRequest(transactionsSchema), this.transactionsController.getTransactions);
    this.router.post(`${this.pathTransfer}`, authJwt, validateRequest(transferSchema), this.transactionsController.createTransfer);
  };
}

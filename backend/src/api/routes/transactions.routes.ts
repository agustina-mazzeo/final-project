import { Router } from 'express';
import validateRequest from '../middleware/validateRequest';
import { TransactionsController } from '../transactions/transactions.controller';
import { transactionsSchema, transferSchema } from '../transactions/transactions.schema';
import { TransactionsService } from '../../services/transactions.service';
import { TransactionsRepository } from '../../repositories/transactions.repository';
import { authJwt } from '../middleware/authPassport';

export class TransactionsRoutes {
  public path = '/transactions';
  public pathTransfer = '/transfer';
  public router = Router();
  public transactionsController = new TransactionsController(new TransactionsService(new TransactionsRepository()));

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use(authJwt);
    this.router.get(`${this.path}`, validateRequest(transactionsSchema), this.transactionsController.getTransactions);
    this.router.post(`${this.pathTransfer}`, validateRequest(transferSchema), this.transactionsController.createTransfer);
  }
}

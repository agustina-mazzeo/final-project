import { Router } from 'express';
import validateRequest from '../middleware/validateRequest';
import { TransactionsController } from '../transactions/transactions.controller';
import { transactionsSchema, transferSchema } from '../transactions/transactions.schema';
import { TransactionsService } from '../../services/transactions.service';
import { TxnsRepository } from '../../repositories/transactions.repository';
export class TransactionsRoutes {
  public pathTransacions = '/transactions';
  public pathTransfer = '/transfer';
  public router = Router();
  public tcontroller = new TransactionsController(new TransactionsService(new TxnsRepository()));

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.pathTransacions}`, validateRequest(transactionsSchema), this.tcontroller.getTransactions);
    this.router.post(`${this.pathTransfer}`, validateRequest(transferSchema), this.tcontroller.createTransfer);
  }
}

import { Router } from 'express';
import { TransactionsController } from '../transactions/transactions.controller';
import { TransactionService } from '../../services/transaction.service';
import { TransactionRepository } from '../../repositories/transaction.repository';
import validateRequest from '../middleware/validateRequest';
import { transactionsSchema, transferSchema } from '../transactions/transactions.schema';
import { authJwt } from '../middleware/authPassport';
import { AccountService } from '../../services/account.service';
import { AccountRepository } from '../../repositories/account.repository';
import { UserRepository } from '../../repositories/user.repository';
import { RateService } from '../../services/rate.service';
import { RateRepository } from '../../repositories/rate.repository';

const rateService = new RateService(new RateRepository());
const accountsService = new AccountService(new AccountRepository(), new UserRepository(), rateService);
const transactionsService = new TransactionService(new TransactionRepository(), accountsService);

export class TransactionRoutes {
  private path = '/transactions';
  private pathTransfer = '/transfer';
  public router = Router();
  public transactionsController = new TransactionsController(transactionsService);

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes = () => {
    this.router.use(this.path, authJwt);
    this.router.use(this.pathTransfer, authJwt);
    this.router.get(`${this.path}`, validateRequest(transactionsSchema), this.transactionsController.getTransactions);
    this.router.post(`${this.pathTransfer}`, validateRequest(transferSchema), this.transactionsController.createTransfer);
  };
}

import { Router } from 'express';
import validateRequest from '../middleware/validateRequest';
import { authJwt } from '../middleware/authPassport';
import { TransactionsController } from '../transactions/transactions.controller';
import { transactionsSchema, transferSchema } from '../transactions/transactions.schema';
import { AccountReadService, AccountWriteService, RateReadService, TransactionReadService, TransactionWriteService } from '../../services';
import {
  AccountReadRepository,
  AccountWriteRepository,
  RateReadRepository,
  TransactionReadRepository,
  TransactionWriteRepository,
  UserReadRepository,
} from '../../repositories';

const transactionReadRepository = new TransactionReadRepository();
const transactionWriteRepository = new TransactionWriteRepository();
const userReadRepository = new UserReadRepository();
const accountReadRepository = new AccountReadRepository();
const accountWriteRepository = new AccountWriteRepository();
const rateReadRepository = new RateReadRepository();
const rateReadService = new RateReadService(rateReadRepository);
const accountReadService = new AccountReadService(accountReadRepository);
const accountWriteService = new AccountWriteService(accountReadService, accountWriteRepository, userReadRepository, rateReadService);
const transactionReadService = new TransactionReadService(transactionReadRepository, accountReadService);
const transactionWriteService = new TransactionWriteService(transactionWriteRepository, accountWriteService, accountReadService);

export class TransactionRoutes {
  private path = '/transactions';
  private pathTransfer = '/transfer';
  public router = Router();
  public transactionsController = new TransactionsController(transactionReadService, transactionWriteService);

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

import { Router } from 'express';
import validateRequest from '../middleware/validateRequest';
import { authJwt } from '../middleware/authPassport';
import { authorize } from '../middleware/authRoles';
import { TransactionsController } from '../transactions/transactions.controller';
import { transactionsSchema, transferSchema } from '../transactions/transactions.schema';
import { AccountReadService, AccountWriteService, RateWriteService, TransactionReadService, TransactionWriteService } from '../../services';
import {
  AccountReadRepository,
  AccountWriteRepository,
  RateWriteRepository,
  TransactionReadRepository,
  TransactionWriteRepository,
  UserReadRepository,
} from '../../repositories';

const transactionReadRepository = new TransactionReadRepository();
const transactionWriteRepository = new TransactionWriteRepository();
const userReadRepository = new UserReadRepository();
const accountReadRepository = new AccountReadRepository();
const accountWriteRepository = new AccountWriteRepository();
const rateWriteRepository = new RateWriteRepository();
const rateWriteService = new RateWriteService(rateWriteRepository);
const accountReadService = new AccountReadService(accountReadRepository);
const accountWriteService = new AccountWriteService(accountWriteRepository, userReadRepository, rateWriteService);
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

    /**
     * @openapi
     * /transactions:
     *   get:
     *     summary: Gets filtered users transactions
     *     tags:
     *       - Transaction
     *     produces:
     *       - application/json
     *     parameters:
     *       - in: header
     *         name: Authorization
     *         description: Bearer Token.
     *         type: string
     *         required: true
     *       - in: query
     *         name: from
     *         description: starting date filter
     *         required: false
     *         schema:
     *           type: string
     *       - in: query
     *         name: to
     *         description: ending date filter
     *         required: false
     *         schema:
     *           type: string
     *       - in: query
     *         name: account_from
     *         description: account from filter
     *         required: false
     *         schema:
     *           type: number
     *     responses:
     *       200:
     *         description: User's filtered transactions
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/Transaction'
     *       400:
     *         description: Validation Error
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 errors:
     *                   type: string
     *       500:
     *         description: An error occurred
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 errors:
     *                   type: string
     *             example:
     *               errors: An error occurred while fetching user's transactions
     */
    this.router.get(this.path, validateRequest(transactionsSchema), this.transactionsController.getTransactions);

    /**
     * @openapi
     * /transfer:
     *   post:
     *     summary: Creates a new transaction
     *     tags:
     *       - Transaction
     *     produces:
     *       - application/json
     *     parameters:
     *       - in: header
     *         name: Authorization
     *         description: Bearer Token.
     *         type: string
     *         required: true
     *     responses:
     *       200:
     *         description: New Transfer object
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                    $ref: '#/components/schemas/Transfer'
     *       400:
     *         description: Validation Error
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 errors:
     *                   type: string
     *       500:
     *         description: An error occurred
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 errors:
     *                   type: string
     *             example:
     *               errors: An error occurred while creating the transaction
     */
    this.router.post(this.pathTransfer, validateRequest(transferSchema), this.transactionsController.createTransfer);

    this.router.get(`${this.path}/all`, authorize('ADMIN'), validateRequest(transactionsSchema), this.transactionsController.getTransactions);
  };
}

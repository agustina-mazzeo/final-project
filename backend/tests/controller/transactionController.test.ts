import should from 'should';
import sinon from 'sinon';
import { TransactionsController } from '../../src/api/transactions/transactions.controller';
import {
  AccountReadRepository,
  AccountWriteRepository,
  RateReadRepository,
  TransactionReadRepository,
  TransactionWriteRepository,
  UserReadRepository,
} from '../../src/repositories';
import { AccountReadService, AccountWriteService, RateReadService, TransactionReadService, TransactionWriteService } from '../../src/services';
import { TransactionOutputDTO } from '../../src/services/dtos';
import { ITransactionReadService, ITransactionWriteService } from '../../src/services/interfaces';

describe('TransactionController', () => {
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

  let transactionController: TransactionsController;
  let transactionReadServiceStub: sinon.SinonStubbedInstance<ITransactionReadService>;
  let transactionWriteServiceStub: sinon.SinonStubbedInstance<ITransactionWriteService>;
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    transactionReadServiceStub = sandbox.stub(transactionReadService as ITransactionReadService);
    transactionWriteServiceStub = sandbox.stub(transactionWriteService as ITransactionWriteService);
    transactionController = new TransactionsController(transactionReadServiceStub, transactionWriteServiceStub);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getTransactions', () => {
    it('should call transactionsService.getAll with correct parameters', async () => {
      const req = {
        user: 1,
        query: {},
      };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
      const next = sinon.spy();
      const expectedTransactions: TransactionOutputDTO[] = [
        { id: 1, account_from: 12345, account_to: 67890, amount: 100, createdAt: '2023-04-13T09:30:00.000Z', description: 'Transaction 1' },
        { id: 2, account_from: 67890, account_to: 12345, amount: 200, createdAt: '2023-04-12T14:45:00.000Z', description: 'Transaction 2' },
      ];

      const getAll = transactionReadServiceStub.getAll.resolves(expectedTransactions);

      await transactionController.getTransactions(req as any, res as any, next);

      // Assertions
      should(getAll.calledOnce).be.true();
      should(getAll.calledWith({ queryParams: req.query, userId: req.user })).be.true();
      should(res.status.calledOnce).be.true();
      should(res.status.calledWith(200)).be.true();
      should(res.json.calledOnce).be.true();
      should(res.json.calledWith({ data: expectedTransactions })).be.true();
      should(next.called).be.false();
    });

    it('should call next with error if transactionsService.getAll throws an error', async () => {
      const req = {
        user: 1,
        query: {},
      };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
      const next = sinon.spy();
      const expectedError = new Error('Test error');

      const getAll = transactionReadServiceStub.getAll.rejects(expectedError);

      await transactionController.getTransactions(req as any, res as any, next);

      // Assertions
      should(getAll.calledOnce).be.true();
      should(getAll.calledWith({ queryParams: req.query, userId: req.user })).be.true();
      should(res.status.called).be.false();
      should(res.json.called).be.false();
      should(next.calledOnce).be.true();
      should(next.calledWith(expectedError)).be.true();
    });
  });

  describe('createTransfer', () => {
    it('should call transactionsService.create with correct parameters', async () => {
      const req = {
        user: 1,
        body: {
          account_from: 1,
          account_to: 3,
          amount: 1,
          description: 'some description',
        },
      };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
      const next = sinon.spy();
      const expectedTransaction = {
        id: 0.6359607642103695,
        createdAt: new Date().toISOString(),
        account_from: 1,
        account_to: 3,
        amount: 1,
        description: 'some description',
      };

      const create = transactionWriteServiceStub.create.resolves(expectedTransaction);

      await transactionController.createTransfer(req as any, res as any, next);

      // Assertions
      should(create.calledOnce).be.true();
      should(create.calledWith({ transfer: req.body, userId: req.user })).be.true();
      should(res.status.calledOnce).be.true();
      should(res.status.calledWith(200)).be.true();
      should(res.json.calledOnce).be.true();
      should(res.json.calledWith({ data: expectedTransaction })).be.true();
      should(next.called).be.false();
    });

    it('should call next with error if transactionsService.create throws an error', async () => {
      const req = {
        user: 1,
        body: {
          account_from: 1,
          account_to: 3,
          amount: 1,
          description: 'some description',
        },
      };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
      const next = sinon.spy();
      const expectedError = new Error('Test error');

      const create = transactionWriteServiceStub.create.rejects(expectedError);

      await transactionController.createTransfer(req as any, res as any, next);

      // Assertions
      should(create.calledOnce).be.true();
      should(create.calledWith({ transfer: req.body, userId: req.user })).be.true();
      should(res.status.called).be.false();
      should(res.json.called).be.false();
      should(next.calledOnce).be.true();
      should(next.calledWith(expectedError)).be.true();
    });
  });
});

import should from 'should';
import sinon from 'sinon';
import { AccountService } from '../../src/services/account.service';
import { TransactionsController } from '../../src/api/transactions/transactions.controller';
import { Transaction } from '../../src/interfaces';
import { TransactionService } from '../../src/services/transaction.service';
import { AccountRepository } from '../../src/repositories/account.repository';
import { UserRepository } from '../../src/repositories/user.repository';
import { RateService } from '../../src/services/rate.service';
import { RateRepository } from '../../src/repositories/rate.repository';
import { TransactionRepository } from '../../src/repositories/transaction.repository';
import { IService } from '../../src/services/interfaces';

describe('TransactionController', () => {
  const rateService = new RateService(new RateRepository());
  const accountService = new AccountService(new AccountRepository(), new UserRepository(), rateService);
  const transactionService = new TransactionService(new TransactionRepository(), accountService);

  let transactionController: TransactionsController;
  let transactionServiceStub: sinon.SinonStubbedInstance<IService<Transaction>>;
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    transactionServiceStub = sandbox.stub(transactionService as IService<Transaction>);
    transactionController = new TransactionsController(transactionServiceStub);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getTransactions', () => {
    it('should call transactionsService.getAll with correct parameters', async () => {
      const req = {
        user: { id: 1 },
        query: {},
      };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
      const next = sinon.spy();
      const expectedTransactions: Transaction[] = [
        { id: 1, account_from: 12345, account_to: 67890, amount: 100, createdAt: '2023-04-13T09:30:00.000Z', description: 'Transaction 1' },
        { id: 2, account_from: 67890, account_to: 12345, amount: 200, createdAt: '2023-04-12T14:45:00.000Z', description: 'Transaction 2' },
      ];

      const getAll = transactionServiceStub.getAll.resolves(expectedTransactions);

      await transactionController.getTransactions(req as any, res as any, next);

      // Assertions
      should(getAll.calledOnce).be.true();
      should(getAll.calledWith(req.query, req.user.id)).be.true();
      should(res.status.calledOnce).be.true();
      should(res.status.calledWith(200)).be.true();
      should(res.json.calledOnce).be.true();
      should(res.json.calledWith({ data: expectedTransactions })).be.true();
      should(next.called).be.false();
    });

    it('should call next with error if transactionsService.getAll throws an error', async () => {
      const req = {
        user: { id: 1 },
        query: {},
      };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
      const next = sinon.spy();
      const expectedError = new Error('Test error');

      const getAll = transactionServiceStub.getAll.rejects(expectedError);

      await transactionController.getTransactions(req as any, res as any, next);

      // Assertions
      should(getAll.calledOnce).be.true();
      should(getAll.calledWith(req.query, req.user.id)).be.true();
      should(res.status.called).be.false();
      should(res.json.called).be.false();
      should(next.calledOnce).be.true();
      should(next.calledWith(expectedError)).be.true();
    });
  });

  describe('createTransfer', () => {
    it('should call transactionsService.create with correct parameters', async () => {
      const req = {
        user: { id: 1 },
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

      const create = transactionServiceStub.create.resolves(expectedTransaction);

      await transactionController.createTransfer(req as any, res as any, next);

      // Assertions
      should(create.calledOnce).be.true();
      should(create.calledWith(req.body, req.user.id)).be.true();
      should(res.status.calledOnce).be.true();
      should(res.status.calledWith(200)).be.true();
      should(res.json.calledOnce).be.true();
      should(res.json.calledWith({ data: expectedTransaction })).be.true();
      should(next.called).be.false();
    });

    it('should call next with error if transactionsService.create throws an error', async () => {
      const req = {
        user: { id: 1 },
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

      const create = transactionServiceStub.create.rejects(expectedError);

      await transactionController.createTransfer(req as any, res as any, next);

      // Assertions
      should(create.calledOnce).be.true();
      should(create.calledWith(req.body, req.user.id)).be.true();
      should(res.status.called).be.false();
      should(res.json.called).be.false();
      should(next.calledOnce).be.true();
      should(next.calledWith(expectedError)).be.true();
    });
  });
});

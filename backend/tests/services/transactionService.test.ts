import sinon from 'sinon';
import should from 'should';
import { TransactionRepository } from '../../src/repositories/transaction.repository';
import { UserRepository } from '../../src/repositories/user.repository';
import { AccountRepository } from '../../src/repositories/account.repository';
import { AccountService } from '../../src/services/account.service';
import { IAccountService, IService } from '../../src/services/interfaces';
import { ITransactionRepository } from '../../src/repositories/interfaces';
import { Account, CustomError, Transaction, Transfer } from '../../src/interfaces';
import { TransactionService } from '../../src/services/transaction.service';
import { RateService } from '../../src/services/rate.service';
import { RateRepository } from '../../src/repositories/rate.repository';

describe('TransactionService', () => {
  const transactionRepository = new TransactionRepository();
  const rateService = new RateService(new RateRepository());
  const accountService = new AccountService(new AccountRepository(), new UserRepository(), rateService);

  let transactionService: IService<Transaction>;
  let transactionRepositoryStub: sinon.SinonStubbedInstance<ITransactionRepository>;
  let accountServiceStub: sinon.SinonStubbedInstance<IAccountService>;
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    transactionRepositoryStub = sandbox.stub(transactionRepository as ITransactionRepository);
    accountServiceStub = sandbox.stub(accountService as IAccountService);
    transactionService = new TransactionService(transactionRepositoryStub, accountServiceStub);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getAll', () => {
    it('should return user transactions if valid user id is provided', async () => {
      const userAccounts = [{ id: 1 }, { id: 2 }];

      const usersTransactions: Transaction[] = [
        { id: 1, account_from: 1, account_to: 2, amount: 1, createdAt: new Date('2022-01-01').toISOString() },
      ];

      const getAll = accountServiceStub.getAll.withArgs(1).resolves(userAccounts as Account[]);
      const getUTRansactions = transactionRepositoryStub.getUsersTransactions.resolves(usersTransactions);

      const result = await transactionService.getAll({}, 1);

      should(result).be.an.Array();
      should(result).have.length(usersTransactions.length);
      should(result).containDeep(usersTransactions);
      should(getAll.calledOnceWith(1)).be.true();
      should(getUTRansactions.calledOnceWith([1, 2])).be.true();
    });

    it('should throw an error if invalid user id is provided', async () => {
      try {
        await transactionService.getAll({}, undefined);
        sinon.assert.fail();
      } catch (error: any) {
        should(error).be.an.instanceOf(CustomError);
        should(error.errorType).equal('VALIDATION_ERROR');
        should(error.messages).containDeep(["Couldn't get user's transactions"]);
      }
    });

    it('should throw an error if user has no accounts', async () => {
      const getAll = accountServiceStub.getAll.withArgs(1).resolves([]);

      try {
        await transactionService.getAll({}, 1);
        sinon.assert.fail();
      } catch (error: any) {
        should(error).be.an.instanceOf(CustomError);
        should(error.errorType).equal('NOT_FOUND_ERROR');
        should(error.messages).containDeep(["Couldn't get user's transactions"]);
        should(getAll.calledOnce).be.true();
      }
    });
  });

  describe('create', () => {
    it('should create a new transaction and return it', async () => {
      const userId = 1;
      const amount = 100;

      const transfer: Transfer = {
        account_from: 1,
        account_to: 2,
        amount,
      };
      const userAccounts: Account[] = [
        {
          id: 1,
          id_user: userId,
          balance: 1000,
          currency: 'USD',
        },
        {
          id: 2,
          id_user: userId,
          balance: 500,
          currency: 'EUR',
        },
      ];
      const account_from = userAccounts[0];
      const account_to = userAccounts[1];

      const newTransaction: Transaction = {
        id: 3,
        account_from: 1,
        account_to: 2,
        amount: 100,
        createdAt: new Date().toISOString(),
      };

      const getAll = accountServiceStub.getAll.resolves(userAccounts);
      const getByID = accountServiceStub.getByID.resolves(account_to); //may throw an error
      const updateAccounts = accountServiceStub.updateAccounts.resolves(undefined);
      const create = transactionRepositoryStub.create.resolves(newTransaction);

      const result = await transactionService.create(transfer, 1);

      should(getAll.calledWith(1)).be.true();
      should(getByID.calledWith(2)).be.true();
      should(updateAccounts.calledOnceWith(account_from, account_to, amount, userId)).be.true();
      should(create.calledOnceWith(transfer)).be.true();
      should(result).deepEqual(newTransaction);
    });

    it("should throw an error if user's account is not found", async () => {
      const userId = 1;
      const amount = 100;

      const transfer: Transfer = {
        account_from: 1,
        account_to: 2,
        amount,
      };

      const getAll = accountServiceStub.getAll.resolves([]);

      try {
        await transactionService.create(transfer, 1);
        sinon.assert.fail();
      } catch (error: any) {
        should(error).be.instanceOf(CustomError);
        should(error.errorType).be.eql('VALIDATION_ERROR');
        should(getAll.calledOnceWith(userId)).be.true();
        should(accountServiceStub.getByID.notCalled).be.true();
        should(accountServiceStub.updateAccounts.notCalled).be.true();
        should(transactionRepositoryStub.create.notCalled).be.true();
      }
    });

    it('should throw an error if acocunt_to is not found', async () => {
      const userId = 1;
      const amount = 100;

      const transfer: Transfer = {
        account_from: 1,
        account_to: 2,
        amount,
      };
      const userAccounts: Account[] = [
        {
          id: 1,
          id_user: userId,
          balance: 1000,
          currency: 'USD',
        },
        {
          id: 2,
          id_user: userId,
          balance: 500,
          currency: 'EUR',
        },
      ];
      const custom_error = new CustomError('VALIDATION_ERROR', ['Invalid account']);

      const getAll = accountServiceStub.getAll.resolves(userAccounts);
      const getByID = accountServiceStub.getByID.rejects(custom_error);

      try {
        await transactionService.create(transfer, 1);
        sinon.assert.fail();
      } catch (error: any) {
        should(error).be.instanceOf(CustomError);
        should(error.errorType).be.eql('VALIDATION_ERROR');
        should(getAll.calledOnceWith(userId)).be.true();
        should(getByID.calledWith(2)).be.true();
        should(accountServiceStub.updateAccounts.notCalled).be.true();
        should(transactionRepositoryStub.create.notCalled).be.true();
      }
    });

    it('should throw an error if updateAccounts throws', async () => {
      const userId = 1;
      const amount = 100;

      const transfer: Transfer = {
        account_from: 1,
        account_to: 2,
        amount,
      };
      const userAccounts: Account[] = [
        {
          id: 1,
          id_user: userId,
          balance: 1000,
          currency: 'USD',
        },
        {
          id: 2,
          id_user: userId,
          balance: 500,
          currency: 'EUR',
        },
      ];
      const account_to = userAccounts[1];
      const custom_error = new CustomError('VALIDATION_ERROR', ['Insufficient funds']);

      const getAll = accountServiceStub.getAll.resolves(userAccounts);
      const getByID = accountServiceStub.getByID.resolves(account_to);
      const updateAccounts = accountServiceStub.updateAccounts.rejects(custom_error);

      try {
        await transactionService.create(transfer, 1);
        sinon.assert.fail();
      } catch (error: any) {
        should(error).be.instanceOf(CustomError);
        should(error.errorType).be.eql('VALIDATION_ERROR');
        should(getAll.calledOnceWith(userId)).be.true();
        should(getByID.calledWith(2)).be.true();
        should(updateAccounts.called).be.true();
        should(transactionRepositoryStub.create.notCalled).be.true();
      }
    });
  });

  describe('update', () => {
    it('should throw a CustomError with forbidden error', async () => {
      try {
        await transactionService.update();
        sinon.assert.fail();
      } catch (error: any) {
        should(error).be.instanceOf(CustomError);
        should(error.errorType).be.eql('FORBIDDEN_ERROR');
      }
    });
  });

  describe('getByID', () => {
    it('should throw a CustomError with forbidden error', async () => {
      try {
        await transactionService.getByID();
        sinon.assert.fail();
      } catch (error: any) {
        should(error).be.instanceOf(CustomError);
        should(error.errorType).be.eql('FORBIDDEN_ERROR');
      }
    });
  });
});

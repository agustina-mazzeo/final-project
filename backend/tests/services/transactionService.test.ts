import sinon from 'sinon';
import should from 'should';
import { CustomError } from '../../src/interfaces';
import { AccountReadService, AccountWriteService, RateReadService, TransactionReadService, TransactionWriteService } from '../../src/services';
import { ITransactionReadRepository, ITransactionWriteRepository } from '../../src/repositories/interfaces';
import { IAccountReadService, IAccountWriteService, ITransactionReadService, ITransactionWriteService } from '../../src/services/interfaces';
import {
  AccountReadRepository,
  AccountWriteRepository,
  RateReadRepository,
  TransactionReadRepository,
  TransactionWriteRepository,
  UserReadRepository,
} from '../../src/repositories';
import { AccountOutputDTO, TransactionInputDTO, TransactionOutputDTO } from '../../src/services/data-transfer-objects';

describe('TransactionService', () => {
  const rateReadService = new RateReadService(new RateReadRepository());
  const transactionReadRepository = new TransactionReadRepository();
  const transactionWriteRepository = new TransactionWriteRepository();
  const accountReadService = new AccountReadService(new AccountReadRepository());
  const accountWriteService = new AccountWriteService(accountReadService, new AccountWriteRepository(), new UserReadRepository(), rateReadService);

  let transactionReadRepositoryStub: sinon.SinonStubbedInstance<ITransactionReadRepository>;
  let transactionWriteRepositoryStub: sinon.SinonStubbedInstance<ITransactionWriteRepository>;
  let accountReadServiceStub: sinon.SinonStubbedInstance<IAccountReadService>;
  let accountWriteServiceStub: sinon.SinonStubbedInstance<IAccountWriteService>;
  let transactionReadService: ITransactionReadService;
  let transactionWriteService: ITransactionWriteService;
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    transactionReadRepositoryStub = sandbox.stub(transactionReadRepository as ITransactionReadRepository);
    transactionWriteRepositoryStub = sandbox.stub(transactionWriteRepository as ITransactionWriteRepository);
    accountReadServiceStub = sandbox.stub(accountReadService as IAccountReadService);
    accountWriteServiceStub = sandbox.stub(accountWriteService as IAccountWriteService);
    transactionReadService = new TransactionReadService(transactionReadRepositoryStub, accountReadServiceStub);
    transactionWriteService = new TransactionWriteService(transactionWriteRepositoryStub, accountWriteServiceStub, accountReadServiceStub);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getAll', () => {
    it('should return user transactions if valid user id is provided', async () => {
      const userAccounts = [{ id: 1 }, { id: 2 }];

      const usersTransactions: TransactionOutputDTO[] = [
        { id: 1, account_from: 1, account_to: 2, amount: 1, createdAt: new Date('2022-01-01').toISOString() },
      ];

      const getAll = accountReadServiceStub.getAll.withArgs(1).resolves(userAccounts as AccountOutputDTO[]);
      const getUTRansactions = transactionReadRepositoryStub.getUsersTransactions.resolves(usersTransactions);

      const result = await transactionReadService.getAll({ userId: 1, queryParams: {} });

      should(result).be.an.Array();
      should(result).have.length(usersTransactions.length);
      should(result).containDeep(usersTransactions);
      should(getAll.calledOnceWith(1)).be.true();
      should(getUTRansactions.calledOnceWith([1, 2])).be.true();
    });

    it('should throw an error if user has no accounts', async () => {
      const getAll = accountReadServiceStub.getAll.withArgs(1).resolves([]);

      try {
        await transactionReadService.getAll({ queryParams: {}, userId: 1 });
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

      const transfer: TransactionInputDTO['transfer'] = {
        account_from: 1,
        account_to: 2,
        amount,
      };
      const userAccounts: AccountOutputDTO[] = [
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

      const newTransaction: TransactionOutputDTO = {
        id: 3,
        account_from: 1,
        account_to: 2,
        amount: 100,
        createdAt: new Date().toISOString(),
      };

      const getAll = accountReadServiceStub.getAll.resolves(userAccounts);
      const getByID = accountReadServiceStub.getByID.resolves(account_to); //may throw an error
      const updateAccounts = accountWriteServiceStub.updateAccounts.resolves(undefined);
      const create = transactionWriteRepositoryStub.create.resolves(newTransaction);

      const result = await transactionWriteService.create({ transfer, userId: 1 });

      should(getAll.calledWith(1)).be.true();
      should(getByID.calledWith(2)).be.true();
      should(updateAccounts.calledOnceWith(account_from, account_to, amount, userId)).be.true();
      should(create.calledOnceWith(transfer)).be.true();
      should(result).deepEqual(newTransaction);
    });

    it("should throw an error if user's account is not found", async () => {
      const userId = 1;
      const amount = 100;

      const transfer: TransactionInputDTO['transfer'] = {
        account_from: 1,
        account_to: 2,
        amount,
      };

      const getAll = accountReadServiceStub.getAll.resolves([]);

      try {
        await transactionWriteService.create({ transfer, userId: 1 });
        sinon.assert.fail();
      } catch (error: any) {
        should(error).be.instanceOf(CustomError);
        should(error.errorType).be.eql('VALIDATION_ERROR');
        should(getAll.calledOnceWith(userId)).be.true();
        should(accountReadServiceStub.getByID.notCalled).be.true();
        should(accountWriteServiceStub.updateAccounts.notCalled).be.true();
        should(transactionWriteRepositoryStub.create.notCalled).be.true();
      }
    });

    it('should throw an error if acocunt_to is not found', async () => {
      const userId = 1;
      const amount = 100;

      const transfer: TransactionInputDTO['transfer'] = {
        account_from: 1,
        account_to: 2,
        amount,
      };
      const userAccounts: AccountOutputDTO[] = [
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

      const getAll = accountReadServiceStub.getAll.resolves(userAccounts);
      const getByID = accountReadServiceStub.getByID.rejects(custom_error);

      try {
        await transactionWriteService.create({ transfer, userId: 1 });
        sinon.assert.fail();
      } catch (error: any) {
        should(error).be.instanceOf(CustomError);
        should(error.errorType).be.eql('VALIDATION_ERROR');
        should(getAll.calledOnceWith(userId)).be.true();
        should(getByID.calledWith(2)).be.true();
        should(accountWriteServiceStub.updateAccounts.notCalled).be.true();
        should(transactionWriteRepositoryStub.create.notCalled).be.true();
      }
    });

    it('should throw an error if updateAccounts throws', async () => {
      const userId = 1;
      const amount = 100;

      const transfer: TransactionInputDTO['transfer'] = {
        account_from: 1,
        account_to: 2,
        amount,
      };
      const userAccounts: AccountOutputDTO[] = [
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

      const getAll = accountReadServiceStub.getAll.resolves(userAccounts);
      const getByID = accountReadServiceStub.getByID.resolves(account_to);
      const updateAccounts = accountWriteServiceStub.updateAccounts.rejects(custom_error);

      try {
        await transactionWriteService.create({ transfer, userId: 1 });
        sinon.assert.fail();
      } catch (error: any) {
        should(error).be.instanceOf(CustomError);
        should(error.errorType).be.eql('VALIDATION_ERROR');
        should(getAll.calledOnceWith(userId)).be.true();
        should(getByID.calledWith(2)).be.true();
        should(updateAccounts.called).be.true();
        should(transactionWriteRepositoryStub.create.notCalled).be.true();
      }
    });
  });

  describe('update', () => {
    it('should throw a CustomError with forbidden error', async () => {
      try {
        await transactionWriteService.update();
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
        await transactionReadService.getByID();
        sinon.assert.fail();
      } catch (error: any) {
        should(error).be.instanceOf(CustomError);
        should(error.errorType).be.eql('FORBIDDEN_ERROR');
      }
    });
  });
});

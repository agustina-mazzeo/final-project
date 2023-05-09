import sinon from 'sinon';
import should from 'should';
import { CustomError } from '../../src/interfaces';
import { IAccountReadService, IAccountWriteService, IRateReadService } from '../../src/services/interfaces';
import { IAccountReadRepository, IAccountWriteRepository, IUserReadRepository } from '../../src/repositories/interfaces';
import { AccountReadRepository } from '../../src/repositories/account.read.repository';
import { AccountReadService, AccountWriteService, RateReadService } from '../../src/services';
import { AccountWriteRepository, RateReadRepository, UserReadRepository } from '../../src/repositories';
import { AccountOutputDTO, UserOutputDTO } from '../../src/services/dtos';
import { AccountModelDTO } from 'repositories/dtos';

describe('AccountService', () => {
  const accountReadRepository = new AccountReadRepository();
  const accountWriteRepository = new AccountWriteRepository();
  const userReadRepository = new UserReadRepository();
  const rateReadService = new RateReadService(new RateReadRepository());

  let accountReadRepositoryStub: sinon.SinonStubbedInstance<IAccountReadRepository>;
  let accountWriteRepositoryStub: sinon.SinonStubbedInstance<IAccountWriteRepository>;
  let userReadRepositoryStub: sinon.SinonStubbedInstance<IUserReadRepository>;
  let rateReadServiceStub: sinon.SinonStubbedInstance<IRateReadService>;
  let accountReadService: IAccountReadService;
  let accountWriteService: IAccountWriteService;
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    accountReadRepositoryStub = sandbox.stub(accountReadRepository as IAccountReadRepository);
    accountWriteRepositoryStub = sandbox.stub(accountWriteRepository as IAccountWriteRepository);
    userReadRepositoryStub = sandbox.stub(userReadRepository as IUserReadRepository);
    rateReadServiceStub = sandbox.stub(rateReadService as IRateReadService);
    accountReadService = new AccountReadService(accountReadRepositoryStub);
    accountWriteService = new AccountWriteService(accountReadService, accountWriteRepositoryStub, userReadRepositoryStub, rateReadServiceStub);
  });
  afterEach(() => {
    sandbox.restore();
  });

  describe('create', () => {
    it('should call create method in accountsRepository with correct arguments', async () => {
      const user_id = '1';
      const currency = 'USD';
      const user: UserOutputDTO = {
        id: user_id,
        email: 'someemail',
        password: 'somepass',
      };

      const getById = userReadRepositoryStub.getByID.resolves(user);

      const newAccount: AccountOutputDTO = {
        id: Math.random(),
        user_id,
        currency,
        balance: 0,
      };
      const create = accountWriteRepositoryStub.create.resolves(newAccount);

      const createdAccount = await accountWriteService.create({ currency, user_id });

      should.exist(createdAccount);
      should(createdAccount).deepEqual(newAccount);
      should(create.calledOnceWithExactly({ user_id, currency })).be.true();
      should(getById.calledOnceWithExactly(user_id)).be.true();
    });

    it('should throw an error when invalid userId is provided', async () => {
      const userId = '1';
      const currency = 'USD';
      const getById = userReadRepositoryStub.getByID.resolves(undefined);

      try {
        await accountWriteService.create({ currency, user_id: userId });
        sinon.assert.fail();
      } catch (error: any) {
        should.exist(error);
        should(error).be.instanceOf(CustomError);
        should(error.errorType).be.eql('VALIDATION_ERROR');
        should(getById.calledOnceWithExactly(userId)).be.true();
        should(accountWriteRepositoryStub.create.notCalled).be.true();
      }
    });
  });

  describe('createUsersAccounts', () => {
    it('should create accounts for all currencies for a user', async () => {
      const userId = '1';
      const account: AccountOutputDTO = {
        id: 1,
        user_id: userId,
        currency: 'UYU',
        balance: 13,
      };
      const user: UserOutputDTO = { id: userId, email: 'test@example.com', password: 'password' };

      const getByID = userReadRepositoryStub.getByID.resolves(user);
      const create = accountWriteRepositoryStub.create.resolves(account);

      await accountWriteService.createUsersAccounts(userId);

      should(getByID.called).be.true();
      should(create.called).be.true();
    });

    it('should throw an error when the user is not found', async () => {
      const userId = '1';
      const getByID = userReadRepositoryStub.getByID.resolves(undefined);
      try {
        await accountWriteService.createUsersAccounts(userId);
        sinon.assert.fail();
      } catch (error: any) {
        should(error).be.instanceOf(CustomError);
        should(error.errorType).be.eql('VALIDATION_ERROR');
        should(getByID.calledOnceWithExactly(userId)).be.true();
      }
    });
  });

  describe('getAll', () => {
    it('should return an array of accounts', async () => {
      const accounts: AccountOutputDTO[] = [
        {
          id: 1,
          user_id: '0.5069248488856752',
          currency: 'UYU',
          balance: 13,
        },
        {
          id: 2,
          user_id: '0.5069248488856752',
          currency: 'USD',
          balance: 76,
        },
        {
          id: 3,
          user_id: '0.5069248488856752',
          currency: 'EUR',
          balance: 83.02335801106693,
        },
      ];

      const getAll = accountReadRepositoryStub.getAll.resolves(accounts);

      const result = await accountReadService.getAll();

      should(result).be.eql(accounts);
      should(getAll.calledOnce).be.true();
    });
  });

  describe('getByID', () => {
    it('should return the account that matches the id', async () => {
      const id = 1;
      const account: AccountOutputDTO = {
        id,
        user_id: '0.5069248488856752',
        currency: 'UYU',
        balance: 13,
      };

      const getByID = accountReadRepositoryStub.getByID.resolves(account);

      const result = await accountReadService.getByID(id);

      //Assertions
      should(result).be.eql(account);
      should(getByID.calledOnce).be.true();
    });

    it('should throw CustomError with validation error if no user matches the id', async () => {
      const id = 1;
      const getByID = accountReadRepositoryStub.getByID.resolves(undefined);

      try {
        await accountReadService.getByID(id);
        sinon.assert.fail();
      } catch (error: any) {
        should(error).be.instanceOf(CustomError);
        should(error.errorType).be.eql('VALIDATION_ERROR');
        should(getByID.calledOnce).be.true();
      }
    });
  });

  describe('update', () => {
    it('should update and return the updated account', async () => {
      const account: AccountOutputDTO = {
        id: 1,
        user_id: '0.5069248488856752',
        currency: 'UYU',
        balance: 13,
      };

      const update = accountWriteRepositoryStub.update.resolves(account);

      const result = await accountWriteService.update(account);

      should(update.calledWith(account)).be.true();
      should(result).deepEqual(account);
    });
  });

  describe('updateAccounts', () => {
    it('should return the updates accounts from the same user', async () => {
      const userId = '1';
      const amount = 1;
      const account_from_id = 2;
      const account_to_id = 3;
      const account_from: AccountOutputDTO = {
        id: account_from_id,
        user_id: userId,
        currency: 'UYU',
        balance: 10,
      };
      const account_to: AccountOutputDTO = {
        id: account_to_id,
        user_id: userId,
        currency: 'USD',
        balance: 10,
      };
      const account_from_updated_balance = 9;
      const account_to_updated_balance = 10.5;
      const account_from_updated: AccountOutputDTO = {
        id: account_from_id,
        user_id: userId,
        currency: 'UYU',
        balance: account_from_updated_balance,
      };
      const account_to_updated: AccountOutputDTO = {
        id: account_to_id,
        user_id: userId,
        currency: 'USD',
        balance: account_to_updated_balance,
      };
      const getByID = accountReadRepositoryStub.getByID;
      getByID.withArgs(account_from_id).resolves({ currency: 'UYU' } as AccountModelDTO);
      getByID.withArgs(account_to_id).resolves({ currency: 'USD' } as AccountModelDTO);
      const getMultiplier = rateReadServiceStub.getMultiplier.resolves(0.5);
      const update = accountWriteRepositoryStub.update;
      update.withArgs({ id: account_from_id, balance: account_from_updated_balance }).resolves(account_from_updated);
      update.withArgs({ id: account_to_id, balance: account_to_updated_balance }).resolves(account_to_updated);

      const result = await accountWriteService.updateAccounts(account_from, account_to, amount, userId);
      //Assertions
      should(getMultiplier.calledOnce).be.true();
      should(update.calledTwice).be.true();
      should(update.calledWith(account_from_updated));
      should(update.calledWith(account_from_updated));
      should(result.account_to).deepEqual(account_to_updated);
      should(result.account_from).deepEqual(account_from_updated);
    });

    it('should return the updates accounts from different users', async () => {
      const userId = '1';
      const amount = 1;
      const account_from: AccountOutputDTO = {
        id: 2,
        user_id: userId,
        currency: 'UYU',
        balance: 10,
      };
      const account_to: AccountOutputDTO = {
        id: 3,
        user_id: '4',
        currency: 'USD',
        balance: 10,
      };
      const account_from_updated: AccountOutputDTO = {
        id: 2,
        user_id: userId,
        currency: 'UYU',
        balance: 8.99,
      };
      const account_to_updated: AccountOutputDTO = {
        id: 3,
        user_id: '4',
        currency: 'USD',
        balance: 10.5,
      };
      const getByID = accountReadRepositoryStub.getByID;
      getByID.withArgs(account_from.id).resolves({ currency: 'UYU' } as AccountOutputDTO);
      getByID.withArgs(account_to.id).resolves({ currency: 'USD' } as AccountOutputDTO);
      const getMultiplier = rateReadServiceStub.getMultiplier.resolves(0.5);
      const update = accountWriteRepositoryStub.update;
      update.withArgs({ id: account_from.id, balance: account_from_updated.balance }).resolves(account_from_updated);
      update.withArgs({ id: account_to.id, balance: account_to_updated.balance }).resolves(account_to_updated);

      const result = await accountWriteService.updateAccounts(account_from, account_to, amount, userId);

      //Assertions
      should(getMultiplier.calledOnce).be.true();
      should(update.calledTwice).be.true();
      should(update.calledWith(account_from_updated));
      should(update.calledWith(account_from_updated));
      should(result.account_from.user_id).not.be.equal(result.account_to.user_id);
      should(result.account_to).deepEqual(account_to_updated);
      should(result.account_from).deepEqual(account_from_updated);
    });

    it('should throw an error if the account does not have sufficient funds', async () => {
      const userId = '1';
      const amount = 10;
      const account_from: AccountOutputDTO = {
        id: 2,
        user_id: userId,
        currency: 'UYU',
        balance: 10,
      };
      const account_to: AccountOutputDTO = {
        id: 3,
        user_id: '4',
        currency: 'USD',
        balance: 10,
      };

      try {
        await accountWriteService.updateAccounts(account_from, account_to, amount, userId);
        sinon.assert.fail();
      } catch (error: any) {
        should(error).be.instanceOf(CustomError);
        should(error.errorType).be.eql('VALIDATION_ERROR');
        should(error.messages).be.eql(['Insufficient funds']);
        should(rateReadServiceStub.getMultiplier.notCalled).be.true();
        should(accountWriteRepositoryStub.update.notCalled).be.true();
      }
    });
  });
});

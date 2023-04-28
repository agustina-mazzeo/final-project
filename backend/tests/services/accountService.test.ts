import sinon from 'sinon';
import should from 'should';
import { Account, CustomError, User } from '../../src/interfaces';
import { IAccountService, IRateService } from '../../src/services/interfaces';
import { AccountService } from '../../src/services/account.service';
import { RateService } from '../../src/services/rate.service';
import { IUserRepository, IRepository } from '../../src/repositories/interfaces';
import { AccountRepository } from '../../src/repositories/account.repository';
import { UserRepository } from '../../src/repositories/user.repository';
import { RateRepository } from '../../src/repositories/rate.repository';

describe('AccountService', () => {
  const accountRepository = new AccountRepository();
  const userRepository = new UserRepository();
  const rateService = new RateService(new RateRepository());

  let accountService: IAccountService;
  let accountRepositoryStub: sinon.SinonStubbedInstance<IRepository<Account>>;
  let userRepositoryStub: sinon.SinonStubbedInstance<IUserRepository>;
  let rateServiceStub: sinon.SinonStubbedInstance<IRateService>;
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    accountRepositoryStub = sandbox.stub(accountRepository as IRepository<Account>);
    userRepositoryStub = sandbox.stub(userRepository as IUserRepository);
    rateServiceStub = sandbox.stub(rateService as IRateService);
    accountService = new AccountService(accountRepositoryStub, userRepositoryStub, rateServiceStub);
  });
  afterEach(() => {
    sandbox.restore();
  });

  describe('create', () => {
    it('should call create method in accountsRepository with correct arguments', async () => {
      const userId = 1;
      const currency = 'USD';
      const user: User = {
        id: userId,
        email: 'someemail',
        password: 'somepass',
      };

      const getById = userRepositoryStub.getByID.resolves(user);

      const newAccount: Account = {
        id: Math.random(),
        id_user: userId,
        currency,
        balance: 0,
      };
      const create = accountRepositoryStub.create.resolves(newAccount);

      const createdAccount = await accountService.create(currency, userId);

      should.exist(createdAccount);
      should(createdAccount).deepEqual(newAccount);
      should(create.calledOnceWithExactly({ userId, currency })).be.true();
      should(getById.calledOnceWithExactly(userId)).be.true();
    });

    it('should throw an error when invalid userId is provided', async () => {
      const userId = 1;
      const currency = 'USD';
      const getById = userRepositoryStub.getByID.resolves(undefined);

      try {
        await accountService.create(currency, userId);
        sinon.assert.fail();
      } catch (error: any) {
        should.exist(error);
        should(error).be.instanceOf(CustomError);
        should(error.errorType).be.eql('VALIDATION_ERROR');
        should(getById.calledOnceWithExactly(userId)).be.true();
        should(accountRepositoryStub.create.notCalled).be.true();
      }
    });
  });

  describe('createUsersAccounts', () => {
    it('should create accounts for all currencies for a user', async () => {
      const userId = 1;
      const account: Account = {
        id: 1,
        id_user: userId,
        currency: 'UYU',
        balance: 13,
      };
      const user: User = { id: userId, email: 'test@example.com', password: 'password' };

      const getByID = userRepositoryStub.getByID.resolves(user);
      const create = accountRepositoryStub.create.resolves(account);

      await accountService.createUsersAccounts(userId);

      should(getByID.called).be.true();
      should(create.called).be.true();
    });

    it('should throw an error when the user is not found', async () => {
      const userId = 1;
      const getByID = userRepositoryStub.getByID.resolves(undefined);
      try {
        await accountService.createUsersAccounts(userId);
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
      const accounts: Account[] = [
        {
          id: 1,
          id_user: 0.5069248488856752,
          currency: 'UYU',
          balance: 13,
        },
        {
          id: 2,
          id_user: 0.5069248488856752,
          currency: 'USD',
          balance: 76,
        },
        {
          id: 3,
          id_user: 0.5069248488856752,
          currency: 'EUR',
          balance: 83.02335801106693,
        },
      ];

      const getAll = accountRepositoryStub.getAll.resolves(accounts);

      const result = await accountService.getAll();

      should(result).be.eql(accounts);
      should(getAll.calledOnce).be.true();
    });
  });

  describe('getByID', () => {
    it('should return the account that matches the id', async () => {
      const id = 1;
      const account: Account = {
        id,
        id_user: 0.5069248488856752,
        currency: 'UYU',
        balance: 13,
      };

      const getByID = accountRepositoryStub.getByID.resolves(account);

      const result = await accountService.getByID(id);

      //Assertions
      should(result).be.eql(account);
      should(getByID.calledOnce).be.true();
    });

    it('should throw CustomError with validation error if no user matches the id', async () => {
      const id = 1;
      const getByID = accountRepositoryStub.getByID.resolves(undefined);

      try {
        await accountService.getByID(id);
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
      const account: Account = {
        id: 1,
        id_user: 0.5069248488856752,
        currency: 'UYU',
        balance: 13,
      };

      const update = accountRepositoryStub.update.resolves(account);

      const result = await accountService.update(account);

      should(update.calledWith(account)).be.true();
      should(result).deepEqual(account);
    });
  });

  describe('updateAccounts', () => {
    it('should return the updates accounts from the same user', async () => {
      const userId = 1;
      const amount = 1;
      const account_from: Account = {
        id: 2,
        id_user: userId,
        currency: 'UYU',
        balance: 10,
      };
      const account_to: Account = {
        id: 3,
        id_user: userId,
        currency: 'USD',
        balance: 10,
      };
      const account_from_updated: Account = {
        id: 2,
        id_user: userId,
        currency: 'UYU',
        balance: 9,
      };
      const account_to_updated: Account = {
        id: 3,
        id_user: userId,
        currency: 'USD',
        balance: 10.5,
      };
      const getMultiplier = rateServiceStub.getMultiplier.resolves(0.5);
      const update = accountRepositoryStub.update;
      update.withArgs(account_from_updated).resolves(account_from_updated);
      update.withArgs(account_to_updated).resolves(account_to_updated);

      const result = await accountService.updateAccounts(account_from, account_to, amount, userId);

      //Assertions
      should(getMultiplier.calledOnce).be.true();
      should(update.calledTwice).be.true();
      should(update.calledWith(account_from_updated));
      should(update.calledWith(account_from_updated));
      should(result.account_to).deepEqual(account_to_updated);
      should(result.account_from).deepEqual(account_from_updated);
    });

    it('should return the updates accounts from different users', async () => {
      const userId = 1;
      const amount = 1;
      const account_from: Account = {
        id: 2,
        id_user: userId,
        currency: 'UYU',
        balance: 10,
      };
      const account_to: Account = {
        id: 3,
        id_user: 4,
        currency: 'USD',
        balance: 10,
      };
      const account_from_updated: Account = {
        id: 2,
        id_user: userId,
        currency: 'UYU',
        balance: 8.99,
      };
      const account_to_updated: Account = {
        id: 3,
        id_user: 4,
        currency: 'USD',
        balance: 10.5,
      };
      const getMultiplier = rateServiceStub.getMultiplier.resolves(0.5);
      const update = accountRepositoryStub.update;
      update.withArgs(account_from_updated).resolves(account_from_updated);
      update.withArgs(account_to_updated).resolves(account_to_updated);

      const result = await accountService.updateAccounts(account_from, account_to, amount, userId);

      //Assertions
      should(getMultiplier.calledOnce).be.true();
      should(update.calledTwice).be.true();
      should(update.calledWith(account_from_updated));
      should(update.calledWith(account_from_updated));
      should(result.account_from.id_user).not.be.equal(result.account_to.id_user);
      should(result.account_to).deepEqual(account_to_updated);
      should(result.account_from).deepEqual(account_from_updated);
    });

    it('should throw an error if the account does not have sufficient funds', async () => {
      const userId = 1;
      const amount = 10;
      const account_from: Account = {
        id: 2,
        id_user: userId,
        currency: 'UYU',
        balance: 10,
      };
      const account_to: Account = {
        id: 3,
        id_user: 4,
        currency: 'USD',
        balance: 10,
      };

      try {
        await accountService.updateAccounts(account_from, account_to, amount, userId);
        sinon.assert.fail();
      } catch (error: any) {
        should(error).be.instanceOf(CustomError);
        should(error.errorType).be.eql('VALIDATION_ERROR');
        should(rateServiceStub.getMultiplier.notCalled).be.true();
        should(accountRepositoryStub.update.notCalled).be.true();
      }
    });
  });
});

import sinon from 'sinon';
import should from 'should';
import { hash } from 'bcrypt';
import { CustomError, User, UserData } from '../../src/interfaces';
import { IAccountService, IUserService } from '../../src/services/interfaces';
import { UserService } from '../../src/services/user.service';
import { AccountService } from '../../src/services/account.service';
import { RateService } from '../../src/services/rate.service';
import { IUserRepository } from '../../src/repositories/interfaces';
import { UserRepository } from '../../src/repositories/user.repository';
import { AccountRepository } from '../../src/repositories/account.repository';
import { RateRepository } from '../../src/repositories/rate.repository';

describe('UserService', () => {
  const rateService = new RateService(new RateRepository());
  const userRepository = new UserRepository();
  const accountService = new AccountService(new AccountRepository(), userRepository, rateService);

  let userService: IUserService;
  let userRepositoryStub: sinon.SinonStubbedInstance<IUserRepository>;
  let accountServiceStub: sinon.SinonStubbedInstance<IAccountService>;
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    userRepositoryStub = sandbox.stub(userRepository as IUserRepository);
    accountServiceStub = sandbox.stub(accountService as IAccountService);
    userService = new UserService(userRepositoryStub, accountServiceStub);
  });
  afterEach(() => {
    sandbox.restore();
  });

  describe('getAll', () => {
    it('should return an array of users', async () => {
      const users: User[] = [
        { id: 1, email: 'test1@example.com', password: 'hashedPassword1' },
        { id: 2, email: 'test2@example.com', password: 'hashedPassword2' },
      ];

      const getAll = userRepositoryStub.getAll.resolves(users);

      const result = await userService.getAll();

      should(result).be.eql(users);
      should(getAll.calledOnce).be.true();
    });
  });

  describe('getByEmail', () => {
    it('should return the user that matches the email', async () => {
      const email = 'test@example.com';
      const user: User = { id: 1, email, password: 'hashedPassword1' };

      const getByEmail = userRepositoryStub.getByEmail.resolves(user);

      const result = await userService.getByEmail(email);

      //Assertions
      should(result).be.eql(user);
      should(getByEmail.calledOnce).be.true();
    });

    it('should throw CustomError with validation error if no user matches the email', async () => {
      const email = 'test@example.com';
      const getByEmail = userRepositoryStub.getByEmail.resolves(undefined);

      try {
        await userService.getByEmail(email);
        sinon.assert.fail();
      } catch (error: any) {
        should(error).be.instanceOf(CustomError);
        should(error.errorType).be.eql('VALIDATION_ERROR');
        should(getByEmail.calledOnce).be.true();
      }
    });
  });

  describe('getByID', () => {
    it('should return the user that matches the id', async () => {
      const id = 1;
      const user: User = { id, email: 'test@example.com', password: 'hashedPassword1' };

      const getByID = userRepositoryStub.getByID.resolves(user);

      const result = await userService.getByID(id);

      //Assertions
      should(result).be.eql(user);
      should(getByID.calledOnce).be.true();
    });

    it('should throw CustomError with validation error if no user matches the id', async () => {
      const id = 1;
      const getByID = userRepositoryStub.getByID.resolves(undefined);

      try {
        await userService.getByID(id);
        sinon.assert.fail();
      } catch (error: any) {
        should(error).be.instanceOf(CustomError);
        should(error.errorType).be.eql('VALIDATION_ERROR');
        should(getByID.calledOnce).be.true();
      }
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const user: UserData = {
        email: 'test@example.com',
        password: 'password',
      };
      const hashedPassword = await hash(user.password, 10);
      const newUser: User = {
        id: 1,
        email: user.email,
        password: hashedPassword,
      };

      const getByEmail = userRepositoryStub.getByEmail.resolves(undefined);
      const create = userRepositoryStub.create.resolves(newUser);
      const createUsersAccounts = accountServiceStub.createUsersAccounts.resolves();

      const createdUser = await userService.create(user);

      should.exist(createdUser);
      should(createdUser).be.eql(newUser);
      should(getByEmail.calledOnce).be.true();
      should(create.calledOnce).be.true();
      should(createUsersAccounts.calledOnce).be.true();
    });

    it('should throw a CustomError with validation error if email already exists', async () => {
      const user: UserData = {
        email: 'test@example.com',
        password: 'password',
      };
      const existingUser: User = {
        id: 1,
        email: user.email,
        password: 'hashedPassword',
      };

      const getByEmail = userRepositoryStub.getByEmail.resolves(existingUser);

      try {
        await userService.create(user);
        sinon.assert.fail();
      } catch (error: any) {
        should(error).be.instanceOf(CustomError);
        should(error.errorType).be.eql('VALIDATION_ERROR');
        should(getByEmail.calledOnce).be.true();
        should(userRepositoryStub.create.notCalled).be.true();
        should(accountServiceStub.createUsersAccounts.notCalled).be.true();
      }
    });
  });

  describe('update', () => {
    it('should throw a CustomError with forbidden error', async () => {
      try {
        await userService.update();
        sinon.assert.fail();
      } catch (error: any) {
        should(error).be.instanceOf(CustomError);
        should(error.errorType).be.eql('FORBIDDEN_ERROR');
      }
    });
  });
});

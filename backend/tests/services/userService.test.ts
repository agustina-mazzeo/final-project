import sinon from 'sinon';
import should from 'should';
import { hash } from 'bcrypt';
import { ForbiddenError, UnauthorizedError, ValidationError } from '../../src/interfaces';
import { IAccountWriteService, IUserReadService, IUserWriteService } from '../../src/services/interfaces';
import { IUserReadRepository, IUserWriteRepository } from '../../src/repositories/interfaces';
import { AccountWriteService, RateWriteService, UserReadService, UserWriteService } from '../../src/services';
import { AccountWriteRepository, UserReadRepository, UserWriteRepository, RateWriteRepository } from '../../src/repositories';
import { UserOutputDTO } from '../../src/services/dtos';
import { UserCreateInputDTO } from '../../src/repositories/dtos';

describe('UserService', () => {
  const rateWriteRepository = new RateWriteRepository();
  const rateWriteService = new RateWriteService(rateWriteRepository);
  const userReadRepository = new UserReadRepository();
  const userWriteRepository = new UserWriteRepository();
  const accountWriteService = new AccountWriteService(new AccountWriteRepository(), userReadRepository, rateWriteService);

  let userReadService: IUserReadService;
  let userWriteService: IUserWriteService;
  let userReadRepositoryStub: sinon.SinonStubbedInstance<IUserReadRepository>;
  let userWriteRepositoryStub: sinon.SinonStubbedInstance<IUserWriteRepository>;
  let accountWriteServiceStub: sinon.SinonStubbedInstance<IAccountWriteService>;
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    userReadRepositoryStub = sandbox.stub(userReadRepository as IUserReadRepository);
    userWriteRepositoryStub = sandbox.stub(userWriteRepository as IUserWriteRepository);
    accountWriteServiceStub = sandbox.stub(accountWriteService as IAccountWriteService);
    userReadService = new UserReadService(userReadRepositoryStub);
    userWriteService = new UserWriteService(userReadRepositoryStub, userWriteRepositoryStub, accountWriteServiceStub);
  });
  afterEach(() => {
    sandbox.restore();
  });

  describe('getAll', () => {
    it('should return an array of users', async () => {
      const users: UserOutputDTO[] = [
        { id: '1', email: 'test1@example.com', password: 'hashedPassword1' },
        { id: '2', email: 'test2@example.com', password: 'hashedPassword2' },
      ];

      const getAll = userReadRepositoryStub.getAll.resolves(users);

      const result = await userReadService.getAll();

      should(result).be.eql(users);
      should(getAll.calledOnce).be.true();
    });
  });

  describe('getByEmail', () => {
    it('should return the user that matches the email', async () => {
      const email = 'test@example.com';
      const user: UserOutputDTO = { id: '1', email, password: 'hashedPassword1' };

      const getByEmail = userReadRepositoryStub.getByEmail.resolves(user);

      const result = await userReadService.getByEmail(email);

      //Assertions
      should(result).be.eql(user);
      should(getByEmail.calledOnce).be.true();
    });

    it('should throw CustomError with unauthorized error if no user matches the email', async () => {
      const email = 'test@example.com';
      const getByEmail = userReadRepositoryStub.getByEmail.resolves(undefined);

      try {
        await userReadService.getByEmail(email);
        sinon.assert.fail();
      } catch (error: any) {
        should(error).be.instanceOf(UnauthorizedError);
        should(getByEmail.calledOnce).be.true();
      }
    });
  });

  describe('getByID', () => {
    it('should return the user that matches the id', async () => {
      const id = '1';
      const user: UserOutputDTO = { id, email: 'test@example.com', password: 'hashedPassword1' };

      const getByID = userReadRepositoryStub.getByID.resolves(user);

      const result = await userReadService.getByID(id);

      //Assertions
      should(result).be.eql(user);
      should(getByID.calledOnce).be.true();
    });

    it('should throw CustomError with unauthorized error if no user matches the id', async () => {
      const id = '1';
      const getByID = userReadRepositoryStub.getByID.resolves(undefined);

      try {
        await userReadService.getByID(id);
        sinon.assert.fail();
      } catch (error: any) {
        should(error).be.instanceOf(UnauthorizedError);
        should(getByID.calledOnce).be.true();
      }
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const user: UserCreateInputDTO = {
        email: 'test@example.com',
        password: 'password',
      };
      const hashedPassword = await hash(user.password, 10);
      const newUser: UserOutputDTO = {
        id: '1',
        email: user.email,
        password: hashedPassword,
      };

      const getByEmail = userReadRepositoryStub.getByEmail.resolves(undefined);
      const create = userWriteRepositoryStub.create.resolves(newUser);
      const createUsersAccounts = accountWriteServiceStub.createUsersAccounts.resolves();

      const createdUser = await userWriteService.create(user);

      should.exist(createdUser);
      should(createdUser).be.eql(newUser);
      should(getByEmail.calledOnce).be.true();
      should(create.calledOnce).be.true();
      should(createUsersAccounts.calledOnce).be.true();
    });

    it('should throw a CustomError with validation error if email already exists', async () => {
      const user: UserCreateInputDTO = {
        email: 'test@example.com',
        password: 'password',
      };
      const existingUser: UserOutputDTO = {
        id: '1',
        email: user.email,
        password: 'hashedPassword',
      };

      const getByEmail = userReadRepositoryStub.getByEmail.resolves(existingUser);

      try {
        await userWriteService.create(user);
        sinon.assert.fail();
      } catch (error: any) {
        should(error).be.instanceOf(ValidationError);
        should(getByEmail.calledOnce).be.true();
        should(userWriteRepositoryStub.create.notCalled).be.true();
        should(accountWriteServiceStub.createUsersAccounts.notCalled).be.true();
      }
    });
  });

  describe('update', () => {
    it('should throw a CustomError with forbidden error', async () => {
      try {
        await userWriteService.update();
        sinon.assert.fail();
      } catch (error: any) {
        should(error).be.instanceOf(ForbiddenError);
      }
    });
  });
});

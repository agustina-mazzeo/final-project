import { Router } from 'express';
import UserController from '../user/user.controller';
import { loginUserSchema } from '../user/user.schema';
import validateRequest from '../middleware/validateRequest';
import { authJwt, loginLocal, signupLocal } from '../middleware/authPassport';
import { AccountReadService, UserReadService } from '../../services';
import { AccountReadRepository, UserReadRepository } from '../../repositories';

const userReadRepository = new UserReadRepository();
const accountReadRepository = new AccountReadRepository();
const userReadService = new UserReadService(userReadRepository);
const accountReadService = new AccountReadService(accountReadRepository);

export class UserRoutes {
  public path = '/users';
  public router = Router();
  public user = new UserController(userReadService, accountReadService);

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes = () => {
    this.router.post(`${this.path}/signup`, validateRequest(loginUserSchema), signupLocal, this.user.createUser);
    this.router.post(`${this.path}/login`, validateRequest(loginUserSchema), loginLocal, this.user.login);
    this.router.get(`${this.path}`, this.user.getUsers);
    this.router.get(`${this.path}/accounts`, authJwt, this.user.getAccounts);
  };
}

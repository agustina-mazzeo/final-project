import { Router } from 'express';
import UserController from '../user/user.controller';
import { loginUserSchema } from '../user/user.schema';
import validateRequest from '../middleware/validateRequest';
import { authJwt, loginLocal, signupLocal } from '../middleware/authPassport';
import { AccountService } from '../../services/account.service';
import { UserService } from '../../services/user.service';
import { UserRepository } from '../../repositories/user.repository';
import { AccountRepository } from '../../repositories/account.repository';
import { RateService } from 'services/rate.service';
import { RateRepository } from 'repositories/rate.repository';

const rateService = new RateService(new RateRepository());
const accountService = new AccountService(new AccountRepository(), new UserRepository(), rateService);
const userService = new UserService(new UserRepository(), accountService);

export class UserRoutes {
  public path = '/users';
  public router = Router();
  public user = new UserController(userService, accountService);

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

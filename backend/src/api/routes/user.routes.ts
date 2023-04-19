import { Router } from 'express';
import UserController from '../user/user.controller';
import { loginUserSchema } from '../user/user.schema';
import validateRequest from '../middleware/validateRequest';
import { loginLocal, signupLocal } from '../middleware/authPassport';

class UserRoutes {
  public path = '/users';
  public router = Router();
  public user = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/signup`, validateRequest(loginUserSchema), signupLocal, this.user.createUser);
    this.router.post(`${this.path}/login`, validateRequest(loginUserSchema), loginLocal, this.user.login);
    this.router.get(`${this.path}`, this.user.getUsers);
  }
}
export default UserRoutes;

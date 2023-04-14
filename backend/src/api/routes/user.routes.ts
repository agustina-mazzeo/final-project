import { Router } from 'express';
import UserController from '../user/user.controller';
import { userSchema } from '../user/user.schema';
import validateRequest from '../middleware/validateRequest';

class UserRoutes {
  public path = '/users';
  public router = Router();
  public user = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, validateRequest(userSchema), this.user.createUser);
  }
}
export default UserRoutes;

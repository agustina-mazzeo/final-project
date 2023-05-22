import { Router } from 'express';
import UserController from '../user/user.controller';
import { loginUserSchema } from '../user/user.schema';
import validateRequest from '../middleware/validateRequest';
import { authJwt, loginLocal, signupLocal } from '../middleware/authPassport';
import { authorize } from '../middleware/authRoles';
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
    /**
     * @openapi
     * /users/signup:
     *   post:
     *     summary: Signs a user
     *     tags:
     *       - User
     *     produces:
     *       - application/json
     *     requestBody:
     *       description: User object that needs to be created
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *                 nullable: true   # set nullable to true to make the property optional
     *               email:
     *                  type: string
     *               password:
     *                  type: string
     *     responses:
     *       200:
     *         description: The created user
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                    $ref: '#/components/schemas/User'
     *       400:
     *         description: Validation Error
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 errors:
     *                   type: string
     *       500:
     *         description: An error occurred
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 errors:
     *                   type: string
     *             example:
     *               errors: An error occurred while creating the user
     */
    this.router.post(`${this.path}/signup`, validateRequest(loginUserSchema), signupLocal, this.user.createUser);

    /**
     * @openapi
     * /users/login:
     *   post:
     *     summary: Logs in a user
     *     tags:
     *       - User
     *     produces:
     *       - application/json
     *     requestBody:
     *       description: User object that wants to log in
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                  type: string
     *               password:
     *                  type: string
     *     responses:
     *       200:
     *         description: The logged user with its token
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                    type: object
     *                    properties:
     *                     user:
     *                       type: object
     *                       properties:
     *                         email:
     *                           type: string
     *                     token:
     *                       type: object
     *                       properties:
     *                         expiresIn:
     *                           type: string
     *                         token:
     *                           type: string
     *             example:
     *               data:
     *                 user:
     *                   email: testing@decemberlabs.com
     *                 token:
     *                   expiresIn: 3600000
     *                   token: jwt
     *       400:
     *         description: Validation Error
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 errors:
     *                   type: string
     *       500:
     *         description: An error occurred
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 errors:
     *                   type: string
     *             example:
     *               errors: An error occurred while creating the user
     */
    this.router.post(`${this.path}/login`, validateRequest(loginUserSchema), loginLocal, this.user.login);

    /**
     * @openapi
     * /users:
     *   get:
     *     summary: Get a list of all users
     *     tags:
     *       - User
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: A list of users
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/User'
     *             example:
     *               data:
     *                 - id: 1
     *                   name: John Doe
     *                   email: john.doe@example.com
     *                 - id: 2
     *                   email: jane.doe@example.com
     *       500:
     *         description: An error occurred
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 errors:
     *                   type: string
     *             example:
     *               errors: An error occurred while retrieving users
     */
    this.router.get(this.path, authJwt, authorize('ADMIN'), this.user.getUsers);

    /**
     * @openapi
     * /users/accounts:
     *   get:
     *     summary: Get user accounts
     *     tags:
     *       - User
     *     description: Returns an array of account objects for the authenticated user
     *     produces:
     *       - application/json
     *     parameters:
     *       - in: header
     *         name: Authorization
     *         description: Bearer Token.
     *         type: string
     *         required: true
     *     responses:
     *       200:
     *         description: A list of authenticated user's accounts
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/Account'
     *             example:
     *                data:
     *                  - id: 1
     *                    user_id: userID1
     *                    currency: UYU
     *                    balance: 100
     *                  - id: 2
     *                    user_id: userID1
     *                    currency: USD
     *                    balance: 99
     *                  - id: 3
     *                    user_id: userID1
     *                    currency: EUR
     *                    balance: 150
     *       401:
     *         description: Unauthorized. Invalid or expired token
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 errors:
     *                   type: string
     *             example:
     *                 errors: 'Invalid or expired token'
     *       500:
     *         description: An error occurred
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 errors:
     *                   type: string
     *             example:
     *               errors: An error occurred while retrieving users' accounts
     */
    this.router.get(`${this.path}/accounts`, authJwt, this.user.getAccounts);
  };
}

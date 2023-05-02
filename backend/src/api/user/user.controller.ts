import { NextFunction, Request, Response } from 'express';
import { SignUserBody, LoginUserBody } from './user.schema';
import { userToResponseDTO } from './user.dto';
import { createToken } from '../utils/helpers';
import { UserOutputDTO } from '../../services/data-transfer-objects';
import { IAccountReadService, IUserReadService } from '../../services/interfaces';

class UserController {
  constructor(private userReadService: IUserReadService, private accountReadService: IAccountReadService) {}
  public getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(200).json(await this.userReadService.getAll());
    } catch (error) {
      next(error);
    }
  };

  public createUser = async (req: Request<{}, {}, SignUserBody>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user as UserOutputDTO;
      if (user) res.status(200).send({ data: userToResponseDTO(user) });
      else throw new Error('An unexpected error ocurred');
    } catch (error: any) {
      next(error);
    }
  };

  public login = async (req: Request<{}, {}, LoginUserBody>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user as UserOutputDTO;
      res.status(200).json({ data: { user: userToResponseDTO(user), token: createToken(user) } });
    } catch (error) {
      next(error);
    }
  };

  public getAccounts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user as UserOutputDTO;
      const userAccounts = await this.accountReadService.getAll(user.id);
      res.status(200).json({ data: userAccounts });
    } catch (error) {
      next(error);
    }
  };
}

export default UserController;

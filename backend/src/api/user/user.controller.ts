import { NextFunction, Request, Response } from 'express';
import { Account, User } from '../../interfaces';
import { SignUserBody, LoginUserBody } from './user.schema';
import { userToResponseDTO } from './user.dto';
import { usersRepository } from '../../repositories/users.repository';
import { IService } from '../../services/interfaces/IService';
import { createToken } from '../../utils/helpers';

class UserController {
  constructor(private accountsService: IService<Account>) {}
  public getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(200).json(await usersRepository.getAll());
    } catch (error) {
      next(error);
    }
  };
  public createUser = async (req: Request<{}, {}, SignUserBody>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user as User;
      if (user) res.status(200).send({ data: userToResponseDTO(user) });
      else throw new Error('An unexpected error ocurred');
    } catch (error: any) {
      next(error);
    }
  };

  public login = async (req: Request<{}, {}, LoginUserBody>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user as User;
      res.status(200).json({ data: { user: userToResponseDTO(user), token: createToken(user) } });
    } catch (error) {
      next(error);
    }
  };

  public getAccounts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user as User;
      const userAccounts = await this.accountsService.getAll(user.id);
      res.status(200).json({ data: userAccounts });
    } catch (error) {
      next(error);
    }
  };
}

export default UserController;

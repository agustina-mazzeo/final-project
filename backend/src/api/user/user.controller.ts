import { NextFunction, Request, Response } from 'express';
import { User, createToken } from '../../interfaces';
import { SignUserBody, LoginUserBody } from './user.schema';
import { userToResponseDTO } from './user.dto';
import { usersRepository } from '../../repositories/users.repository';
import { IAccountsService } from 'services/interfaces/IAccountsService';

class UserController {
  constructor(private accountsService: IAccountsService) {}
  //check if this works then see if you have to call the repository or the service
  //constructor(private userService: IService<User>) {}
  public getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(200).json(await usersRepository.getAll());
    } catch (error) {
      next(error);
    }
  };
  public createUser = async (req: Request<{}, {}, SignUserBody>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user as User | undefined;
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
      const userAccounts = await this.accountsService.getUserAccounts(user.id);
      res.status(200).json({ data: userAccounts });
    } catch (error) {
      next(error);
    }
  };
}

export default UserController;

//import { users } from '../../database';
import prisma from '../config/prisma';
import { CustomError } from '../interfaces';
import { UserCreateInputDTO, UserModelDTO } from './dtos';
import { IUserWriteRepository } from './interfaces';

export class UserWriteRepository implements IUserWriteRepository {
  public create = async (user: UserCreateInputDTO): Promise<UserModelDTO> => {
    try {
      const createdUser = await prisma.user.create({
        data: {
          ...user,
        },
      });
      return createdUser as UserModelDTO;
    } catch (error: any) {
      console.log(error);
      throw new CustomError('INTERNAL_SERVER_ERROR', ['Error at user create']);
    }
    // const newUser: User = {
    //   ...user,
    //   id: Math.random(),
    // };
    //users.push(newUser);
    //return newUser;
  };

  public update = (): Promise<UserModelDTO> => {
    throw new CustomError('FORBIDDEN_ERROR', ['Forbidden']);
  };
}

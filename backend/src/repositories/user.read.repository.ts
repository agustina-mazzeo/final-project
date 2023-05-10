import { CustomError } from '../interfaces';
//import { users } from '../../database';
import prisma from '../config/prisma';
import { UserGetterDTO, UserModelDTO } from './dtos';
import { IUserReadRepository } from './interfaces';

export class UserReadRepository implements IUserReadRepository {
  public getAll = async (): Promise<UserModelDTO[]> => {
    try {
      const users = await prisma.user.findMany();
      return users;
    } catch (error: any) {
      console.log(error);
      throw new CustomError('INTERNAL_SERVER_ERROR', ['Error at user get all']);
    }
  };

  public getByEmail = async (email: string): Promise<UserModelDTO | null> => await prisma.user.findUnique({ where: { email } });

  public getByID = async (id: UserGetterDTO): Promise<UserModelDTO | null> => await prisma.user.findUnique({ where: { id } });
}

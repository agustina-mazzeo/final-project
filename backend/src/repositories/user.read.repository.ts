import { InternalError } from '../interfaces';
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
      throw new InternalError('Error trying to get all users');
    }
  };

  public getByEmail = async (email: string): Promise<UserModelDTO | null> => {
    try {
      return await prisma.user.findUnique({ where: { email } });
    } catch (error: any) {
      throw new InternalError('Error trying to get user');
    }
  };

  public getByID = async (id: UserGetterDTO): Promise<UserModelDTO | null> => {
    try {
      return await prisma.user.findUnique({ where: { id } });
    } catch (error: any) {
      throw new InternalError('Error trying to get user');
    }
  };
}

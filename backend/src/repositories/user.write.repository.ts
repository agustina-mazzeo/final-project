import { Prisma } from '@prisma/client';
import prisma from '../config/prisma';
import { ForbiddenError, InternalError, ValidationError } from '../interfaces';
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
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') throw new ValidationError('User already exists');
      throw new InternalError('There was an internal error');
    }
  };

  public update = (): Promise<UserModelDTO> => {
    throw new ForbiddenError('Forbidden');
  };
}

import { PrismaContext } from '../services/dtos';
import prisma from '../config/prisma';
import { InternalError } from '../interfaces';
import { AccountModelDTO, AccountCreateInputDTO, AccountUpdateInputDTO } from './dtos';
import { selectAccountOptions } from '../utils/helpers';
import { IAccountWriteRepository } from './interfaces';

export class AccountWriteRepository implements IAccountWriteRepository {
  public create = async (account: AccountCreateInputDTO): Promise<AccountModelDTO> => {
    try {
      const createdAccount = await prisma.account.create({
        select: selectAccountOptions,
        data: {
          ...account,
          balance: 0,
        },
      });
      return createdAccount as AccountModelDTO;
    } catch (error: any) {
      console.log(error);
      throw new InternalError('Error trying to create account');
    }
  };

  public update = async ({ balance, id }: AccountUpdateInputDTO, prismaTransaction: PrismaContext): Promise<AccountModelDTO> => {
    const prismaInstance = prismaTransaction ?? prisma;
    try {
      return await prismaInstance.account.update({
        select: {
          id: true,
          userId: true,
          currency: true,
          balance: true,
        },
        where: {
          id,
        },
        data: {
          balance,
        },
      });
    } catch (error: any) {
      console.log(error);
      throw new InternalError('Error trying to update account');
    }
  };
}

import prisma from '../config/prisma';
import { CustomError } from '../interfaces';
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
      throw new CustomError('INTERNAL_SERVER_ERROR', ['Error at account create']);
    }
  };

  public update = async ({ balance, id }: AccountUpdateInputDTO): Promise<AccountModelDTO> => {
    try {
      return await prisma.account.update({
        select: {
          id: true,
          user_id: true,
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
      throw new CustomError('INTERNAL_SERVER_ERROR', ['Error at account update']);
    }
  };
}

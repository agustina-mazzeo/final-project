import { Prisma } from '@prisma/client';
import prisma from '../config/prisma';
import { AccountModelDTO, AccountGetAllInputDTO, AccountGetterDTO } from './dtos';
import { IAccountReadRepository } from './interfaces';
import { CustomError } from '../interfaces';
import { addFilters, selectAccountOptions } from './helpers';

export class AccountReadRepository implements IAccountReadRepository {
  public async getAll(filters?: AccountGetAllInputDTO): Promise<AccountModelDTO[]> {
    try {
      const where: Prisma.AccountWhereInput = filters
        ? {
            AND: {
              ...addFilters(filters),
            },
          }
        : {};
      return await prisma.account.findMany({ select: selectAccountOptions, where });
    } catch (error: any) {
      throw new CustomError('INTERNAL_SERVER_ERROR', ['Error at account all']);
    }
  }

  public getByID = async (id: AccountGetterDTO): Promise<AccountModelDTO | null> => {
    const accID = id as number;
    return await prisma.account.findUnique({
      select: selectAccountOptions,
      where: {
        id: accID,
      },
    });
    //return accounts.find(acc => acc.id === id);
  };
}

import { Prisma } from '@prisma/client';
import prisma from '../config/prisma';
import { AccountModelDTO, AccountGetAllDTO, AccountGetterDTO } from './dtos';
import { IAccountReadRepository } from './interfaces';
import { CustomError } from '../interfaces';
import { selectAccountOptions } from './helpers';

export class AccountReadRepository implements IAccountReadRepository {
  public async getAll(filters?: AccountGetAllDTO): Promise<AccountModelDTO[]> {
    try {
      const where: Prisma.AccountWhereInput = filters
        ? {
            AND: {
              id: filters?.find(({ filterBy }) => filterBy === 'id')?.value,
              user_id: filters?.find(({ filterBy }) => filterBy === 'user_id')?.value,
              currency: filters?.find(({ filterBy }) => filterBy === 'currency')?.value,
            },
          }
        : {};
      return await prisma.account.findMany({ select: selectAccountOptions, where });
    } catch (error: any) {
      throw new CustomError('INTERNAL_SERVER_ERROR', ['Error at account all']);
    }
  }

  public getByID = async (id: AccountGetterDTO): Promise<AccountModelDTO | null> => {
    return await prisma.account.findUnique({
      select: selectAccountOptions,
      where: {
        id,
      },
    });
    //return accounts.find(acc => acc.id === id);
  };
}

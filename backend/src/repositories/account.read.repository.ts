//import { accounts } from '../../database';
import prisma from '../config/prisma';
import { AccountModelDTO, AccountGetAllDTO, AccountGetterDTO } from './dtos';
import { IAccountReadRepository } from './interfaces';
import { CustomError } from '../interfaces';
import { Prisma } from '@prisma/client';

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
      return await prisma.account.findMany({ select: { user_id: true, balance: true, currency: true, id: true }, where });
    } catch (error: any) {
      throw new CustomError('INTERNAL_SERVER_ERROR', ['Error at account all']);
    }

    //   if (!filter) {
    //     return accounts;
    //   }
    //   return accounts.filter(acc => filter.every(({ filterBy, value, operator }) => operator(acc[filterBy], value)));
  }

  public getByID = async (id: AccountGetterDTO): Promise<AccountModelDTO | null> => {
    return await prisma.account.findUnique({
      select: { user_id: true, balance: true, currency: true, id: true },
      where: {
        id,
      },
    });
    //return accounts.find(acc => acc.id === id);
  };
}

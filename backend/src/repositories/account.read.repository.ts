import { Prisma } from '@prisma/client';
import prisma from '../config/prisma';
import { AccountModelDTO, AccountGetAllInputDTO, AccountGetterDTO } from './dtos';
import { IAccountReadRepository } from './interfaces';
import { InternalError } from '../interfaces';
import { addFilters, selectAccountOptions } from '../utils/helpers';

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
      throw new InternalError('Error trying to get all accounts');
    }
  }

  public getByID = async (id: AccountGetterDTO): Promise<AccountModelDTO | null> => {
    try {
      const accID = id as number;
      return await prisma.account.findUnique({
        select: selectAccountOptions,
        where: {
          id: accID,
        },
      });
    } catch (error) {
      throw new InternalError('Error trying to get account');
    }
  };
}

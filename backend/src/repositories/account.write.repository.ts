//import { accounts, inc_acc } from '../../database';
import prisma from '../config/prisma';
import { CustomError } from '../interfaces';
import { AccountModelDTO, AccountCreateInputDTO, AccountUpdateInputDTO } from './dtos';
import { IAccountWriteRepository } from './interfaces';

export class AccountWriteRepository implements IAccountWriteRepository {
  public create = async (account: AccountCreateInputDTO): Promise<AccountModelDTO> => {
    try {
      const createdAccount = await prisma.account.create({
        select: {
          id: true,
          user_id: true,
          currency: true,
          balance: true,
        },
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
    // const newAccount: Account = {
    //   id: inc_acc(),
    //   user_id,
    //   currency,
    //   balance: Math.floor(Math.random() * 100),
    // };
    // accounts.push(newAccount);
    // return newAccount;
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
    // const index = accounts.findIndex(({ id }) => accountToUpdateID === id);
    // let accountToUpdate: AccountModelDTO = accounts[index];
    // accountToUpdate = { ...accountToUpdate, balance };
    // accounts[index] = accountToUpdate;
    // return accountToUpdate;
  };
}

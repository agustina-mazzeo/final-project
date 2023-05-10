import { IWriteService } from '.';
import { AccountOutputDTO, AccountCreateInputDTO, AccountUpdateInputDTO, PrismaContext } from '../dtos';

export interface IAccountWriteService extends IWriteService<AccountOutputDTO, AccountCreateInputDTO, AccountUpdateInputDTO, PrismaContext> {
  createUsersAccounts(userId: string): Promise<void>;
  updateAccounts(
    account_from: AccountOutputDTO,
    account_to: AccountOutputDTO,
    amount: number,
    userId: string,
    prisma?: PrismaContext,
  ): Promise<{ account_from: AccountOutputDTO; account_to: AccountOutputDTO }>;
}

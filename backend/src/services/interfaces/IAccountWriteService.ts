import { IWriteService } from '.';
import { AccountOutputDTO, AccountCreateInputDTO, AccountUpdateInputDTO } from '../dtos';

export interface IAccountWriteService extends IWriteService<AccountOutputDTO, AccountCreateInputDTO, AccountUpdateInputDTO> {
  createUsersAccounts(userId: string): Promise<void>;
  updateAccounts(
    account_from: AccountOutputDTO,
    account_to: AccountOutputDTO,
    amount: number,
    userId: string,
  ): Promise<{ account_from: AccountOutputDTO; account_to: AccountOutputDTO }>;
}

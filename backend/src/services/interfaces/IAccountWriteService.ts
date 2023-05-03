import { IWriteService } from '.';
import { AccountOutputDTO, AccountCreateInputDTO, AccountUpdateInputDTO } from '../dtos';

export interface IAccountWriteService extends IWriteService<AccountOutputDTO, AccountCreateInputDTO, AccountUpdateInputDTO> {
  createUsersAccounts(userId: number): Promise<void>;
  updateAccounts(
    account_from: AccountOutputDTO,
    account_to: AccountOutputDTO,
    amount: number,
    userId: number,
  ): Promise<{ account_from: AccountOutputDTO; account_to: AccountOutputDTO }>;
}

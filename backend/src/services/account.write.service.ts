import { IAccountWriteRepository, IUserReadRepository } from '../repositories/interfaces';
import { ValidationError } from '../interfaces';
import { addOnePercent, currencies } from '../utils/helpers';
import { AccountCreateInputDTO, AccountOutputDTO, AccountUpdateInputDTO, PrismaContext } from './dtos';
import { IAccountWriteService, IRateWriteService } from './interfaces';

export class AccountWriteService implements IAccountWriteService {
  constructor(
    private accountWriteRepository: IAccountWriteRepository,
    private userReadRepository: IUserReadRepository,
    private rateWriteService: IRateWriteService,
  ) {}

  public create = async ({ currency, user_id }: AccountCreateInputDTO): Promise<AccountOutputDTO> => {
    try {
      const user = await this.userReadRepository.getByID(user_id);
      if (user) return this.accountWriteRepository.create({ user_id, currency });
      else throw new ValidationError('Invalid credentials');
    } catch (error: any) {
      throw error;
    }
  };

  public createUsersAccounts = async (user_id: string): Promise<void> => {
    try {
      for (const currency of currencies) {
        await this.create({ currency, user_id });
      }
    } catch (error: any) {
      throw error;
    }
  };

  public update = async (updateInfo: AccountUpdateInputDTO, prisma?: PrismaContext): Promise<AccountOutputDTO> => {
    try {
      return await this.accountWriteRepository.update(updateInfo, prisma);
    } catch (error: any) {
      throw error;
    }
  };

  public updateAccounts = async (
    account_from: AccountOutputDTO,
    account_to: AccountOutputDTO,
    amount: number,
    userId: string,
    prisma?: PrismaContext,
  ): Promise<{ account_from: AccountOutputDTO; account_to: AccountOutputDTO }> => {
    let amount_from = amount;
    //add comission
    if (account_to.user_id !== userId) {
      amount_from = addOnePercent(amount);
    }
    try {
      //check balance
      if (account_from.balance - amount_from < 0) {
        throw new ValidationError('Insufficient funds');
      }
      //substract funds
      account_from.balance = account_from.balance - amount_from;

      //convert the amount
      //const currency_to = await this.accountReadService.getAccountCurrency(account_to.id);
      //const currency_from = await this.accountReadService.getAccountCurrency(account_from.id);
      const multiplier = await this.rateWriteService.getMultiplier(account_from.currency, account_to.currency);
      const amount_to = amount * multiplier;

      //deposit funds
      account_to.balance = account_to.balance + amount_to;

      const account_from_updated = await this.update({ balance: account_from.balance, id: account_from.id }, prisma);
      const account_to_updated = await this.update({ balance: account_to.balance, id: account_to.id }, prisma);
      return { account_from: account_from_updated, account_to: account_to_updated };
    } catch (error: any) {
      throw error;
    }
  };
}

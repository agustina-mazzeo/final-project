import { IAccountWriteRepository, IUserReadRepository } from '../repositories/interfaces';
import { CustomError } from '../interfaces';
import { addOnePercent, currencies } from '../utils/helpers';
import { AccountCreateInputDTO, AccountOutputDTO, AccountUpdateInputDTO } from './dtos';
import { IAccountReadService, IAccountWriteService, IRateReadService } from './interfaces';

export class AccountWriteService implements IAccountWriteService {
  constructor(
    private accountReadService: IAccountReadService,
    private accountWriteRepository: IAccountWriteRepository,
    private userReadRepository: IUserReadRepository,
    private rateReadService: IRateReadService,
  ) {}

  public create = async ({ currency, user_id }: AccountCreateInputDTO): Promise<AccountOutputDTO> => {
    try {
      const user = await this.userReadRepository.getByID(user_id);
      if (user) return this.accountWriteRepository.create({ user_id, currency });
      else throw new CustomError('VALIDATION_ERROR', ['Invalid credentials']);
    } catch (error: any) {
      throw new CustomError(error.errorType, error.messages);
    }
  };

  public createUsersAccounts = async (user_id: number): Promise<void> => {
    try {
      for (const currency of currencies) {
        await this.create({ currency, user_id });
      }
    } catch (error: any) {
      throw new CustomError(error.errorType, error.messages);
    }
  };

  public update = async (updateInfo: AccountUpdateInputDTO): Promise<AccountOutputDTO> => {
    try {
      return await this.accountWriteRepository.update(updateInfo);
    } catch (error: any) {
      throw new CustomError(error.errorType, error.messages);
    }
  };

  public updateAccounts = async (
    account_from: AccountOutputDTO,
    account_to: AccountOutputDTO,
    amount: number,
    userId: number,
  ): Promise<{ account_from: AccountOutputDTO; account_to: AccountOutputDTO }> => {
    let amount_from = amount;
    //add comission
    if (account_to.user_id !== userId) {
      amount_from = addOnePercent(amount);
    }
    //check balance
    if (account_from.balance - amount_from < 0) {
      throw new CustomError('VALIDATION_ERROR', ['Insufficient funds']);
    }
    //substract funds
    account_from.balance = account_from.balance - amount_from;
    try {
      //convert the amount
      const currency_to = await this.accountReadService.getAccountCurrency(account_to.id);
      const currency_from = await this.accountReadService.getAccountCurrency(account_from.id);
      const multiplier = await this.rateReadService.getMultiplier(currency_from, currency_to);
      const amount_to = amount * multiplier;
      //deposit funds
      account_to.balance = account_to.balance + amount_to;
      const account_from_updated = await this.update({ balance: account_from.balance, id: account_from.id });
      const account_to_updated = await this.update({ balance: account_to.balance, id: account_to.id });
      return { account_from: account_from_updated, account_to: account_to_updated };
    } catch (error: any) {
      throw new CustomError(error.errorType, error.messages);
    }
  };
}

import { IAccountWriteRepository, IUserReadRepository } from '../repositories/interfaces';
import { CustomError } from '../interfaces';
import { addOnePercent, currencies } from '../utils/helpers';
import { AccountCreateInputDTO, AccountOutputDTO, AccountUpdateInputDTO } from './data-transfer-objects';
import { IAccountReadService, IAccountWriteService, IRateReadService } from './interfaces';

export class AccountWriteService implements IAccountWriteService {
  constructor(
    private accountReadService: IAccountReadService,
    private accountWriteRepository: IAccountWriteRepository,
    private userReadRepository: IUserReadRepository,
    private rateReadService: IRateReadService,
  ) {}

  public create = async ({ currency, id_user }: AccountCreateInputDTO): Promise<AccountOutputDTO> => {
    const user = await this.userReadRepository.getByID(id_user);
    if (user) return this.accountWriteRepository.create({ id_user, currency });
    else throw new CustomError('VALIDATION_ERROR', ['Invalid credentials']);
  };

  public createUsersAccounts = async (id_user: number): Promise<void> => {
    try {
      for (const currency of currencies) {
        await this.create({ currency, id_user });
      }
    } catch (error: any) {
      throw new CustomError(error.errorType, error.messages);
    }
  };

  public update = async (updateInfo: AccountUpdateInputDTO): Promise<AccountOutputDTO> => {
    return await this.accountWriteRepository.update(updateInfo);
  };

  public updateAccounts = async (
    account_from: AccountOutputDTO,
    account_to: AccountOutputDTO,
    amount: number,
    userId: number,
  ): Promise<{ account_from: AccountOutputDTO; account_to: AccountOutputDTO }> => {
    let amount_from = amount;
    //add comission
    if (account_to.id_user !== userId) {
      amount_from = addOnePercent(amount);
    }
    //check balance
    if (account_from.balance - amount_from < 0) {
      throw new CustomError('VALIDATION_ERROR', ['Insufficient funds']);
    }
    //substract funds
    account_from.balance = account_from.balance - amount_from;
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
  };
}

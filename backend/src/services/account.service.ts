import { Account, CustomError } from '../interfaces';
import { IRepository, IUserRepository } from '../repositories/interfaces';
import { IAccountService, IRateService } from './interfaces';
import { addOnePercent, currencies } from '../utils/helpers';

export class AccountService implements IAccountService {
  constructor(private accountsRepository: IRepository<Account>, private usersRepository: IUserRepository, private rateService: IRateService) {}

  public create = async (currency: string, userId: number): Promise<Account> => {
    const user = await this.usersRepository.getByID(userId);
    if (user) return this.accountsRepository.create({ userId, currency });
    else throw new CustomError('VALIDATION_ERROR', ['Invalid credentials']);
  };
  public createUsersAccounts = async (userId: number): Promise<void> => {
    try {
      currencies.map(currency => this.create(currency, userId));
    } catch (error: any) {
      throw new CustomError(error.errorType, error.messages);
    }
  };

  public getAll = async (userId: number): Promise<Account[]> => {
    return this.accountsRepository.getAll([{ filterBy: 'id_user', value: userId }]);
  };

  public getByID = async (id: number): Promise<Account> => {
    const account = await this.accountsRepository.getByID(id);
    if (account) return account;
    else throw new CustomError('VALIDATION_ERROR', ['Invalid account']);
  };

  public update = async (account: Account): Promise<Account> => {
    return await this.accountsRepository.update(account);
  };

  public updateAccounts = async (
    account_from: Account,
    account_to: Account,
    amount: number,
    userId: number,
  ): Promise<{ account_from: Account; account_to: Account }> => {
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
    const currency_to = account_to.currency;
    const currency_from = account_from.currency;
    const multiplier = await this.rateService.getMultiplier(currency_from, currency_to);
    const amount_to = amount * multiplier;
    //deposit funds
    account_to.balance = account_to.balance + amount_to;

    await this.update(account_from);
    await this.update(account_to);

    return { account_from, account_to };
  };
}

import { AccountOutputDTO, AccountGetterDTO, AccountGetAllInputDTO } from '../dtos';
import { IReadService } from '.';

export interface IAccountReadService extends IReadService<AccountOutputDTO, AccountGetAllInputDTO, AccountGetterDTO> {
  getAccountCurrency(account_id: number): Promise<string>;
}

import { AccountOutputDTO, AccountGetterDTO } from '../data-transfer-objects';
import { IReadService } from '.';

export interface IAccountReadService extends IReadService<AccountOutputDTO, AccountGetterDTO, AccountGetterDTO> {
  getAccountCurrency(account_id: number): Promise<string>;
}

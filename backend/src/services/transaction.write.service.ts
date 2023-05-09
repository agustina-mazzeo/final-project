import { IAccountReadService, IAccountWriteService, ITransactionWriteService } from './interfaces';
import { CustomError } from '../interfaces';

import { TransactionOutputDTO, TransactionInputDTO } from './dtos';
import { ITransactionWriteRepository } from '../repositories/interfaces';

export class TransactionWriteService implements ITransactionWriteService {
  constructor(
    private transactionWriteRepository: ITransactionWriteRepository,
    private accountWriteService: IAccountWriteService,
    private accountReadService: IAccountReadService,
  ) {}

  public create = async ({ userId: id, transfer }: TransactionInputDTO): Promise<TransactionOutputDTO> => {
    try {
      if (!id) throw new CustomError('VALIDATION_ERROR', ['Invalid Credentials']);
      const amount = transfer.amount;
      const userAccounts = await this.accountReadService.getAll(id);
      const account_from = userAccounts.find(({ id }) => transfer.account_from_id === id);
      if (!account_from) {
        throw new CustomError('VALIDATION_ERROR', ['Could not make transfer']);
      }
      const account_to = await this.accountReadService.getByID(transfer.account_to_id); //throws
      await this.accountWriteService.updateAccounts(account_from, account_to, amount, id); //throws

      const newTransaction: TransactionOutputDTO = await this.transactionWriteRepository.create(transfer);
      return newTransaction;
    } catch (error: any) {
      throw new CustomError(error.errorType, error.messages);
    }
  };

  public update = (): Promise<TransactionOutputDTO> => {
    throw new CustomError('FORBIDDEN_ERROR', ['Forbidden']);
  };
}

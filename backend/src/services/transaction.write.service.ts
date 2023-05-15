import { IAccountReadService, IAccountWriteService, ITransactionWriteService } from './interfaces';
import { CustomError } from '../interfaces';

import { TransactionOutputDTO, TransactionInputDTO } from './dtos';
import { ITransactionWriteRepository } from '../repositories/interfaces';
import prisma from '../config/prisma';

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

      const newTransaction = await prisma.$transaction(async prisma => {
        await this.accountWriteService.updateAccounts(account_from, account_to, amount, id, prisma); //throws
        return await this.transactionWriteRepository.create(transfer, prisma);
      });

      return newTransaction;
    } catch (error: any) {
      if (error instanceof CustomError) throw new CustomError(error.errorType, error.messages);
      else throw new CustomError('VALIDATION_ERROR', [error.message]);
    }
  };

  public update = (): Promise<TransactionOutputDTO> => {
    throw new CustomError('FORBIDDEN_ERROR', ['Forbidden']);
  };
}

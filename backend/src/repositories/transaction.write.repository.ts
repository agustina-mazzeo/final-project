import { transactions } from '../../database';
import { CustomError, Transaction } from '../interfaces';
import { TransactionInputDTO, TransactionModelDTO } from './dtos';

import { ITransactionWriteRepository } from './interfaces';

export class TransactionWriteRepository implements ITransactionWriteRepository {
  public create = async (transfer: TransactionInputDTO): Promise<TransactionModelDTO> => {
    const newTransfer: Transaction = {
      id: Math.random(),
      createdAt: new Date().toISOString(),
      ...transfer,
    };
    transactions.push(newTransfer);
    const transactionModel: TransactionModelDTO = { ...newTransfer };
    return transactionModel;
  };

  public update = (): Promise<TransactionModelDTO> => {
    throw new CustomError('FORBIDDEN_ERROR', ['Forbidden']);
  };
}

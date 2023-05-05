import prisma from '../config/prisma';
//import { transactions } from '../../database';
import { CustomError } from '../interfaces';
import { TransactionInputDTO, TransactionModelDTO } from './dtos';

import { ITransactionWriteRepository } from './interfaces';

export class TransactionWriteRepository implements ITransactionWriteRepository {
  public create = async (transfer: TransactionInputDTO): Promise<TransactionModelDTO> => {
    try {
      const createdTransaction = await prisma.transaction.create({
        data: {
          ...transfer,
        },
      });
      return JSON.parse(JSON.stringify(createdTransaction)) as TransactionModelDTO;
    } catch (error: any) {
      console.log(error);
      throw new CustomError('INTERNAL_SERVER_ERROR', ['Error at transaction create']);
    }
    // const newTransfer: Transaction = {
    //   id: Math.random(),
    //   createdAt: new Date().toISOString(),
    //   ...transfer,
    // };
    // transactions.push(newTransfer);
    // const transactionModel: TransactionModelDTO = { ...newTransfer };
    // return transactionModel;
  };

  public update = (): Promise<TransactionModelDTO> => {
    throw new CustomError('FORBIDDEN_ERROR', ['Forbidden']);
  };
}

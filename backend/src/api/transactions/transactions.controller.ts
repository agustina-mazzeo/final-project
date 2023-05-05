import { NextFunction, Request, Response } from 'express';
import { TransactionsQuery, TransferBody } from './transactions.schema';
import { ITransactionReadService, ITransactionWriteService } from '../../services/interfaces';
import { TransactionOutputDTO } from '../../services/dtos';

export class TransactionsController {
  constructor(private transactionReadService: ITransactionReadService, private transactionWriteService: ITransactionWriteService) {}
  public getTransactions = async (req: Request<{}, {}, {}, TransactionsQuery>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.user as number;
      const queryParams: TransactionsQuery = req.query;
      const transactions: TransactionOutputDTO[] = await this.transactionReadService.getAll({ queryParams, userId: id });
      res.status(200).json({ data: transactions });
    } catch (error: any) {
      next(error);
    }
  };
  public createTransfer = async (req: Request<{}, {}, TransferBody>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.user as number;
      const newTransfer: TransferBody = req.body;
      const transaction: TransactionOutputDTO = await this.transactionWriteService.create({ transfer: newTransfer, userId: id });
      res.status(200).json({ data: transaction });
    } catch (error: any) {
      next(error);
    }
  };
}

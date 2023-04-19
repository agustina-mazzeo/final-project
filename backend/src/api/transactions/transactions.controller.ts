import { NextFunction, Request, Response } from 'express';
import { Transaction } from '../../interfaces/transaction.interface';
import { TransactionsQuery, TransferBody } from './transactions.schema';
import { IService } from '../../services/IService';
import { User } from '../../interfaces/user.interface';

export class TransactionsController {
  constructor(private transactionsService: IService<Transaction>) {}
  public getTransactions = async (req: Request<{}, {}, {}, TransactionsQuery>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user as User;
      const queryParams = req.query;
      const transactions: Transaction[] = await this.transactionsService.getAll(user.id, queryParams);
      res.status(200).json({ data: transactions });
    } catch (error: any) {
      next(error);
    }
  };
  public createTransfer = async (req: Request<{}, {}, TransferBody>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user as User;
      const newTransfer = req.body;
      const transaction: Transaction = await this.transactionsService.create(user.id, newTransfer);
      res.status(200).json({ data: transaction });
    } catch (error: any) {
      next(error);
    }
  };
}

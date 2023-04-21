import { NextFunction, Request, Response } from 'express';
import { Transaction } from '../../interfaces/transaction.interface';
import { TransactionsQuery, TransferBody } from './transactions.schema';
import { IService } from '../../services/interfaces/IService';
import { User } from '../../interfaces/user.interface';

export class TransactionsController {
  constructor(private transactionsService: IService<Transaction>) {}
  public getTransactions = async (req: Request<{}, {}, {}, TransactionsQuery>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user as User;
      const queryParams = req.query;
      const transactions = (await this.transactionsService.getAll?.(queryParams, user.id)) as Transaction[];
      res.status(200).json({ data: transactions });
    } catch (error: any) {
      next(error);
    }
  };
  public createTransfer = async (req: Request<{}, {}, TransferBody>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user as User;
      const newTransfer = req.body;
      const transaction = (await this.transactionsService.create?.(newTransfer, user.id)) as Transaction;
      res.status(200).json({ data: transaction });
    } catch (error: any) {
      next(error);
    }
  };
}

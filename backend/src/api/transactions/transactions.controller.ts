import { NextFunction, Request, Response } from 'express';
import { Transaction } from '../../interfaces/transaction.interface';
import { TransactionsService } from '../../services/transactions.service';
import { TransactionsQuery, TransferBody } from './transactions.schema';
export class TransactionsController {
  constructor(private txnsService: TransactionsService) {}
  public getTransactions = async (req: Request<{}, {}, {}, TransactionsQuery>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const queryParams = req.query;
      const transactions: Transaction[] = await this.txnsService.getAll(queryParams);
      //then we will call the transactions dto response to send a response create an object {data : what recieves}
      res.status(200).json(transactions);
    } catch (error: any) {
      next(error);
    }
  };
  public createTransfer = async (req: Request<{}, {}, TransferBody>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const newTransfer = req.body;
      const transaction: Transaction = await this.txnsService.create(newTransfer);
      //then we will call the transactions dto response to send a response create an object {data : what recieves}
      res.status(200).json(transaction);
    } catch (error: any) {
      next(error);
    }
  };
}

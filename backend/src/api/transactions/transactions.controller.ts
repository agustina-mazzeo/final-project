import { NextFunction, Request, Response } from 'express';
import { TransactionsQuery, TransferBody } from './transactions.schema';
import { ITransactionReadService, ITransactionWriteService } from '../../services/interfaces';
import { transactionToDTO, queryToDTO } from './transactions.dto';
import { TransactionOutputDTO } from '../../services/dtos';
import { ROLE } from '../../utils/helpers';

export class TransactionsController {
  constructor(private transactionReadService: ITransactionReadService, private transactionWriteService: ITransactionWriteService) {}
  public getTransactions = async (req: Request<{}, {}, {}, TransactionsQuery>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user as { id: string; role: ROLE };
      const queryParams: TransactionsQuery = req.query;
      const transactions: TransactionOutputDTO[] = await this.transactionReadService.getAll({
        queryParams: queryToDTO(queryParams),
        user,
      });

      res.status(200).json({ data: transactions });
    } catch (error: any) {
      next(error);
    }
  };
  public createTransfer = async (req: Request<{}, {}, TransferBody>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.user as { id: string; role: ROLE };
      const newTransfer: TransferBody = req.body;

      const transaction: TransactionOutputDTO = await this.transactionWriteService.create({
        transfer: transactionToDTO(newTransfer),
        userId: id,
      });
      res.status(200).json({ data: transaction });
    } catch (error: any) {
      next(error);
    }
  };
}

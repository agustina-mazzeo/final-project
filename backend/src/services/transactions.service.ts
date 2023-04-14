import { TransactionsQuery, TransferBody } from 'api/transactions/transactions.schema';
import { IService } from './IService';
import { Transaction } from '../interfaces/transaction.interface';
import { TxnsRepository } from '../repositories/transactions.repository';
export class TransactionsService implements IService<Transaction> {
  constructor(private tnxsRepository: TxnsRepository) {}
  public async getAll(params: TransactionsQuery): Promise<Transaction[]> {
    //we are getting all the transactons but we are not discriminating by logged user
    try {
      let transactions = await this.tnxsRepository.getAll();
      if (Object.keys(params).length !== 0) {
        transactions = transactions.filter(({ account_from, createdAt }) => {
          return (
            (!params.account_from || account_from === params.account_from) &&
            (!params.from || createdAt >= params.from) &&
            (!params.to || createdAt <= params.to)
          );
        });
      }
      return transactions;
    } catch (error) {
      throw new Error('Error in getAllTransactions');
    }
  }
  public async create(transfer: TransferBody): Promise<Transaction> {
    try {
      //check that the accounts are valid ie both exists in the database
      //that the account from has sufficient funds
      //if all of the above checks then i can make the transfer
      const newTransfer = await this.tnxsRepository.create(transfer);
      return newTransfer;
    } catch (error) {
      throw new Error('Error in createTransaction');
    }
  }
}

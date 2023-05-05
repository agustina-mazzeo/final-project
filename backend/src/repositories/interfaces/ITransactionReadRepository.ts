import { TransactionModelDTO, TransactionGetAllDTO } from '../dtos';
import { IReadRepository } from '.';

export interface ITransactionReadRepository extends IReadRepository<TransactionModelDTO, TransactionGetAllDTO, unknown> {
  getUsersTransactions(usersAccounts: number[]): Promise<TransactionModelDTO[]>;
}

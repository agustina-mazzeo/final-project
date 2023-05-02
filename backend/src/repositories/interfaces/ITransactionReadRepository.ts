import { TransactionModelDTO, TransactionGetAllDTO } from '../data-transfer-objects';
import { IReadRepository } from '.';

export interface ITransactionReadRepository extends IReadRepository<TransactionModelDTO, TransactionGetAllDTO, unknown> {
  getUsersTransactions(usersAccounts: number[]): Promise<TransactionModelDTO[]>;
}

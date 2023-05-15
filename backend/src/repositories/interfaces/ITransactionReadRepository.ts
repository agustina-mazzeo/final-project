import { TransactionModelDTO, TransactionGetAllInputDTO } from '../dtos';
import { IReadRepository } from '.';

export interface ITransactionReadRepository extends IReadRepository<TransactionModelDTO, TransactionGetAllInputDTO, unknown> {
  getUsersTransactions(usersAccounts: number[]): Promise<TransactionModelDTO[]>;
}

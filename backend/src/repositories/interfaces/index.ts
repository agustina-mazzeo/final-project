/* eslint-disable @typescript-eslint/no-empty-interface */
import {
  AccountCreateInputDTO,
  AccountGetAllInputDTO,
  AccountGetterDTO,
  AccountModelDTO,
  AccountUpdateInputDTO,
  RateGetterDTO,
  RateInputDTO,
  RateModelDTO,
  TransactionInputDTO,
  TransactionModelDTO,
  UserCreateInputDTO,
  UserModelDTO,
} from '../dtos';
import { IReadRepository } from './IReadRepository';
import { IWriteRepository } from './IWriteRepository';

export * from './IReadRepository';
export * from './IWriteRepository';
export * from './ITransactionReadRepository';
export * from './IUserReadRepository';

export interface ITransactionWriteRepository extends IWriteRepository<TransactionModelDTO, TransactionInputDTO, unknown> {}
export interface IUserWriteRepository extends IWriteRepository<UserModelDTO, UserCreateInputDTO, unknown> {}
export interface IAccountReadRepository extends IReadRepository<AccountModelDTO, AccountGetAllInputDTO, AccountGetterDTO> {}
export interface IAccountWriteRepository extends IWriteRepository<AccountModelDTO, AccountCreateInputDTO, AccountUpdateInputDTO> {}
export interface IRateReadRepository extends IReadRepository<RateModelDTO, unknown, RateGetterDTO> {}
export interface IRateWriteRepository extends IWriteRepository<RateModelDTO, RateInputDTO, RateInputDTO> {}

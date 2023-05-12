/* eslint-disable @typescript-eslint/no-empty-interface */
import { PrismaContext } from '../../services/dtos';
import {
  AccountCreateInputDTO,
  AccountGetAllInputDTO,
  AccountGetterDTO,
  AccountModelDTO,
  AccountUpdateInputDTO,
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
export * from './IRateReadRepository';

export interface ITransactionWriteRepository extends IWriteRepository<TransactionModelDTO, TransactionInputDTO, unknown, PrismaContext> {}
export interface IUserWriteRepository extends IWriteRepository<UserModelDTO, UserCreateInputDTO, unknown, unknown> {}
export interface IAccountReadRepository extends IReadRepository<AccountModelDTO, AccountGetAllInputDTO, AccountGetterDTO> {}
export interface IAccountWriteRepository extends IWriteRepository<AccountModelDTO, AccountCreateInputDTO, AccountUpdateInputDTO, PrismaContext> {}
export interface IRateWriteRepository extends IWriteRepository<RateModelDTO, RateInputDTO, RateInputDTO, unknown> {}

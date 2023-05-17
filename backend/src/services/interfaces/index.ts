/* eslint-disable @typescript-eslint/no-empty-interface */
import {
  PrismaContext,
  RateOutputDTO,
  TransactionGetAllDTO,
  TransactionInputDTO,
  TransactionOutputDTO,
  UserCreateInputDTO,
  UserOutputDTO,
} from '../dtos';
import { IReadService } from './IReadService';
import { IWriteService } from './IWriteService';

export * from './IReadService';
export * from './IWriteService';
export * from './IRateWriteService';
export * from './IUserReadService';
export * from './IAccountReadService';
export * from './IAccountWriteService';

export interface IRateReadService extends IReadService<RateOutputDTO, unknown, unknown> {}
export interface IUserWriteService extends IWriteService<UserOutputDTO, UserCreateInputDTO, unknown, unknown> {}
export interface ITransactionReadService extends IReadService<TransactionOutputDTO, TransactionGetAllDTO, unknown> {}
export interface ITransactionWriteService extends IWriteService<TransactionOutputDTO, TransactionInputDTO, unknown, PrismaContext> {}

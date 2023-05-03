/* eslint-disable @typescript-eslint/no-empty-interface */
import {
  RateCreateInputDTO,
  RateOutputDTO,
  RateUpdateInputDTO,
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
export * from './IRateReadService';
export * from './IUserReadService';
export * from './IAccountReadService';
export * from './IAccountWriteService';

export interface IRateWriteService extends IWriteService<RateOutputDTO, RateCreateInputDTO, RateUpdateInputDTO> {}
export interface IUserWriteService extends IWriteService<UserOutputDTO, UserCreateInputDTO, unknown> {}
export interface ITransactionReadService extends IReadService<TransactionOutputDTO, TransactionGetAllDTO, unknown> {}
export interface ITransactionWriteService extends IWriteService<TransactionOutputDTO, TransactionInputDTO, unknown> {}

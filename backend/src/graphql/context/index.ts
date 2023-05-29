import { Request } from 'express';
import { decodeAuthHeader } from '../utils/helpers';
import {
  IAccountReadService,
  IRateReadService,
  ITransactionReadService,
  ITransactionWriteService,
  IUserReadService,
  IUserWriteService,
} from '../../services/interfaces';
import {
  rateReadService,
  userReadService,
  userWriteService,
  accountReadService,
  transactionReadService,
  transactionWriteService,
} from './dataSources';
import { ClientRole } from '../../utils/helpers';

export interface Context {
  userId: string | undefined;
  role: ClientRole | undefined;
  dataSources: {
    rateReadService: IRateReadService;
    userReadService: IUserReadService;
    userWriteService: IUserWriteService;
    accountReadService: IAccountReadService;
    transactionReadService: ITransactionReadService;
    transactionWriteService: ITransactionWriteService;
  };
}

export const context = async ({ req }: { req: Request }): Promise<Context> => {
  const token = req && req.headers.authorization ? decodeAuthHeader(req.headers.authorization) : null;
  return {
    userId: token?.id,
    role: token?.role as ClientRole | undefined,
    dataSources: { rateReadService, userReadService, userWriteService, accountReadService, transactionReadService, transactionWriteService },
  };
};

import {
  AccountReadService,
  AccountWriteService,
  RateReadService,
  RateWriteService,
  TransactionReadService,
  TransactionWriteService,
  UserReadService,
  UserWriteService,
} from '../../services';
import {
  AccountReadRepository,
  AccountWriteRepository,
  RateReadRepository,
  RateWriteRepository,
  TransactionReadRepository,
  TransactionWriteRepository,
  UserReadRepository,
  UserWriteRepository,
} from '../../repositories';

export const rateReadService = new RateReadService(new RateReadRepository());
const userReadRepository = new UserReadRepository();
export const userReadService = new UserReadService(userReadRepository);
const userWriteRepository = new UserWriteRepository();
const accountWriteRepository = new AccountWriteRepository();
const rateWriteRepository = new RateWriteRepository();
const rateWriteService = new RateWriteService(rateWriteRepository);
const accountWriteService = new AccountWriteService(accountWriteRepository, userReadRepository, rateWriteService);
export const userWriteService = new UserWriteService(userReadRepository, userWriteRepository, accountWriteService);
const accountReadRepository = new AccountReadRepository();
export const accountReadService = new AccountReadService(accountReadRepository);
const transactionReadRepository = new TransactionReadRepository();
export const transactionReadService = new TransactionReadService(transactionReadRepository, accountReadService);
const transactionWriteRepository = new TransactionWriteRepository();
export const transactionWriteService = new TransactionWriteService(transactionWriteRepository, accountWriteService, accountReadService);

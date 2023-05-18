import { RateReadService, UserReadService } from '../../services';
import { RateReadRepository, UserReadRepository } from '../../repositories';

export const rateReadService = new RateReadService(new RateReadRepository());
export const userReadService = new UserReadService(new UserReadRepository());

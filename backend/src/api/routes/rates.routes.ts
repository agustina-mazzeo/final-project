import { Router } from 'express';
import { RatesController } from '../rates/rates.controller';
import { RateReadService } from '../../services';
import { RateReadRepository } from '../../repositories';

const rateReadService = new RateReadService(new RateReadRepository());

export class RatesRoutes {
  public path = '/rates';
  public router = Router();
  public rates = new RatesController(rateReadService);

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes = () => {
    this.router.get(`${this.path}`, this.rates.getRates);
  };
}

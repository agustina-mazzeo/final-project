import { Router } from 'express';
import { RatesController } from '../rates/rates.controller';
import { RateService } from '../../services/rate.service';
import { RateRepository } from '../../repositories/rate.repository';

const ratesService = new RateService(new RateRepository());

export class RatesRoutes {
  public path = '/rates';
  public router = Router();
  public rates = new RatesController(ratesService);

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes = () => {
    this.router.get(`${this.path}`, this.rates.getRates);
  };
}

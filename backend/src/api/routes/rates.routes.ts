import { Router } from 'express';
import { RatesController } from '../rates/rates.controller';
import { ratesService } from '../../services/rates.service';

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

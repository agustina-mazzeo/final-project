import cors from 'cors';
import express from 'express';
import passport from 'passport';
import errorManager from './middleware/errorManager';
import { ratesRouter, transactionsRouter, userRouter } from './routes';
import { cronJob } from '../cron/cron';
import { getRates } from '../service/rates';
import { Rates, currencies } from '../interfaces';
import { ratesService } from '../services/rates.service';

export class App {
  public app: express.Application;
  public port: string | number;
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.startCronJob();
    this.setMiddleware();
    this.setRoutes();
    this.setErrorManager();
  }
  private startCronJob = () => {
    cronJob.start();
  };
  private setMiddleware = () => {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(passport.initialize());
  };

  private setRoutes = () => {
    this.app.use(userRouter);
    this.app.use(transactionsRouter);
    this.app.use(ratesRouter);
  };

  private setErrorManager = () => {
    this.app.use(errorManager);
  };

  public start = () => {
    this.app.listen(this.port, () => {
      console.log(`Listening on port ${this.port}`);

      //const data = await getRates();
      const data = {
        base: 'USD',
        rates: { UYU: 38.967787, USD: 1, EUR: 0.91021 },
      };
      // if (data.error) {
      //   console.log(data.error);
      // } else {
      const referenceRate: Rates = data.rates;
      for (const currency of currencies) {
        ratesService.create(referenceRate, currency);
      }
      //}
    });
  };
}

import cors from 'cors';
import express from 'express';
import passport from 'passport';
import errorManager from './middleware/errorManager';
import { setRoutes } from './routes';
import { cronJob } from '../cron/cron';
import { getRates } from '../services/external/rates';
import { Rates } from '../interfaces';
import { currencies } from '../utils/helpers';
import { RateReadRepository, RateWriteRepository } from '../repositories';
import { RateWriteService } from '../services';

const rateWriteService = new RateWriteService(new RateReadRepository(), new RateWriteRepository());

export class App {
  public app: express.Application;
  public port: string | number;
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.startCronJob();
    this.setMiddleware();
    setRoutes(this.app);
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

  private setErrorManager = () => {
    this.app.use(errorManager);
  };

  public start = () => {
    this.app.listen(this.port, async () => {
      //const data = await getRates();
      const data = {
        base: 'USD',
        rates: { UYU: 38.967787, USD: 1, EUR: 0.91021 },
      };
      // if (data.error) {
      //   console.log(data.error);
      // } else {
      const referenceRate: Rates = data.rates;
      try {
        for (const name of currencies) {
          await rateWriteService.create({ referenceRate, name });
        }
      } catch (err: any) {
        console.log(err.messages);
        throw err;
      }
      // }
      console.log(`Listening on port ${this.port}`);
    });
  };
}

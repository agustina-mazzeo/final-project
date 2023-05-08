import cors from 'cors';
import express from 'express';
import passport from 'passport';
import errorManager from './middleware/errorManager';
import { setRoutes } from './routes';
import { cronJob } from '../cron/cron';

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
      console.log(`Listening on port ${this.port}`);
    });
  };
}

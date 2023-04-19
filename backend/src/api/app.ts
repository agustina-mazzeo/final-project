import cors from 'cors';
import express from 'express';
import passport from 'passport';
import errorManager from './middleware/errorManager';
import { transactionsRouter, userRouter } from './routes';

export class App {
  public app: express.Application;
  public port: string | number;
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.setMiddleware();
    this.setRoutes();
    this.setErrorManager();
  }

  private setMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(passport.initialize());
  }

  private setRoutes() {
    this.app.use(userRouter);
    this.app.use(transactionsRouter);
  }

  private setErrorManager() {
    this.app.use(errorManager);
  }

  public start() {
    this.app.listen(this.port, () => {
      console.log(`Listening on port ${this.port}`);
    });
  }
}

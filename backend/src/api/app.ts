import cors from 'cors';
import express from 'express';
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
  }

  private setRoutes() {
    this.app.use(transactionsRouter);
    this.app.use(userRouter);
  }

  private setErrorManager() {
    //this.app.use(()=>{})
    this.app.use(errorManager);
  }

  public start() {
    this.app.listen(this.port, () => {
      console.log(`Listening on port ${this.port}`);
    });
  }
}

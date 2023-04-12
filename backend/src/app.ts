import cors from 'cors';
import express from 'express';

export class App {
  public app: express.Application;
  public port: string | number;
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.setMiddleware();
    //this.setRoutes();
  }

  private setMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  //private setRoutes() {}

  public start() {
    this.app.listen(this.port, () => {
      console.log(`Listening on port ${this.port}`);
    });
  }
}

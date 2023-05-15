import cors from 'cors';
import express from 'express';
import passport from 'passport';
import errorManager from './middleware/errorManager';
import { indexRouter } from './routes';
import { cronJob } from '../cron/cron';
import swaggerUi from 'swagger-ui-express';
import { openapiSpec } from '../swagger';
//import * as SwaggerDocument from '../../swagger.json';

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
    this.setSwaggerDocs();
  }
  private startCronJob = () => {
    cronJob.start();
  };
  private setMiddleware = () => {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(passport.initialize());
  };

  private setSwaggerDocs = () => {
    this.app.use('/swagger', swaggerUi.serve, swaggerUi.setup(openapiSpec));
  };

  private setRoutes = () => {
    this.app.use(indexRouter);
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

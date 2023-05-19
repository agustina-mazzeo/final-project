import cors from 'cors';
import express from 'express';
import passport from 'passport';
import errorManager from './middleware/errorManager';
import { apiRouter, graphqlRouter } from './routes';
import { cronJob } from '../cron/cron';
import swaggerUi from 'swagger-ui-express';
import { openapiSpec } from '../swagger';

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
    this.startGraphQL();
  }
  private startCronJob = () => {
    cronJob.start();
  };
  private setMiddleware = () => {
    this.app.use('/api', cors());
    this.app.use('/api', express.json());
    this.app.use('/api', passport.initialize());
  };

  private setSwaggerDocs = () => {
    this.app.use('/api/swagger', swaggerUi.serve, swaggerUi.setup(openapiSpec));
  };

  private setRoutes = () => {
    this.app.use('/api', apiRouter);
  };

  private setErrorManager = () => {
    this.app.use('/api', errorManager);
  };

  private startGraphQL = async () => {
    this.app.use('/graphql', graphqlRouter);
  };
  public start = () => {
    this.app.listen(this.port, async () => {
      console.log(`Listening on port ${this.port}`);
    });
  };
}

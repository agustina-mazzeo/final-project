import express from 'express';
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
    this.setRoutes();
    this.setSwaggerDocs();
  }
  private startCronJob = () => {
    cronJob.start();
  };

  private setSwaggerDocs = () => {
    this.app.use('/api/swagger', swaggerUi.serve, swaggerUi.setup(openapiSpec));
  };

  private setRoutes = () => {
    this.app.use('/api', apiRouter);
    this.app.use('/graphql', graphqlRouter);
  };

  public start = () => {
    this.app.listen(this.port, async () => {
      console.log(`Listening on port ${this.port}`);
    });
  };
}

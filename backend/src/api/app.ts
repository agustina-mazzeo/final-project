import { json } from 'body-parser';
import cors from 'cors';
import express from 'express';
import passport from 'passport';
import { context } from '../graphql/context';
import { expressMiddleware } from '@apollo/server/express4';
import errorManager from './middleware/errorManager';
import { indexRouter } from './routes';
import { cronJob } from '../cron/cron';
import swaggerUi from 'swagger-ui-express';
import { openapiSpec } from '../swagger';
import { server } from '../graphql';

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
    this.app.use('/api', indexRouter);
  };

  private setErrorManager = () => {
    this.app.use('/api', errorManager);
  };

  private startGraphQL = async () => {
    try {
      await server.start();
      this.app.use('/graphql', cors<cors.CorsRequest>(), json(), expressMiddleware(server, { context }));
    } catch (error) {
      console.log(error);
    }
  };
  public start = () => {
    this.app.listen(this.port, async () => {
      console.log(`Listening on port ${this.port}`);
    });
  };
}

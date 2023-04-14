import * as dotenv from 'dotenv';
import validateEnv from './utils/validateEnv';
import { App } from './api/app';

// App Variables
dotenv.config();
validateEnv();
(async () => {
  try {
    const app = new App();
    app.start();
  } catch (err) {
    console.log(`App did not start, error: ${err}`);
  }
})();

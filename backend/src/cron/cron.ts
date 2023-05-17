import cron, { ScheduleOptions } from 'node-cron';
import { getRates } from '../services/external/rates';
import { Rates } from '../interfaces';
import { currencies } from '../utils/helpers';
import { RateWriteService } from '../services';
import { RateWriteRepository } from '../repositories';
import CacheLocal from '../cache/cache';

const cacheInstance = CacheLocal.getInstance();

//create service instance
const rateWriteService = new RateWriteService(new RateWriteRepository());

const options: ScheduleOptions = {
  scheduled: false,
};
export const cronJob = cron.schedule(
  '0 6 * * *',
  async () => {
    console.log('running a task everyday at 6');
    const data = await getRates();
    if (data.error) {
      console.log(data.error);
    } else {
      const referenceRate: Rates = data.rates;
      for (const name of currencies) {
        //creo una entrada a la tabla por cada currency en el Env. aemas actualizo el cache.
        const lastRate = await rateWriteService.create({ name, referenceRate });
        cacheInstance.set(name, lastRate, 14400);
      }
    }
  },
  options,
);

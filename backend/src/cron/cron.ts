import cron, { ScheduleOptions } from 'node-cron';
import { getRates } from '../services/external/rates';
import { Rates } from '../interfaces';
import { currencies } from '../utils/helpers';
import { RateWriteService } from '../services';
import { RateReadRepository, RateWriteRepository } from '../repositories';

//create service instance
const rateWriteService = new RateWriteService(new RateReadRepository(), new RateWriteRepository());

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
        rateWriteService.create({ name, referenceRate });
      }
    }
  },
  options,
);

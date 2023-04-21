import cron, { ScheduleOptions } from 'node-cron';
import { getRates } from '../service/rates';
import { Rates, currencies } from '../interfaces/rates.interface';
import { ratesService } from '../services/rates.service';

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
      const referenceRates: Rates = data.rates;
      for (const currency of currencies) {
        ratesService.create(referenceRates, currency);
      }
    }
  },
  options,
);

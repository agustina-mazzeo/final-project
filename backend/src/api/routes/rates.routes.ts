import { Router } from 'express';
import { RatesController } from '../rates/rates.controller';
import { RateReadService, RateWriteService } from '../../services';
import { RateReadRepository, RateWriteRepository } from '../../repositories';

const rateReadRepository = new RateReadRepository();
const rateWriteRepository = new RateWriteRepository();
const rateWriteService = new RateWriteService(rateReadRepository, rateWriteRepository);
const rateReadService = new RateReadService(rateReadRepository, rateWriteService);

export class RatesRoutes {
  public path = '/rates';
  public router = Router();
  public rates = new RatesController(rateReadService);

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes = () => {
    /**
     * @openapi
     * /rates:
     *   get:
     *     summary: Get a list of rates
     *     tags:
     *       - Rates
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: A list of rates
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       name:
     *                         type: string
     *                       rates:
     *                         type: object
     *                         properties:
     *                           USD_TO:
     *                             type: number
     *                           USD_FROM:
     *                             type: number
     *                       created_at:
     *                         type: string
     *             example:
     *               data:
     *                 - name: EUR
     *                   rates:
     *                     USD_TO: 1.22
     *                     USD_FROM: 0.82
     *                   created_at: 2022-05-10T12:30:00.000Z
     *                 - name: GBP
     *                   rates:
     *                     USD_TO: 1.42
     *                     USD_FROM: 0.70
     *                   created_at: 2022-05-10T12:35:00.000Z
     *       500:
     *         description: An error occurred
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *             example:
     *               error: An error occurred while retrieving rates
     */
    this.router.get(this.path, this.rates.getRates);
  };
}

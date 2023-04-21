import { NextFunction, Request, Response } from 'express';
import { IService } from '../../services/interfaces/IService';
import { ExchangeRate } from 'interfaces/rates.interface';

export class RatesController {
  constructor(private ratesService: IService<ExchangeRate>) {}
  public getRates = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const rates = (await this.ratesService.getAll?.()) as ExchangeRate[];
      res.status(200).json({ data: rates });
    } catch (error: any) {
      next(error);
    }
  };
}

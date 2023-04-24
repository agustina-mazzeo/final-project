import { NextFunction, Request, Response } from 'express';
import { ExchangeRate } from 'interfaces';
import { IRatesService } from 'services/interfaces/IRatesService';

export class RatesController {
  constructor(private ratesService: IRatesService) {}
  public getRates = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const rates = (await this.ratesService.getAll?.()) as ExchangeRate[];
      res.status(200).json({ data: rates });
    } catch (error: any) {
      next(error);
    }
  };
}

import { NextFunction, Request, Response } from 'express';
import { ExchangeRate } from '../../interfaces';
import { IRateService } from '../../services/interfaces';

export class RatesController {
  constructor(private ratesService: IRateService) {}
  public getRates = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const rates: ExchangeRate[] = await this.ratesService.getAll();
      res.status(200).json({ data: rates });
    } catch (error: any) {
      next(error);
    }
  };
}

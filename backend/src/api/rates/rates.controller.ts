import { NextFunction, Request, Response } from 'express';
import { IRateReadService } from '../../services/interfaces';
import { RateOutputDTO } from '../../services/data-transfer-objects';

export class RatesController {
  constructor(private rateReadService: IRateReadService) {}
  public getRates = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const rates: RateOutputDTO[] = await this.rateReadService.getAll();
      res.status(200).json({ data: rates });
    } catch (error: any) {
      next(error);
    }
  };
}

import sinon from 'sinon';
import should from 'should';
import { ForbiddenError, Rates, ValidationError } from '../../src/interfaces';
import { IRateReadService, IRateWriteService } from '../../src/services/interfaces';
import { IRateReadRepository, IRateWriteRepository } from '../../src/repositories/interfaces';
import { RateReadService, RateWriteService } from '../../src/services';
import { RateReadRepository, RateWriteRepository } from '../../src/repositories';
import { RateOutputDTO } from '../../src/services/dtos';

describe('RateService', () => {
  const rateReadRepository = new RateReadRepository();
  const rateWriteRepository = new RateWriteRepository();

  let rateReadService: IRateReadService;
  let rateWriteService: IRateWriteService;
  let rateReadRepositoryStub: sinon.SinonStubbedInstance<IRateReadRepository>;
  let rateWriteRepositoryStub: sinon.SinonStubbedInstance<IRateWriteRepository>;
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    rateReadRepositoryStub = sandbox.stub(rateReadRepository as IRateReadRepository);
    rateWriteRepositoryStub = sandbox.stub(rateWriteRepository as IRateWriteRepository);
    rateReadService = new RateReadService(rateReadRepositoryStub);
    rateWriteService = new RateWriteService(rateReadRepositoryStub, rateWriteRepositoryStub);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getAll', () => {
    it('should return all exchange rates', async () => {
      const exchangeRates: RateOutputDTO[] = [
        { name: 'EUR', rates: { USD_TO: 1.2, USD_FROM: 0.83 } },
        { name: 'GBP', rates: { USD_TO: 1.4, USD_FROM: 0.71 } },
      ];
      const getAll = rateReadRepositoryStub.getAll.resolves(exchangeRates);

      const result = await rateReadService.getAll();

      should(getAll.calledOnce).be.true();
      should(result).be.eql(exchangeRates);
    });
  });

  describe('create', () => {
    it('should create a new exchange rate if it does not exist', async () => {
      const newRateName = 'ABC';
      const referenceRate: Rates = { USD: 1, EUR: 0.82, GBP: 0.71, ABC: 2 };
      const newExchangeRate: RateOutputDTO = { name: newRateName, rates: { USD_FROM: 0.5, USD_TO: 2 } };
      const getByID = rateReadRepositoryStub.getByID.resolves(undefined);
      const create = rateWriteRepositoryStub.create.resolves(newExchangeRate);

      const createdRate = await rateWriteService.create({ referenceRate, name: newRateName });

      should(getByID.calledOnceWithExactly(newRateName));
      should(create.calledOnceWithExactly(newExchangeRate));
      should(rateWriteRepositoryStub.update.notCalled);
      should(createdRate).deepEqual(newExchangeRate);
    });

    it('should update an existing exchange rate if it exists', async () => {
      const existingRateName = 'EUR';
      const referenceRate: Rates = { USD: 1, EUR: 0.82, GBP: 0.71 };
      const existingRate: RateOutputDTO = { name: existingRateName, rates: { USD_TO: 0.82, USD_FROM: 1.22 } };

      const getByID = rateReadRepositoryStub.getByID.resolves(existingRate);
      const update = rateWriteRepositoryStub.update.resolves(existingRate);

      await rateWriteService.create({ referenceRate, name: existingRateName });

      should(getByID.calledOnceWithExactly(existingRateName)).be.true();
      should(update.calledOnce).be.true();
      should(rateWriteRepositoryStub.create.notCalled).be.true();
    });
  });

  describe('getMultiplier', () => {
    it('should return the correct exchange rate multiplier', async () => {
      const currency_from = 'EUR';
      const currency_to = 'JPY';

      const rate_from: RateOutputDTO = { name: currency_from, rates: { USD_TO: 1.2, USD_FROM: 1 / 1.2 } };
      const rate_to: RateOutputDTO = { name: currency_to, rates: { USD_TO: 0.009, USD_FROM: 1 / 0.009 } };

      const getByID = rateReadRepositoryStub.getByID;
      getByID.withArgs(currency_from).resolves(rate_from);
      getByID.withArgs(currency_to).resolves(rate_to);

      const result = await rateReadService.getMultiplier(currency_from, currency_to);

      should(getByID.calledTwice).be.true();
      should(getByID.calledWith(currency_from));
      should(getByID.calledWith(currency_to));
      should(result).equal(rate_from.rates.USD_FROM * rate_to.rates.USD_TO);
    });

    it('should throw an error if exchange rate data is missing', async () => {
      const currency_from = 'EUR';
      const currency_to = 'JPY';

      const rate_from: RateOutputDTO = { name: currency_from, rates: { USD_TO: 1.2, USD_FROM: 1 / 1.2 } };
      const getByID = rateReadRepositoryStub.getByID;
      getByID.withArgs(currency_from).resolves(rate_from);
      getByID.withArgs(currency_to).resolves(undefined);

      try {
        await rateReadService.getMultiplier(currency_from, currency_to);
        sinon.assert.fail();
      } catch (error: any) {
        should(error).be.instanceOf(ValidationError);
        should(getByID.calledTwice).be.true();
      }
    });
  });

  describe('getByID', () => {
    it('should throw a forbidden error', async () => {
      try {
        await rateReadService.getByID();
        sinon.assert.fail();
      } catch (error: any) {
        should.exist(error);
        should(error).be.an.instanceOf(ForbiddenError);
        should(error.messages).deepEqual(['Forbidden']);
      }
    });
  });
});

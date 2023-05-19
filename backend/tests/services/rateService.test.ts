import sinon from 'sinon';
import should from 'should';
import { ForbiddenError, Rates, ValidationError } from '../../src/interfaces';
import { IRateReadService, IRateWriteService } from '../../src/services/interfaces';
import { IRateReadRepository, IRateWriteRepository } from '../../src/repositories/interfaces';
import { RateReadService, RateWriteService } from '../../src/services';
import { RateReadRepository, RateWriteRepository } from '../../src/repositories';
import { RateOutputDTO } from '../../src/services/dtos';
import CacheLocal from '../../src/cache/cache';

describe('RateService', () => {
  const rateReadRepository = new RateReadRepository();
  const rateWriteRepository = new RateWriteRepository();
  const cacheInstance = CacheLocal.getInstance();

  let cacheInstanceStub: sinon.SinonStubbedInstance<CacheLocal>;
  let rateReadService: IRateReadService;
  let rateWriteService: IRateWriteService;
  let rateReadRepositoryStub: sinon.SinonStubbedInstance<IRateReadRepository>;
  let rateWriteRepositoryStub: sinon.SinonStubbedInstance<IRateWriteRepository>;
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    rateReadRepositoryStub = sandbox.stub(rateReadRepository as IRateReadRepository);
    rateWriteRepositoryStub = sandbox.stub(rateWriteRepository as IRateWriteRepository);
    cacheInstanceStub = sandbox.stub(cacheInstance);
    rateWriteService = new RateWriteService(rateWriteRepositoryStub);
    rateReadService = new RateReadService(rateReadRepositoryStub);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getAll', () => {
    it('should return all exchange rates', async () => {
      const exchangeRates: RateOutputDTO[] = [
        { name: 'EUR', rates: { usdTo: 1.2, usdFrom: 0.83 }, createdAt: 'date' },
        { name: 'GBP', rates: { usdTo: 1.4, usdFrom: 0.71 }, createdAt: 'date' },
      ];
      const getAll = rateReadRepositoryStub.getAll.resolves(exchangeRates);

      const result = await rateReadService.getAll();

      should(getAll.calledOnce).be.true();
      should(result).be.eql(exchangeRates);
    });
  });

  describe('create', () => {
    it('should create a new exchange rate', async () => {
      const newRateName = 'ABC';
      const referenceRate: Rates = { USD: 1, EUR: 0.82, GBP: 0.71, ABC: 2 };
      const newExchangeRate: RateOutputDTO = { name: newRateName, rates: { usdFrom: 0.5, usdTo: 2 }, createdAt: 'date' };
      const create = rateWriteRepositoryStub.create.resolves(newExchangeRate);

      const createdRate = await rateWriteService.create({ referenceRate, name: newRateName });
      should(create.calledOnceWithExactly(newExchangeRate));
      should(createdRate).deepEqual(newExchangeRate);
    });
  });

  describe('getMultiplier', () => {
    it('should return the correct exchange rate multiplier if it is stored in the cache', async () => {
      const currency_from = 'EUR';
      const currency_to = 'ABC';

      const rate_from: RateOutputDTO = { name: currency_from, rates: { usdTo: 1.2, usdFrom: 1 / 1.2 }, createdAt: 'date' };
      const rate_to: RateOutputDTO = { name: currency_to, rates: { usdTo: 0.009, usdFrom: 1 / 0.009 }, createdAt: 'date' };

      const has = cacheInstanceStub.has.returns(true);
      const get = cacheInstanceStub.get;
      get.withArgs(currency_from).returns(rate_from);
      get.withArgs(currency_to).returns(rate_to);

      const updateRatesStub = sinon.stub(rateWriteService, 'updateRates');
      updateRatesStub.resolves({ [currency_from]: rate_from, [currency_to]: rate_to });

      const result = await rateWriteService.getMultiplier(currency_from, currency_to);

      should(has.calledTwice).be.true();
      should(get.calledTwice).be.true();
      should(updateRatesStub.notCalled).be.true();
      should(result).equal(rate_from.rates.usdFrom * rate_to.rates.usdTo);
    });

    it('should return the correct exchange rate multiplier if it is not stored in the cache', async () => {
      const currency_from = 'EUR';
      const currency_to = 'JPY';

      const rate_from: RateOutputDTO = { name: currency_from, rates: { usdTo: 1.2, usdFrom: 1 / 1.2 }, createdAt: 'date' };
      const rate_to: RateOutputDTO = { name: currency_to, rates: { usdTo: 0.009, usdFrom: 1 / 0.009 }, createdAt: 'date' };

      const has = cacheInstanceStub.has.returns(false);
      const get = cacheInstanceStub.get;
      get.withArgs(currency_from).returns(rate_from);
      get.withArgs(currency_to).returns(rate_to);

      const updateRatesStub = sinon.stub(rateWriteService, 'updateRates');
      updateRatesStub.resolves({ [currency_from]: rate_from, [currency_to]: rate_to });

      const result = await rateWriteService.getMultiplier(currency_from, currency_to);

      should(has.called).be.true();
      should(get.notCalled).be.true();
      should(updateRatesStub.calledOnce).be.true();
      should(result).equal(rate_from.rates.usdFrom * rate_to.rates.usdTo);
    });

    it('should throw an error if exchange rate data is missing', async () => {
      const currency_from = 'EUR';
      const currency_to = 'JPY';

      const rate_from: RateOutputDTO = { name: currency_from, rates: { usdTo: 1.2, usdFrom: 1 / 1.2 }, createdAt: 'date' };
      const has = cacheInstanceStub.has.returns(true);
      const get = cacheInstanceStub.get;
      get.withArgs(currency_from).returns(rate_from);
      get.withArgs(currency_to).returns(undefined);

      const updateRatesStub = sinon.stub(rateWriteService, 'updateRates');
      updateRatesStub.resolves({ [currency_from]: rate_from });

      try {
        await rateWriteService.getMultiplier(currency_from, currency_to);
        sinon.assert.fail();
      } catch (error: any) {
        should(error).be.instanceOf(ValidationError);
        should(has.calledTwice).be.true();
        should(get.calledTwice).be.true();
        should(updateRatesStub.notCalled).be.true();
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

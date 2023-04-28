import sinon from 'sinon';
import should from 'should';
import { CustomError, ExchangeRate, Rates } from '../../src/interfaces';
import { IRateService } from '../../src/services/interfaces';
import { IRepository } from '../../src/repositories/interfaces';
import { RateRepository } from '../../src/repositories/rate.repository';
import { RateService } from '../../src/services/rate.service';

describe('RateService', () => {
  const rateRepository = new RateRepository();

  let rateService: IRateService;
  let rateRepositoryStub: sinon.SinonStubbedInstance<IRepository<ExchangeRate>>;
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    rateRepositoryStub = sandbox.stub(rateRepository as IRepository<ExchangeRate>);
    rateService = new RateService(rateRepositoryStub);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getAll', () => {
    it('should return all exchange rates', async () => {
      const exchangeRates: ExchangeRate[] = [
        { name: 'EUR', rates: { USD_TO: 1.2, USD_FROM: 0.83 } },
        { name: 'GBP', rates: { USD_TO: 1.4, USD_FROM: 0.71 } },
      ];
      const getAll = rateRepositoryStub.getAll.resolves(exchangeRates);

      const result = await rateService.getAll();

      should(getAll.calledOnce).be.true();
      should(result).be.eql(exchangeRates);
    });
  });

  describe('create', () => {
    it('should create a new exchange rate if it does not exist', async () => {
      const newRateName = 'ABC';
      const referenceRates: Rates = { USD: 1, EUR: 0.82, GBP: 0.71, ABC: 2 };
      const newExchangeRate: ExchangeRate = { name: newRateName, rates: { USD_FROM: 0.5, USD_TO: 2 } };
      const getByID = rateRepositoryStub.getByID.resolves(undefined);
      const create = rateRepositoryStub.create.resolves(newExchangeRate);

      const createdRate = await rateService.create(referenceRates, newRateName);

      should(getByID.calledOnceWithExactly(newRateName));
      should(create.calledOnceWithExactly(newExchangeRate));
      should(rateRepositoryStub.update.notCalled);
      should(createdRate).deepEqual(newExchangeRate);
    });

    it('should update an existing exchange rate if it exists', async () => {
      const existingRateName = 'EUR';
      const referenceRates: Rates = { USD: 1, EUR: 0.82, GBP: 0.71 };
      const existingRate: ExchangeRate = { name: existingRateName, rates: { USD_TO: 0.82, USD_FROM: 1.22 } };

      const getByID = rateRepositoryStub.getByID.resolves(existingRate);
      const update = rateRepositoryStub.update.resolves(existingRate);

      await rateService.create(referenceRates, existingRateName);

      should(getByID.calledOnceWithExactly(existingRateName)).be.true();
      should(update.calledOnce).be.true();
      should(rateRepositoryStub.create.notCalled).be.true();
    });
  });

  describe('getMultiplier', () => {
    it('should return the correct exchange rate multiplier', async () => {
      const currency_from = 'EUR';
      const currency_to = 'JPY';

      const rate_from: ExchangeRate = { name: currency_from, rates: { USD_TO: 1.2, USD_FROM: 1 / 1.2 } };
      const rate_to: ExchangeRate = { name: currency_to, rates: { USD_TO: 0.009, USD_FROM: 1 / 0.009 } };

      const getByID = rateRepositoryStub.getByID;
      getByID.withArgs(currency_from).resolves(rate_from);
      getByID.withArgs(currency_to).resolves(rate_to);

      const result = await rateService.getMultiplier(currency_from, currency_to);

      should(getByID.calledTwice).be.true();
      should(getByID.calledWith(currency_from));
      should(getByID.calledWith(currency_to));
      should(result).equal(rate_from.rates.USD_FROM * rate_to.rates.USD_TO);
    });

    it('should throw an error if exchange rate data is missing', async () => {
      const currency_from = 'EUR';
      const currency_to = 'JPY';

      const rate_from: ExchangeRate = { name: currency_from, rates: { USD_TO: 1.2, USD_FROM: 1 / 1.2 } };
      const getByID = rateRepositoryStub.getByID;
      getByID.withArgs(currency_from).resolves(rate_from);
      getByID.withArgs(currency_to).resolves(undefined);

      try {
        await rateService.getMultiplier(currency_from, currency_to);
        sinon.assert.fail();
      } catch (error: any) {
        should(error).be.instanceOf(CustomError);
        should(error.errorType).be.eql('VALIDATION_ERROR');
        should(getByID.calledTwice).be.true();
      }
    });
  });

  describe('getByID', () => {
    it('should throw a FORBIDDEN_ERROR', async () => {
      try {
        await rateService.getByID();
        sinon.assert.fail();
      } catch (error: any) {
        should.exist(error);
        should(error).be.an.instanceOf(CustomError);
        should(error.errorType).equal('FORBIDDEN_ERROR');
        should(error.messages).deepEqual(['Forbidden']);
      }
    });
  });
});

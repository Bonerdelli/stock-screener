import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { fakeAsync, tick } from '@angular/core/testing';

import { BinanceService } from './binance.service';
import { Ticker } from './binance.types';

describe('BinanceService', () => {
  let service: BinanceService;
  let httpMock: HttpTestingController;

  const mockTickers: Ticker[] = [
    {
      symbol: 'BTCUSDT',
      priceChange: '100',
      priceChangePercent: '1.5',
      weightedAvgPrice: '50000',
      prevClosePrice: '49000',
      lastPrice: '50000',
      lastQty: '0.1',
      bidPrice: '49999',
      bidQty: '1',
      askPrice: '50001',
      askQty: '1',
      openPrice: '49000',
      highPrice: '51000',
      lowPrice: '48000',
      volume: '1000',
      quoteVolume: '50000000',
      openTime: 1000000000000,
      closeTime: 1000086400000,
      firstId: 1,
      lastId: 100,
      count: 100,
    },
    {
      symbol: 'ETHUSDT',
      priceChange: '50',
      priceChangePercent: '2.0',
      weightedAvgPrice: '3000',
      prevClosePrice: '2950',
      lastPrice: '3000',
      lastQty: '1',
      bidPrice: '2999',
      bidQty: '10',
      askPrice: '3001',
      askQty: '10',
      openPrice: '2950',
      highPrice: '3100',
      lowPrice: '2900',
      volume: '5000',
      quoteVolume: '15000000',
      openTime: 1000000000000,
      closeTime: 1000086400000,
      firstId: 1,
      lastId: 200,
      count: 200,
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BinanceService],
    });
    service = TestBed.inject(BinanceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getDailyTickersData', () => {
    it('should return tickers data', () => {
      service.getDailyTickersData().subscribe((data) => {
        expect(data).toEqual(mockTickers);
        expect(data.length).toBe(2);
      });

      const req = httpMock.expectOne(
        'https://api.binance.com/api/v3/ticker/24hr'
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockTickers);
    });

    it('should handle error', () => {
      service.getDailyTickersData().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(500);
        },
      });

      const req = httpMock.expectOne(
        'https://api.binance.com/api/v3/ticker/24hr'
      );
      req.flush('Error', { status: 500, statusText: 'Server Error' });
    });
  });

  describe('getPeriodicDailyTickersData', () => {
    it('should return tickers data periodically', fakeAsync(() => {
      let callCount = 0;
      const intervalMs = 100;
      let subscription = service
        .getPeriodicDailyTickersData(intervalMs)
        .subscribe((data) => {
          callCount++;
          expect(data).toEqual(mockTickers);
        });

      // Initial call (timer(0) fires immediately)
      tick(0);
      let req = httpMock.expectOne(
        'https://api.binance.com/api/v3/ticker/24hr'
      );
      req.flush(mockTickers);
      expect(callCount).toBe(1);

      // First periodic call
      tick(intervalMs);
      req = httpMock.expectOne('https://api.binance.com/api/v3/ticker/24hr');
      req.flush(mockTickers);
      expect(callCount).toBe(2);

      // Second periodic call
      tick(intervalMs);
      req = httpMock.expectOne('https://api.binance.com/api/v3/ticker/24hr');
      req.flush(mockTickers);
      expect(callCount).toBe(3);

      subscription.unsubscribe();
    }));

    it('should use default interval if not provided', fakeAsync(() => {
      let callCount = 0;
      let subscription = service
        .getPeriodicDailyTickersData()
        .subscribe((data) => {
          callCount++;
          expect(data).toEqual(mockTickers);
        });

      // Initial call (timer(0) fires immediately)
      tick(0);
      const req = httpMock.expectOne(
        'https://api.binance.com/api/v3/ticker/24hr'
      );
      req.flush(mockTickers);
      expect(callCount).toBe(1);

      subscription.unsubscribe();
    }));
  });

  describe('getTickerData', () => {
    it('should return ticker data', () => {
      service.getTickerData().subscribe((data) => {
        expect(data).toEqual(mockTickers);
      });

      const req = httpMock.expectOne('https://api.binance.com/api/v3/ticker');
      expect(req.request.method).toBe('GET');
      req.flush(mockTickers);
    });
  });

  describe('getPeriodicTickerData', () => {
    it('should return ticker data periodically', fakeAsync(() => {
      let callCount = 0;
      const intervalMs = 100;
      let subscription = service
        .getPeriodicTickerData(intervalMs)
        .subscribe((data) => {
          callCount++;
          expect(data).toEqual(mockTickers);
        });

      // Initial call (timer(0) fires immediately)
      tick(0);
      let req = httpMock.expectOne('https://api.binance.com/api/v3/ticker');
      req.flush(mockTickers);
      expect(callCount).toBe(1);

      // First periodic call
      tick(intervalMs);
      req = httpMock.expectOne('https://api.binance.com/api/v3/ticker');
      req.flush(mockTickers);
      expect(callCount).toBe(2);

      subscription.unsubscribe();
    }));

    it('should use default interval if not provided', fakeAsync(() => {
      let callCount = 0;
      let subscription = service.getPeriodicTickerData().subscribe((data) => {
        callCount++;
        expect(data).toEqual(mockTickers);
      });

      // Initial call (timer(0) fires immediately)
      tick(0);
      const req = httpMock.expectOne('https://api.binance.com/api/v3/ticker');
      req.flush(mockTickers);
      expect(callCount).toBe(1);

      subscription.unsubscribe();
    }));
  });
});

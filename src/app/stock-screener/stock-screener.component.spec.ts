import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { fakeAsync, tick } from '@angular/core/testing';

import { StockScreenerComponent } from './stock-screener.component';
import { BinanceService } from './binance.service';
import { Ticker } from './binance.types';
import { TickerFilters } from './stock-screener.types';

describe('StockScreenerComponent', () => {
  let component: StockScreenerComponent;
  let fixture: ComponentFixture<StockScreenerComponent>;
  let binanceService: jasmine.SpyObj<BinanceService>;

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
    {
      symbol: 'BNBUSDT',
      priceChange: '10',
      priceChangePercent: '0.5',
      weightedAvgPrice: '400',
      prevClosePrice: '390',
      lastPrice: '400',
      lastQty: '5',
      bidPrice: '399',
      bidQty: '20',
      askPrice: '401',
      askQty: '20',
      openPrice: '390',
      highPrice: '410',
      lowPrice: '380',
      volume: '10000',
      quoteVolume: '4000000',
      openTime: 1000000000000,
      closeTime: 1000086400000,
      firstId: 1,
      lastId: 300,
      count: 300,
    },
  ];

  const mockNonUSDTTicker: Ticker = {
    symbol: 'BTCBTC',
    priceChange: '0',
    priceChangePercent: '0',
    weightedAvgPrice: '1',
    prevClosePrice: '1',
    lastPrice: '1',
    lastQty: '1',
    bidPrice: '1',
    bidQty: '1',
    askPrice: '1',
    askQty: '1',
    openPrice: '1',
    highPrice: '1',
    lowPrice: '1',
    volume: '1',
    quoteVolume: '1',
    openTime: 1000000000000,
    closeTime: 1000086400000,
    firstId: 1,
    lastId: 1,
    count: 1,
  };

  beforeEach(async () => {
    const binanceServiceSpy = jasmine.createSpyObj('BinanceService', [
      'getPeriodicDailyTickersData',
    ]);

    await TestBed.configureTestingModule({
      imports: [StockScreenerComponent, HttpClientTestingModule],
      providers: [{ provide: BinanceService, useValue: binanceServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(StockScreenerComponent);
    component = fixture.componentInstance;
    binanceService = TestBed.inject(
      BinanceService
    ) as jasmine.SpyObj<BinanceService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should subscribe to ticker data and update data', () => {
      binanceService.getPeriodicDailyTickersData.and.returnValue(
        of(mockTickers)
      );

      component.ngOnInit();

      expect(binanceService.getPeriodicDailyTickersData).toHaveBeenCalled();
      expect(component.loading).toBe(false);
      expect(component['data'].length).toBe(3);
      expect(component['data'][0].symbol).toBe('BTCUSDT');
      expect(component['data'][0].lastPrice).toBe(50000);
      expect(component['data'][0].priceChangePercent).toBe(1.5);
    });

    it('should filter out non-USDT symbols', () => {
      const mixedTickers = [...mockTickers, mockNonUSDTTicker];
      binanceService.getPeriodicDailyTickersData.and.returnValue(
        of(mixedTickers)
      );

      component.ngOnInit();

      expect(component['data'].length).toBe(3);
      expect(
        component['data'].every((item) => item.symbol.endsWith('USDT'))
      ).toBe(true);
    });

    it('should handle error and set error message', () => {
      const error = new Error('Network error');
      spyOn(console, 'error');
      binanceService.getPeriodicDailyTickersData.and.returnValue(
        throwError(() => error)
      );

      component.ngOnInit();

      expect(component.loading).toBe(false);
      expect(component['errorMessage']).toBe(
        'Failed to fetch data. Please try again later'
      );
      expect(console.error).toHaveBeenCalledWith(
        'Error fetching ticker data:',
        error
      );
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from ticker subscription', () => {
      binanceService.getPeriodicDailyTickersData.and.returnValue(
        of(mockTickers)
      );
      component.ngOnInit();

      const subscription = component['tickerSubscription'];
      spyOn(subscription!, 'unsubscribe');

      component.ngOnDestroy();

      expect(subscription?.unsubscribe).toHaveBeenCalled();
    });

    it('should handle missing subscription gracefully', () => {
      expect(() => component.ngOnDestroy()).not.toThrow();
    });
  });

  describe('filteredData', () => {
    beforeEach(() => {
      binanceService.getPeriodicDailyTickersData.and.returnValue(
        of(mockTickers)
      );
      component.ngOnInit();
    });

    it('should return all data when no filters applied', () => {
      component['activeFilters'] = {
        minVolume: null,
        maxVolume: null,
        minPriceChange: null,
        maxPriceChange: null,
        minPrice: null,
        maxPrice: null,
      };

      expect(component.filteredData.length).toBe(3);
    });

    it('should filter by min volume', () => {
      component['activeFilters'] = {
        minVolume: 5000,
        maxVolume: null,
        minPriceChange: null,
        maxPriceChange: null,
        minPrice: null,
        maxPrice: null,
      };

      expect(component.filteredData.length).toBe(2);
      expect(component.filteredData.every((item) => item.volume >= 5000)).toBe(
        true
      );
    });

    it('should filter by max volume', () => {
      component['activeFilters'] = {
        minVolume: null,
        maxVolume: 2000,
        minPriceChange: null,
        maxPriceChange: null,
        minPrice: null,
        maxPrice: null,
      };

      expect(component.filteredData.length).toBe(1);
      expect(component.filteredData[0].volume).toBeLessThanOrEqual(2000);
    });

    it('should filter by min and max volume', () => {
      component['activeFilters'] = {
        minVolume: 2000,
        maxVolume: 8000,
        minPriceChange: null,
        maxPriceChange: null,
        minPrice: null,
        maxPrice: null,
      };

      expect(component.filteredData.length).toBe(1);
      expect(component.filteredData[0].volume).toBe(5000);
    });

    it('should filter by min price change', () => {
      component['activeFilters'] = {
        minVolume: null,
        maxVolume: null,
        minPriceChange: 1.5,
        maxPriceChange: null,
        minPrice: null,
        maxPrice: null,
      };

      expect(component.filteredData.length).toBe(2);
      expect(
        component.filteredData.every((item) => item.priceChangePercent >= 1.5)
      ).toBe(true);
    });

    it('should filter by max price change', () => {
      component['activeFilters'] = {
        minVolume: null,
        maxVolume: null,
        minPriceChange: null,
        maxPriceChange: 1.0,
        minPrice: null,
        maxPrice: null,
      };

      expect(component.filteredData.length).toBe(1);
      expect(component.filteredData[0].priceChangePercent).toBeLessThanOrEqual(
        1.0
      );
    });

    it('should filter by min price', () => {
      component['activeFilters'] = {
        minVolume: null,
        maxVolume: null,
        minPriceChange: null,
        maxPriceChange: null,
        minPrice: 3000,
        maxPrice: null,
      };

      expect(component.filteredData.length).toBe(2);
      expect(
        component.filteredData.every((item) => item.lastPrice >= 3000)
      ).toBe(true);
    });

    it('should filter by max price', () => {
      component['activeFilters'] = {
        minVolume: null,
        maxVolume: null,
        minPriceChange: null,
        maxPriceChange: null,
        minPrice: null,
        maxPrice: 3500,
      };

      expect(component.filteredData.length).toBe(2);
      expect(
        component.filteredData.every((item) => item.lastPrice <= 3500)
      ).toBe(true);
    });

    it('should apply multiple filters simultaneously', () => {
      component['activeFilters'] = {
        minVolume: 2000,
        maxVolume: 8000,
        minPriceChange: 1.0,
        maxPriceChange: 2.5,
        minPrice: 2000,
        maxPrice: 4000,
      };

      expect(component.filteredData.length).toBe(1);
      expect(component.filteredData[0].symbol).toBe('ETHUSDT');
    });
  });

  describe('openFilterModal', () => {
    it('should call openModal on filterModal with focus parameter', () => {
      const mockFilterModal = jasmine.createSpyObj('FilterModalComponent', [
        'openModal',
      ]);
      component.filterModal = mockFilterModal;

      component.openFilterModal('volume');

      expect(mockFilterModal.openModal).toHaveBeenCalledWith('volume');
    });

    it('should handle null filterModal gracefully', () => {
      component.filterModal = null;

      expect(() => component.openFilterModal('price')).not.toThrow();
    });
  });

  describe('applyFilters', () => {
    it('should update activeFilters', () => {
      const filters: TickerFilters = {
        minVolume: 1000,
        maxVolume: 5000,
        minPriceChange: 1.0,
        maxPriceChange: 2.0,
        minPrice: 100,
        maxPrice: 1000,
      };

      component.applyFilters(filters);

      expect(component['activeFilters']).toEqual(filters);
    });
  });

  describe('updateRawData', () => {
    it('should initialize data on first call', () => {
      binanceService.getPeriodicDailyTickersData.and.returnValue(
        of(mockTickers)
      );

      component.ngOnInit();

      expect(component['data'].length).toBe(3);
      expect(component.loading).toBe(false);
    });

    it('should update data and track changes on subsequent calls', fakeAsync(() => {
      binanceService.getPeriodicDailyTickersData.and.returnValue(
        of(mockTickers)
      );
      component.ngOnInit();
      tick(0);

      expect(component['data'].length).toBe(3);
      expect(component['data'][0].lastPrice).toBe(50000);
      expect(component['rawData']).toEqual(mockTickers);

      // Simulate data update with changed ticker
      const updatedTickers: Ticker[] = [
        {
          ...mockTickers[0],
          lastPrice: '51000',
          priceChangePercent: '2.0',
        },
        mockTickers[1],
        mockTickers[2],
      ];

      component['updateRawData'](updatedTickers);
      expect(component['changedSymbols']['BTCUSDT']).toBe(true);
      expect(component['data'][0].lastPrice).toBe(51000);
      expect(component['data'][0].priceChangePercent).toBe(2.0);

      // Wait for timer to clear changed symbols
      tick(1000);
      expect(component['changedSymbols']).toEqual({});
    }));

    it('should not mark unchanged tickers', () => {
      binanceService.getPeriodicDailyTickersData.and.returnValue(
        of(mockTickers)
      );
      component.ngOnInit();

      const unchangedTickers = [...mockTickers];
      binanceService.getPeriodicDailyTickersData.and.returnValue(
        of(unchangedTickers)
      );
      component.ngOnInit();

      expect(Object.keys(component['changedSymbols']).length).toBe(0);
    });
  });

  describe('tickerToDto', () => {
    it('should convert Ticker to TickerDto correctly', () => {
      const ticker = mockTickers[0];
      const dto = component['tickerToDto'](ticker);

      expect(dto.symbol).toBe('BTCUSDT');
      expect(dto.lastPrice).toBe(50000);
      expect(dto.priceChangePercent).toBe(1.5);
      expect(dto.prevClosePrice).toBe(49000);
      expect(dto.openPrice).toBe(49000);
      expect(dto.volume).toBe(1000);
      expect(typeof dto.lastPrice).toBe('number');
      expect(typeof dto.priceChangePercent).toBe('number');
    });
  });

  describe('isTickerChanged', () => {
    it('should return true when lastPrice changes', () => {
      const ticker1 = mockTickers[0];
      const ticker2 = { ...mockTickers[0], lastPrice: '51000' };

      expect(component['isTickerChanged'](ticker1, ticker2)).toBe(true);
    });

    it('should return true when priceChangePercent changes', () => {
      const ticker1 = mockTickers[0];
      const ticker2 = { ...mockTickers[0], priceChangePercent: '2.0' };

      expect(component['isTickerChanged'](ticker1, ticker2)).toBe(true);
    });

    it('should return true when both prices change', () => {
      const ticker1 = mockTickers[0];
      const ticker2 = {
        ...mockTickers[0],
        lastPrice: '51000',
        priceChangePercent: '2.0',
      };

      expect(component['isTickerChanged'](ticker1, ticker2)).toBe(true);
    });

    it('should return false when no relevant fields change', () => {
      const ticker1 = mockTickers[0];
      const ticker2 = {
        ...mockTickers[0],
        volume: '2000',
        highPrice: '52000',
      };

      expect(component['isTickerChanged'](ticker1, ticker2)).toBe(false);
    });
  });
});

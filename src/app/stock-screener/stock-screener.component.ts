import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription, timer } from 'rxjs';

import { BinanceService } from './binance.service';
import { SpinnerComponent } from '../shared/spinner/spinner.component';

import { Ticker } from './binance.types';
import { ErrorMessageComponent } from '../shared/error-message/error-message.component';
import { defaultFilters, FilterModalComponent } from './filter-modal/filter-modal.component';
import { TickerDto, TickerFilters } from './stock-screener.types';

@Component({
  selector: 'app-stock-screener',
  templateUrl: './stock-screener.component.html',
  standalone: true,
  imports: [CommonModule, SpinnerComponent, ErrorMessageComponent, FilterModalComponent],
})
export class StockScreenerComponent implements OnInit, OnDestroy {
  public loading = true;

  protected data: TickerDto[] = [];
  protected rawData: Ticker[] = [];
  protected changedSymbols: Record<string, boolean> = {}
  protected activeFilters: TickerFilters = defaultFilters;
  protected tickerSubscription?: Subscription;
  protected errorMessage = '';

  constructor(private binanceService: BinanceService) {}

  @ViewChild(FilterModalComponent) filterModal: FilterModalComponent | null = null;

  ngOnInit(): void {
    this.tickerSubscription = this.binanceService.getPeriodicDailyTickersData().subscribe({
      next: (data) => this.updateRawData(data),
      error: (err) => {
        this.errorMessage = 'Failed to fetch data. Please try again later';
        console.error('Error fetching ticker data:', err);
        this.loading = false;
      },
    });
  }

  ngOnDestroy(): void {
    this.tickerSubscription?.unsubscribe();
  }

  public get filteredData(): TickerDto[] {
    const filters = this.activeFilters;
    return this.data.filter(item => (
      (filters.minVolume == null || item.volume >= filters.minVolume) &&
      (filters.maxVolume == null || item.volume <= filters.maxVolume) &&
      (filters.minPriceChange == null || item.priceChangePercent >= filters.minPriceChange) &&
      (filters.maxPriceChange == null || item.priceChangePercent <= filters.maxPriceChange) &&
      (filters.minPrice == null || item.lastPrice >= filters.minPrice) &&
      (filters.maxPrice == null || item.lastPrice <= filters.maxPrice)
    ));
  }

  openFilterModal(focusOn: string) {
    this.filterModal?.openModal(focusOn);
  }

  applyFilters(filters: TickerFilters) {
    this.activeFilters = filters;
  }

  protected updateRawData(rawData: Ticker[]) {
    // NOTE: we can't filter this on API side, because it's not supported so many option for `symbols` param
    const filteredData = rawData.filter(crypto => crypto.symbol.endsWith('USDT'));
    if (this.data.length) {
      this.applyDataChanges(filteredData)
    } else {
      this.data = filteredData.map(this.tickerToDto);
      this.loading = false;
    }
    this.rawData = rawData;
  }

  protected tickerToDto(item: Ticker): TickerDto {
    return {
      symbol: item.symbol,
      lastPrice: Number(item.lastPrice),
      priceChangePercent: Number(item.priceChangePercent),
      prevClosePrice: Number(item.prevClosePrice),
      openPrice: Number(item.openPrice),
      volume: Number(item.volume),
    }
  }

  protected applyDataChanges(newData: Ticker[]): void {
    const updatedChangedSymbols: Record<string, boolean> = {}
    for (const ticker of newData) {
      const existingTicketIndex = this.rawData.findIndex(item => item.symbol === ticker.symbol);
      const existingTicket = this.rawData[existingTicketIndex];
      if (!existingTicket || !this.isTickerChanged(ticker, existingTicket)) {
        continue; // Pass if no changes
      }
      this.data[existingTicketIndex] = this.tickerToDto(ticker)
      updatedChangedSymbols[ticker.symbol] = true;
    }
    this.changedSymbols = updatedChangedSymbols;
    timer(1000).subscribe(() => this.changedSymbols = {});
  }

  protected isTickerChanged(a: Ticker, b: Ticker): boolean {
    return a.lastPrice !== b.lastPrice || a.priceChangePercent !== b.priceChangePercent;
  }
}

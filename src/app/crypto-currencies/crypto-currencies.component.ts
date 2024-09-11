import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription, timer } from 'rxjs';

import { BinanceService } from './binance.service';
import { SpinnerComponent } from '../spinner/spinner.component';

import { Ticker } from './binance.types';
import { ErrorMessageComponent } from '../error-message/error-message.component';
import { defaultFilters, FilterModalComponent } from './filter-modal/filter-modal.component';
import { TickerFilters } from './crypto-currencies.types';

@Component({
  selector: 'app-crypto-currencies',
  templateUrl: './crypto-currencies.component.html',
  standalone: true,
  imports: [CommonModule, SpinnerComponent, ErrorMessageComponent, FilterModalComponent],
})
export class CryptoCurrenciesComponent implements OnInit, OnDestroy {
  public filteredData: any[] = [];
  public changedSymbols: Record<string, boolean> = {}
  public loading = true;

  protected dataRaw: Ticker[] = [];
  protected activeFilters: TickerFilters = defaultFilters;
  protected tickerSubscription?: Subscription;
  protected errorMessage = '';

  constructor(private binanceService: BinanceService) {}

  @ViewChild(FilterModalComponent) filterModal: FilterModalComponent | null = null;

  ngOnInit(): void {
    this.tickerSubscription = this.binanceService.getPeriodicDailyTickersData().subscribe({
      next: (data) => this.data = data,
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

  public get data(): Ticker[] {
    const filters = this.activeFilters;
    return this.dataRaw.filter(item => (
      (filters.minVolume == null || Number(item.volume) >= filters.minVolume) &&
      (filters.maxVolume == null || Number(item.volume) <= filters.maxVolume) &&
      (filters.minPriceChange == null || Number(item.priceChangePercent) >= filters.minPriceChange) &&
      (filters.maxPriceChange == null || Number(item.priceChangePercent) <= filters.maxPriceChange) &&
      (filters.minPrice == null || Number(item.lastPrice) >= filters.minPrice) &&
      (filters.maxPrice == null || Number(item.lastPrice) <= filters.maxPrice)
    ));
  }

  public set data(data: Ticker[]) {
    const filteredData = data.filter(crypto => crypto.symbol.endsWith('USDT'));
    if (this.dataRaw.length) {
      this.applyDataChanges(data)
    } else {
      this.dataRaw = filteredData;
      this.loading = false;
    }
  }

  openFilterModal() {
    this.filterModal?.openModal();
  }

  applyFilters(filters: TickerFilters) {
    this.activeFilters = filters;
  }

  protected applyDataChanges(newData: Ticker[]): void {
    const updatedChangedSymbols: Record<string, boolean> = {}
    for (let i = 0; i < newData.length; i++) {
      const ticker = newData[i];
      const existingTicketIndex = this.dataRaw.findIndex(item => item.symbol === ticker.symbol);
      const existingTicket = this.dataRaw[existingTicketIndex];
      if (!existingTicket || !this.isTickerChanged(ticker, existingTicket)) {
        continue; // Pass if no changes
      }
      this.dataRaw[existingTicketIndex] = { ...ticker }
      updatedChangedSymbols[ticker.symbol] = true;
    }
    this.changedSymbols = updatedChangedSymbols;
    timer(1000).subscribe(() => this.changedSymbols = {});
  }

  protected isTickerChanged(a: Ticker, b: Ticker): boolean {
    return a.lastPrice !== b.lastPrice || a.priceChangePercent !== b.priceChangePercent;
  }
}

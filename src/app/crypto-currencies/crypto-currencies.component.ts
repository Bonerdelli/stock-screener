import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BinanceService } from './binance.service';
import { SpinnerComponent } from '../spinner/spinner.component';
import { Subscription } from 'rxjs';
import { Ticker } from './binance.types';

@Component({
  selector: 'crypto-currencies',
  templateUrl: './crypto-currencies.component.html',
  standalone: true,
  imports: [CommonModule, SpinnerComponent],
})
export class CryptoCurrenciesComponent implements OnInit, OnDestroy {
  public filteredData: any[] = [];
  public loading = true;
  private dataRaw: Ticker[] = [];
  private tickerSubscription?: Subscription;

  constructor(private binanceService: BinanceService) {}

  ngOnInit(): void {
    this.tickerSubscription = this.binanceService.getPeriodicTickerData().subscribe({
      next: (data) => this.data = data,
      error: (err) => console.error('Error fetching tickers data:', err)
    });
  }

  ngOnDestroy(): void {
    this.tickerSubscription?.unsubscribe();
  }

  public get data(): Ticker[] {
    return this.dataRaw.filter(item => Boolean(item)); // TODO: make filterable
  }

  public set data(data: Ticker[]) {
    const filteredData = data.filter(crypto => crypto.symbol.includes('USDT'));
    if (this.dataRaw?.length) {
      this.dataRaw = filteredData;
    }
  }
}

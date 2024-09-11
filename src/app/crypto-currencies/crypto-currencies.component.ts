import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BinanceService } from './binance.service';
import { SpinnerComponent } from '../spinner/spinner.component';
import { Subscription } from 'rxjs';
import { Ticker } from './binance.types';
import { ErrorMessageComponent } from '../error-message/error-message.component';

@Component({
  selector: 'app-crypto-currencies',
  templateUrl: './crypto-currencies.component.html',
  standalone: true,
  imports: [CommonModule, SpinnerComponent, ErrorMessageComponent],
})
export class CryptoCurrenciesComponent implements OnInit, OnDestroy {
  public filteredData: any[] = [];
  public loading = true;
  private dataRaw: Ticker[] = [];
  private tickerSubscription?: Subscription;
  protected errorMessage: string = '';

  constructor(private binanceService: BinanceService) {}

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
    return this.dataRaw.filter(item => Boolean(item)); // TODO: make filterable
  }

  public set data(data: Ticker[]) {
    const filteredData = data.filter(crypto => crypto.symbol.endsWith('USDT'));
    this.dataRaw = filteredData;
    this.loading = false;
  }

  private applyDataChanges(data: Ticker) {

  }
}

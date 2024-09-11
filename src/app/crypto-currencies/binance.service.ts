import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, timer } from 'rxjs';
import { Ticker } from './binance.types';

@Injectable({
  providedIn: 'root'
})
export class BinanceService {
  private baseUrl = 'https://api.binance.com/api/v3';
  private updatePeriodMs = 5000 // in milliseconds

  constructor(private http: HttpClient) {}

  getDailyTickersData(): Observable<Ticker[]> {
    const url = `${this.baseUrl}/ticker/24hr?type=MINI`
    return this.http.get<Ticker[]>(url);
  }

  getTickerData(): Observable<Ticker[]> {
    const url = `${this.baseUrl}/ticker?type=MINI`;
    return this.http.get<Ticker[]>(url);
  }

  getPeriodicTickerData(
    intervalMs: number = this.updatePeriodMs,
  ): Observable<Ticker[]> {
    return timer(0, intervalMs).pipe(
      switchMap(() => this.getTickerData())
    );
  }

}

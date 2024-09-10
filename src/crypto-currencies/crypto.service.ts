import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  private baseUrl = 'https://api.binance.com/api/v3';

  constructor(private http: HttpClient) {}

  getTickers(): Observable<any> { // TODO: typings
    return this.http.get(`${this.baseUrl}/ticker/24hr`);
  }
}

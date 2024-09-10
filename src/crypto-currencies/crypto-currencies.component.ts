import { Component, OnInit } from '@angular/core';
import { CryptoService } from './crypto.service';

@Component({
  selector: 'crypto-currencies',
  templateUrl: './crypto-currencies.component.html'
})
export class CryptoCurrenciesComponent implements OnInit {
  data: any[] = []; // TODO: make typings
  filteredData: any[] = [];

  constructor(private cryptoService: CryptoService) {}

  ngOnInit(): void {
    this.cryptoService.getTickers().subscribe((data: any[]) => {
      this.data = data.filter(crypto => crypto.symbol.endsWith('USDT'));
      console.log('CryptoCurrencies: data', this.data)
      this.applyFilters();
    });
  }

  applyFilters(): void {
    this.filteredData = this.data.filter(item => Boolean(item)); // TODO: make filterable
  }
}

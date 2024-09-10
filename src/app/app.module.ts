import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CryptoCurrenciesComponent } from '../crypto-currencies';

@NgModule({
  declarations: [CryptoCurrenciesComponent],
  imports: [AppComponent, BrowserModule],
  providers: [],
})
export class AppModule { }

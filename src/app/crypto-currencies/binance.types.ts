export interface Ticker {
  symbol: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  lastPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: number; // UNIX timestamp
  closeTime: number; // UNIX timestamp
  firstId: number;
  lastId: number;
  count: number;
}

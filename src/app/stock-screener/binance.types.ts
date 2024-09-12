export interface Ticker {
  symbol: string
  priceChange: string
  priceChangePercent: string
  weightedAvgPrice: string
  prevClosePrice: string
  lastPrice: string
  lastQty: string
  bidPrice: string
  bidQty: string
  askPrice: string
  askQty: string
  openPrice: string
  highPrice: string
  lowPrice: string
  volume: string
  quoteVolume: string
  openTime: number; // UNIX timestamp
  closeTime: number; // UNIX timestamp
  firstId: number;
  lastId: number;
  count: number;
}

export interface TickerMini {
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

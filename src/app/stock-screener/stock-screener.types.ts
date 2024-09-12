export interface TickerFilters {
  minVolume: number | null;
  maxVolume: number | null;
  minPriceChange: number | null;
  maxPriceChange: number | null;
  minPrice: number | null;
  maxPrice: number | null;
}

export interface TickerDto {
  symbol: string;
  lastPrice: number;
  priceChangePercent: number;
  prevClosePrice: number;
  openPrice: number;
  volume: number;
}

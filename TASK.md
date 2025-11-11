Create a single-page Angular stock screener.
 
* It should display a list/table of cryptocurrencies matching a set of filters configured via dialog window

* Only include pairs with USDT as a base currency (e.g. include BTCUSDT, SOLUSDT but not ETHBTC, SOLUSDC)
 
* Required filters (time window is 24h):
  - Min/max trade volume in USDT (USD)
  - Min/max price change percentage
  - Min/max price range
 
* It is expected for filters to be applied locally and not rely on API calls for every change
 
* Each displayed item should contain a column with the current price updated in real time (<10s delay)
 
* Page should be properly displayed in both desktop and mobile browsers (recent Google Chrome version)
 
* Optional stretch goal - display a line chart with 24h price history on item click
 
All required data is available via Binance public API. https://developers.binance.com/docs/binance-spot-api-docs/faqs/market_data_only
 
Solution is expected in the form of a github repository and a running version on github pages (or any other static hosting).
 
There are no specific requirements on design/layout nor on testing, it is allowed to use any publicly available libraries. However, please consider how the user would interact with this application.
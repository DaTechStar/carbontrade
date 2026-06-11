"use client"

import { TickerTape as TradingViewTickerTape } from "react-ts-tradingview-widgets"

export function TickerTape() {
  return (
    <div className="flex h-[46px] w-full items-center overflow-hidden border-b border-border/10 bg-chart-bg [&_.tradingview-widget-copyright]:!hidden">
      <TradingViewTickerTape
        colorTheme="dark"
        displayMode="adaptive"
        showSymbolLogo={true}
        isTransparent={false}
        symbols={[
          { proName: "FOREXCOM:SPXUSD", title: "S&P 500" },
          { proName: "FOREXCOM:NSXUSD", title: "US 100" },
          { proName: "FX_IDC:EURUSD", title: "EUR to USD" },
          { proName: "BITSTAMP:BTCUSD", title: "Bitcoin" },
          { proName: "BITSTAMP:ETHUSD", title: "Ethereum" },
          { proName: "NASDAQ:AMZN", title: "Amazon" },
          { proName: "NASDAQ:META", title: "Meta" },
          { proName: "NASDAQ:NFLX", title: "Netflix" },
          { proName: "NASDAQ:TSLA", title: "Tesla" },
        ]}
      />
    </div>
  )
}

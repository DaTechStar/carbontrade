"use client"

import { MarketChart } from "@/components/shared/market-chart"
import { motion } from "framer-motion"
import { useLanguage } from "@/lib/i18n/context"

export function MarketTabs() {
  const { t } = useLanguage()

  return (
    <section className="relative overflow-hidden border-t border-border/10 bg-background py-24">
      <div className="pointer-events-none absolute top-1/4 right-1/4 h-[600px] w-[600px] rounded-full bg-secondary/5 blur-[120px]" />

      <div className="relative z-10 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <h2 className="mb-4 text-3xl font-bold md:text-5xl">
            {t("landing.marketTabs.title1")}{" "}
            <span className="text-gradient">
              {t("landing.marketTabs.title2")}
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            {t("landing.marketTabs.description")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-card relative mx-auto h-[600px] w-full max-w-5xl overflow-hidden rounded-2xl border border-border/20 shadow-2xl"
        >
          <div className="absolute inset-0 -z-10 bg-chart-bg" />
          <MarketChart
            type="overview"
            theme="dark"
            height="100%"
            width="100%"
            showFloatingTooltip={true}
            showSymbolLogo={true}
            isTransparent={false}
            overviewTabs={[
              {
                title: "Share CFDs",
                symbols: [
                  { s: "NASDAQ:META", d: "Meta" },
                  { s: "NASDAQ:NFLX", d: "Netflix" },
                  { s: "NASDAQ:AMZN", d: "Amazon" },
                  { s: "NASDAQ:TSLA", d: "Tesla" },
                  { s: "NASDAQ:AAPL", d: "Apple" },
                ],
                originalTitle: "Share CFDs",
              },
              {
                title: "Crypto",
                symbols: [
                  { s: "BINANCE:BTCUSD", d: "Bitcoin" },
                  { s: "BINANCE:ETHUSD", d: "Ethereum" },
                  { s: "BINANCE:SOLUSD", d: "Solana" },
                  { s: "BINANCE:XRPUSD", d: "Ripple" },
                  { s: "BINANCE:BNBUSD", d: "Binance Coin" },
                ],
                originalTitle: "Crypto",
              },
              {
                title: "Forex",
                symbols: [
                  { s: "FX:EURUSD", d: "EUR/USD" },
                  { s: "FX:GBPUSD", d: "GBP/USD" },
                  { s: "FX:USDJPY", d: "USD/JPY" },
                  { s: "FX:USDCHF", d: "USD/CHF" },
                  { s: "FX:AUDUSD", d: "AUD/USD" },
                ],
                originalTitle: "Forex",
              },
              {
                title: "Indices",
                symbols: [
                  { s: "FOREXCOM:SPXUSD", d: "S&P 500" },
                  { s: "FOREXCOM:NSXUSD", d: "US 100" },
                  { s: "FOREXCOM:DJI", d: "Dow Jones" },
                  { s: "INDEX:NKY", d: "Nikkei 225" },
                  { s: "INDEX:DEU40", d: "DAX Index" },
                ],
                originalTitle: "Indices",
              },
              {
                title: "Commodities",
                symbols: [
                  { s: "OANDA:XAUUSD", d: "Gold" },
                  { s: "OANDA:XAGUSD", d: "Silver" },
                  { s: "TVC:USOIL", d: "Crude Oil" },
                  { s: "TVC:UKOIL", d: "Brent Oil" },
                  { s: "OANDA:XCUUSD", d: "Copper" },
                ],
                originalTitle: "Commodities",
              },
            ]}
          />
        </motion.div>
      </div>
    </section>
  )
}

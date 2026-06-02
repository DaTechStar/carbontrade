"use client";

import { MarketChart } from "@/components/shared/market-chart";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/context";

export function MarketTabs() {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-background relative border-t border-border/10 overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            {t("landing.marketTabs.title1")} <span className="text-gradient">{t("landing.marketTabs.title2")}</span>
          </h2>
          <p className="text-lg text-muted-foreground">{t("landing.marketTabs.description")}</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-5xl mx-auto h-[600px] rounded-2xl overflow-hidden glass-card border border-border/20 shadow-2xl relative"
        >
          <div className="absolute inset-0 bg-[#131722] -z-10" />
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
                  { s: "NASDAQ:AAPL", d: "Apple" }
                ],
                originalTitle: "Share CFDs"
              },
              {
                title: "Crypto",
                symbols: [
                  { s: "BINANCE:BTCUSD", d: "Bitcoin" },
                  { s: "BINANCE:ETHUSD", d: "Ethereum" },
                  { s: "BINANCE:SOLUSD", d: "Solana" },
                  { s: "BINANCE:XRPUSD", d: "Ripple" },
                  { s: "BINANCE:BNBUSD", d: "Binance Coin" }
                ],
                originalTitle: "Crypto"
              },
              {
                title: "Forex",
                symbols: [
                  { s: "FX:EURUSD", d: "EUR/USD" },
                  { s: "FX:GBPUSD", d: "GBP/USD" },
                  { s: "FX:USDJPY", d: "USD/JPY" },
                  { s: "FX:USDCHF", d: "USD/CHF" },
                  { s: "FX:AUDUSD", d: "AUD/USD" }
                ],
                originalTitle: "Forex"
              },
              {
                title: "Indices",
                symbols: [
                  { s: "FOREXCOM:SPXUSD", d: "S&P 500" },
                  { s: "FOREXCOM:NSXUSD", d: "US 100" },
                  { s: "FOREXCOM:DJI", d: "Dow Jones" },
                  { s: "INDEX:NKY", d: "Nikkei 225" },
                  { s: "INDEX:DEU40", d: "DAX Index" }
                ],
                originalTitle: "Indices"
              },
              {
                title: "Commodities",
                symbols: [
                  { s: "OANDA:XAUUSD", d: "Gold" },
                  { s: "OANDA:XAGUSD", d: "Silver" },
                  { s: "TVC:USOIL", d: "Crude Oil" },
                  { s: "TVC:UKOIL", d: "Brent Oil" },
                  { s: "OANDA:XCUUSD", d: "Copper" }
                ],
                originalTitle: "Commodities"
              }
            ]}
          />
        </motion.div>

      </div>
    </section>
  );
}

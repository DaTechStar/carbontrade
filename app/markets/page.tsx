"use client";

import React from "react";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { MarketChart } from "@/components/shared/market-chart";
import { useLanguage } from "@/lib/i18n/context";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Globe, 
  ArrowRight, 
  Coins, 
  TrendingUp, 
  Activity, 
  CheckCircle2, 
  Briefcase,
  Flame,
  Award
} from "lucide-react";

export default function MarketsPage() {
  const { t } = useLanguage();

  return (
    <main translate="no" className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-xs font-semibold text-secondary mb-6">
              <Globe className="w-4 h-4 text-secondary animate-pulse" />
              {t("markets.hero.badge")}
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-[1.05]">
              <span>{t("markets.hero.title1")}</span> <br />
              <span className="text-gradient">{t("markets.hero.title2")}</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              {t("markets.hero.desc")}
            </p>

            <div className="flex justify-center gap-4">
              <Button size="lg" className="h-13 px-8 bg-primary hover:bg-primary/95 text-primary-foreground font-bold rounded-2xl transition-all hover:scale-105 active:scale-95">
                {t("markets.hero.cta")}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Dynamic Asset Classes Cards (Forex, Crypto, Indices, Stocks, Commodities) */}
      <section className="py-20 relative bg-black/20 border-t border-border/10">
        <div className="container mx-auto px-4">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">{t("markets.assets.title")}</h2>
            <p className="text-muted-foreground">
              {t("markets.assets.desc")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: t("markets.cards.forex.title"),
                desc: t("markets.cards.forex.desc"),
                leverage: t("markets.cards.forex.leverage"),
                spreads: t("markets.cards.forex.spreads"),
                instruments: t("markets.cards.forex.instruments"),
                icon: Coins,
                color: "text-primary"
              },
              {
                title: t("markets.cards.crypto.title"),
                desc: t("markets.cards.crypto.desc"),
                leverage: t("markets.cards.crypto.leverage"),
                spreads: t("markets.cards.crypto.spreads"),
                instruments: t("markets.cards.crypto.instruments"),
                icon: Flame,
                color: "text-secondary"
              },
              {
                title: t("markets.cards.indices.title"),
                desc: t("markets.cards.indices.desc"),
                leverage: t("markets.cards.indices.leverage"),
                spreads: t("markets.cards.indices.spreads"),
                instruments: t("markets.cards.indices.instruments"),
                icon: TrendingUp,
                color: "text-emerald-400"
              },
              {
                title: t("markets.cards.stocks.title"),
                desc: t("markets.cards.stocks.desc"),
                leverage: t("markets.cards.stocks.leverage"),
                spreads: t("markets.cards.stocks.spreads"),
                instruments: t("markets.cards.stocks.instruments"),
                icon: Briefcase,
                color: "text-white"
              },
              {
                title: t("markets.cards.commodities.title"),
                desc: t("markets.cards.commodities.desc"),
                leverage: t("markets.cards.commodities.leverage"),
                spreads: t("markets.cards.commodities.spreads"),
                instruments: t("markets.cards.commodities.instruments"),
                icon: Award,
                color: "text-yellow-500"
              }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05, duration: 0.5 }}
                  whileHover={{ y: -6 }}
                  className="glass-card p-8 rounded-3xl border border-white/5 relative overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <div className={`p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center ${item.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] uppercase tracking-widest font-black text-zinc-500">{item.leverage}</span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed mb-6">{item.desc}</p>
                  </div>

                  <div className="border-t border-white/5 pt-4 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-500 font-semibold">{t("markets.labels.pricing")}</span>
                      <span className="font-bold text-white">{item.spreads}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-500 font-semibold">{t("markets.labels.highlighted")}</span>
                      <span className="font-bold text-zinc-300">{item.instruments}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Live Market Quote Tab Previewer */}
      <section className="py-20 relative border-t border-border/10">
        <div className="container mx-auto px-4 max-w-5xl">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">{t("markets.quoteFeeds.title")}</h2>
            <p className="text-muted-foreground text-sm">
              {t("markets.quoteFeeds.desc")}
            </p>
          </div>

          <div className="w-full h-[600px] rounded-3xl overflow-hidden glass-card border border-border/20 shadow-2xl relative">
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
                  title: t("markets.labels.crypto"),
                  symbols: [
                    { s: "BINANCE:BTCUSD", d: "Bitcoin" },
                    { s: "BINANCE:ETHUSD", d: "Ethereum" },
                    { s: "BINANCE:SOLUSD", d: "Solana" },
                    { s: "BINANCE:XRPUSD", d: "Ripple" }
                  ],
                  originalTitle: "Crypto"
                },
                {
                  title: t("markets.labels.forex"),
                  symbols: [
                    { s: "FX:EURUSD", d: "EUR/USD" },
                    { s: "FX:GBPUSD", d: "GBP/USD" },
                    { s: "FX:USDJPY", d: "USD/JPY" },
                    { s: "FX:USDCHF", d: "USD/CHF" }
                  ],
                  originalTitle: "Forex"
                },
                {
                  title: t("markets.labels.commodities"),
                  symbols: [
                    { s: "OANDA:XAUUSD", d: "Gold Spot" },
                    { s: "OANDA:XAGUSD", d: "Silver Spot" },
                    { s: "TVC:USOIL", d: "Crude Oil" }
                  ],
                  originalTitle: "Commodities"
                }
              ]}
            />
          </div>

        </div>
      </section>

      {/* Prime Brokerage Infrastructure details */}
      <section className="py-20 bg-zinc-950 border-t border-border/10">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl font-black mb-6">{t("markets.safety.title")}</h2>
          <p className="text-zinc-400 text-sm max-w-xl mx-auto leading-relaxed mb-8">
            {t("markets.safety.desc")}
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            {[
              t("markets.labels.segregated"),
              t("markets.labels.protection"),
              t("markets.labels.vaults")
            ].map((text, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                <span className="text-xs font-bold text-white">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

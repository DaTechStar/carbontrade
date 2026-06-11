"use client"

import React from "react"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { MarketChart } from "@/components/shared/market-chart"
import { useLanguage } from "@/lib/i18n/context"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Globe,
  ArrowRight,
  Coins,
  TrendingUp,
  Activity,
  CheckCircle2,
  Briefcase,
  Flame,
  Award,
} from "lucide-react"

export default function MarketsPage() {
  const { t } = useLanguage()

  return (
    <main
      translate="no"
      className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary"
    >
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="pointer-events-none absolute top-0 right-1/4 h-[600px] w-[600px] rounded-full bg-secondary/5 blur-[100px]" />
        <div className="pointer-events-none absolute top-1/3 left-1/4 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[120px]" />

        <div className="relative z-10 container mx-auto max-w-4xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-secondary/20 bg-secondary/10 px-3.5 py-1.5 text-xs font-semibold text-secondary">
              <Globe className="h-4 w-4 animate-pulse text-secondary" />
              {t("markets.hero.badge")}
            </div>

            <h1 className="mb-6 text-5xl leading-[1.05] font-black tracking-tight md:text-7xl">
              <span>{t("markets.hero.title1")}</span> <br />
              <span className="text-gradient">{t("markets.hero.title2")}</span>
            </h1>

            <p className="mx-auto mb-8 max-w-2xl text-xl leading-relaxed text-muted-foreground">
              {t("markets.hero.desc")}
            </p>

            <div className="flex justify-center gap-4">
              <Button
                size="lg"
                asChild
                className="h-13 rounded-2xl bg-primary px-8 font-bold text-primary-foreground transition-all hover:scale-105 hover:bg-primary/95 active:scale-95"
              >
                <Link href="/register">
                  {t("markets.hero.cta")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Dynamic Asset Classes Cards (Forex, Crypto, Indices, Stocks, Commodities) */}
      <section className="relative border-t border-border/10 bg-black/20 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-5xl">
              {t("markets.assets.title")}
            </h2>
            <p className="text-muted-foreground">{t("markets.assets.desc")}</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: t("markets.cards.forex.title"),
                desc: t("markets.cards.forex.desc"),
                leverage: t("markets.cards.forex.leverage"),
                spreads: t("markets.cards.forex.spreads"),
                instruments: t("markets.cards.forex.instruments"),
                icon: Coins,
                color: "text-primary",
              },
              {
                title: t("markets.cards.crypto.title"),
                desc: t("markets.cards.crypto.desc"),
                leverage: t("markets.cards.crypto.leverage"),
                spreads: t("markets.cards.crypto.spreads"),
                instruments: t("markets.cards.crypto.instruments"),
                icon: Flame,
                color: "text-secondary",
              },
              {
                title: t("markets.cards.indices.title"),
                desc: t("markets.cards.indices.desc"),
                leverage: t("markets.cards.indices.leverage"),
                spreads: t("markets.cards.indices.spreads"),
                instruments: t("markets.cards.indices.instruments"),
                icon: TrendingUp,
                color: "text-emerald-400",
              },
              {
                title: t("markets.cards.stocks.title"),
                desc: t("markets.cards.stocks.desc"),
                leverage: t("markets.cards.stocks.leverage"),
                spreads: t("markets.cards.stocks.spreads"),
                instruments: t("markets.cards.stocks.instruments"),
                icon: Briefcase,
                color: "text-white",
              },
              {
                title: t("markets.cards.commodities.title"),
                desc: t("markets.cards.commodities.desc"),
                leverage: t("markets.cards.commodities.leverage"),
                spreads: t("markets.cards.commodities.spreads"),
                instruments: t("markets.cards.commodities.instruments"),
                icon: Award,
                color: "text-yellow-500",
              },
            ].map((item, idx) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05, duration: 0.5 }}
                  whileHover={{ y: -6 }}
                  className="glass-card relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/5 p-8"
                >
                  <div>
                    <div className="mb-6 flex items-start justify-between">
                      <div
                        className={`flex items-center justify-center rounded-2xl border border-white/5 bg-white/5 p-3 ${item.color}`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="text-[10px] font-black tracking-widest text-zinc-500 uppercase">
                        {item.leverage}
                      </span>
                    </div>

                    <h3 className="mb-2 text-xl font-bold text-foreground">
                      {item.title}
                    </h3>
                    <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                      {item.desc}
                    </p>
                  </div>

                  <div className="space-y-2 border-t border-white/5 pt-4">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-muted-foreground">
                        {t("markets.labels.pricing")}
                      </span>
                      <span className="font-bold text-foreground">
                        {item.spreads}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-muted-foreground">
                        {t("markets.labels.highlighted")}
                      </span>
                      <span className="font-bold text-muted-foreground/80">
                        {item.instruments}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Live Market Quote Tab Previewer */}
      <section className="relative border-t border-border/10 py-20">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-5xl">
              {t("markets.quoteFeeds.title")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t("markets.quoteFeeds.desc")}
            </p>
          </div>

          <div className="glass-card relative h-[600px] w-full overflow-hidden rounded-3xl border border-border/20 shadow-2xl">
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
                  title: t("markets.labels.crypto"),
                  symbols: [
                    { s: "BINANCE:BTCUSD", d: "Bitcoin" },
                    { s: "BINANCE:ETHUSD", d: "Ethereum" },
                    { s: "BINANCE:SOLUSD", d: "Solana" },
                    { s: "BINANCE:XRPUSD", d: "Ripple" },
                  ],
                  originalTitle: "Crypto",
                },
                {
                  title: t("markets.labels.forex"),
                  symbols: [
                    { s: "FX:EURUSD", d: "EUR/USD" },
                    { s: "FX:GBPUSD", d: "GBP/USD" },
                    { s: "FX:USDJPY", d: "USD/JPY" },
                    { s: "FX:USDCHF", d: "USD/CHF" },
                  ],
                  originalTitle: "Forex",
                },
                {
                  title: t("markets.labels.commodities"),
                  symbols: [
                    { s: "OANDA:XAUUSD", d: "Gold Spot" },
                    { s: "OANDA:XAGUSD", d: "Silver Spot" },
                    { s: "TVC:USOIL", d: "Crude Oil" },
                  ],
                  originalTitle: "Commodities",
                },
              ]}
            />
          </div>
        </div>
      </section>

      {/* Prime Brokerage Infrastructure details */}
      <section className="border-t border-border/10 bg-card py-20">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-6 text-3xl font-black">
            {t("markets.safety.title")}
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-sm leading-relaxed text-muted-foreground">
            {t("markets.safety.desc")}
          </p>

          <div className="grid grid-cols-1 gap-6 text-left sm:grid-cols-3">
            {[
              t("markets.labels.segregated"),
              t("markets.labels.protection"),
              t("markets.labels.vaults"),
            ].map((text, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-4"
              >
                <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                <span className="text-xs font-bold text-foreground">
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

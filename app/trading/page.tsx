"use client"

import React, { useState, useEffect } from "react"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { MarketChart } from "@/components/shared/market-chart"
import { useLanguage } from "@/lib/i18n/context"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  Zap,
  Activity,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  Layers,
  Cpu,
  Server,
  Sparkles,
} from "lucide-react"

export default function TradingPage() {
  const { t } = useLanguage()
  const [chartSymbol, setChartSymbol] = useState("BINANCE:BTCUSD")
  const [activeSpreadTab, setActiveSpreadTab] = useState<"standard" | "ecn">(
    "ecn"
  )

  return (
    <main
      translate="no"
      className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary"
    >
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="pointer-events-none absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[100px]" />
        <div className="pointer-events-none absolute top-1/3 right-1/4 h-[400px] w-[400px] rounded-full bg-secondary/5 blur-[120px]" />

        <div className="relative z-10 container mx-auto max-w-4xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary">
              <Cpu className="h-4 w-4 animate-pulse" />
              {t("trading.hero.badge")}
            </div>

            <h1 className="mb-6 text-5xl leading-[1.05] font-black tracking-tight md:text-7xl">
              <span>{t("trading.hero.title1")}</span> <br />
              <span className="text-gradient">{t("trading.hero.title2")}</span>
            </h1>

            <p className="mx-auto mb-8 max-w-2xl text-xl leading-relaxed text-muted-foreground">
              {t("trading.hero.desc")}
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                asChild
                className="h-13 w-full rounded-2xl bg-primary px-8 text-base font-bold text-primary-foreground transition-all hover:scale-105 hover:bg-primary/95 active:scale-95 sm:w-auto"
              >
                <Link href="/register">
                  {t("trading.hero.cta1")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-13 w-full rounded-2xl border-white/10 px-8 text-base font-bold hover:bg-white/5 sm:w-auto"
              >
                {t("trading.hero.cta2")}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Latency Comparison Visual Showcase */}
      <section className="relative border-t border-border/10 bg-black/20 py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            {/* Visual speed timelines */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="glass-card relative overflow-hidden rounded-[2rem] border border-white/5 p-8"
            >
              <div className="pointer-events-none absolute top-0 right-0 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />

              <h3 className="mb-8 flex items-center gap-2 text-2xl font-bold">
                <Server className="h-6 w-6 text-primary" />
                {t("trading.latency.title")}
              </h3>

              <div className="space-y-8">
                {/* CarbonTrade Metric */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-sm font-bold text-white">
                      <Sparkles className="h-4 w-4 animate-pulse text-primary" />
                      {t("trading.latency.carbonTitle")}
                    </span>
                    <span className="animate-pulse text-sm font-black text-primary">
                      {t("trading.latency.carbonDesc")}
                    </span>
                  </div>
                  <div className="h-3.5 w-full overflow-hidden rounded-full border border-border/10 bg-muted p-0.5">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "2%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="h-full rounded-full bg-gradient-to-r from-primary to-secondary shadow-[0_0_10px_rgba(52,211,153,0.5)]"
                    />
                  </div>
                  <span className="mt-1 block text-[10px] text-muted-foreground">
                    {t("trading.latency.carbonSub")}
                  </span>
                </div>

                {/* Legacy Retail Broker Metric */}
                <div className="opacity-60">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-bold text-muted-foreground">
                      {t("trading.latency.legacyTitle")}
                    </span>
                    <span className="text-sm font-bold text-muted-foreground">
                      {t("trading.latency.legacyDesc")}
                    </span>
                  </div>
                  <div className="h-3.5 w-full overflow-hidden rounded-full border border-border/10 bg-muted p-0.5">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "95%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, delay: 0.4 }}
                      className="h-full rounded-full bg-muted-foreground/40"
                    />
                  </div>
                  <span className="mt-1 block text-[10px] text-muted-foreground">
                    {t("trading.latency.legacySub")}
                  </span>
                </div>
              </div>

              <div className="mt-8 rounded-2xl border border-white/5 bg-white/5 p-4 text-xs leading-relaxed text-muted-foreground">
                <strong>{t("trading.latency.noteTitle")}</strong>{" "}
                {t("trading.latency.noteDesc")}
              </div>
            </motion.div>

            {/* Explanation Pitch */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:pl-6"
            >
              <span className="mb-2 block text-xs font-black tracking-widest text-secondary uppercase">
                {t("trading.requotes.badge")}
              </span>
              <h2 className="mb-6 text-3xl font-bold md:text-5xl">
                {t("trading.requotes.title1")}{" "}
                <span className="text-gradient">
                  {t("trading.requotes.title2")}
                </span>
              </h2>

              <div className="space-y-6">
                {[
                  {
                    title: t("trading.requotes.step1.title"),
                    desc: t("trading.requotes.step1.desc"),
                  },
                  {
                    title: t("trading.requotes.step2.title"),
                    desc: t("trading.requotes.step2.desc"),
                  },
                  {
                    title: t("trading.requotes.step3.title"),
                    desc: t("trading.requotes.step3.desc"),
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-xs font-bold text-primary">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="mb-1 text-base font-bold text-white">
                        {item.title}
                      </h4>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Spread Comparison Matrix Showcase */}
      <section className="relative py-20">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-5xl">
              {t("trading.spreads.title1")}{" "}
              <span className="text-gradient">
                {t("trading.spreads.title2")}
              </span>
            </h2>
            <p className="text-muted-foreground">{t("trading.spreads.desc")}</p>
          </div>

          {/* Interactive spread box */}
          <div className="glass-card relative overflow-hidden rounded-[2.5rem] border border-white/5 shadow-2xl">
            {/* Header Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/10 bg-card p-4">
              <span className="pl-4 text-xs font-black tracking-widest text-muted-foreground uppercase">
                {t("trading.spreads.badge")}
              </span>
              <div className="flex gap-2 rounded-xl border border-white/10 bg-white/5 p-1">
                <button
                  onClick={() => setActiveSpreadTab("ecn")}
                  className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all ${
                    activeSpreadTab === "ecn"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {t("trading.spreads.ecnTab")}
                </button>
                <button
                  onClick={() => setActiveSpreadTab("standard")}
                  className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all ${
                    activeSpreadTab === "standard"
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {t("trading.spreads.legacyTab")}
                </button>
              </div>
            </div>

            {/* List */}
            <div className="divide-y divide-white/5">
              {[
                {
                  asset: t("trading.spreads.eurusd.asset"),
                  standard: t("trading.spreads.eurusd.standard"),
                  ecn: t("trading.spreads.eurusd.ecn"),
                  cost: t("trading.spreads.eurusd.cost"),
                  ecnCost: t("trading.spreads.eurusd.ecnCost"),
                  note: t("trading.spreads.eurusd.note"),
                },
                {
                  asset: t("trading.spreads.btc.asset"),
                  standard: t("trading.spreads.btc.standard"),
                  ecn: t("trading.spreads.btc.ecn"),
                  cost: t("trading.spreads.btc.cost"),
                  ecnCost: t("trading.spreads.btc.ecnCost"),
                  note: t("trading.spreads.btc.note"),
                },
                {
                  asset: t("trading.spreads.gold.asset"),
                  standard: t("trading.spreads.gold.standard"),
                  ecn: t("trading.spreads.gold.ecn"),
                  cost: t("trading.spreads.gold.cost"),
                  ecnCost: t("trading.spreads.gold.ecnCost"),
                  note: t("trading.spreads.gold.note"),
                },
                {
                  asset: t("trading.spreads.us100.asset"),
                  standard: t("trading.spreads.us100.standard"),
                  ecn: t("trading.spreads.us100.ecn"),
                  cost: t("trading.spreads.us100.cost"),
                  ecnCost: t("trading.spreads.us100.ecnCost"),
                  note: t("trading.spreads.us100.note"),
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 items-center gap-4 p-6 transition-colors hover:bg-white/5 md:grid-cols-4"
                >
                  <div className="font-bold text-white">{item.asset}</div>

                  <div>
                    <span className="mb-0.5 block text-xs tracking-widest text-zinc-500 uppercase">
                      {t("trading.spreads.avgSpread")}
                    </span>
                    <span
                      className={`text-sm font-bold ${activeSpreadTab === "ecn" ? "text-primary" : "text-muted-foreground"}`}
                    >
                      {activeSpreadTab === "ecn" ? item.ecn : item.standard}
                    </span>
                  </div>

                  <div>
                    <span className="mb-0.5 block text-xs tracking-widest text-zinc-500 uppercase">
                      {t("trading.spreads.feePerLot")}
                    </span>
                    <span
                      className={`text-sm font-bold ${activeSpreadTab === "ecn" ? "text-profit" : "text-loss"}`}
                    >
                      {activeSpreadTab === "ecn" ? item.ecnCost : item.cost}
                    </span>
                  </div>

                  <div className="text-right text-xs leading-normal text-muted-foreground italic md:text-left">
                    {item.note}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="mx-auto mt-6 max-w-xl text-center text-xs leading-relaxed text-muted-foreground">
            {t("trading.spreads.disclaimer")}
          </p>
        </div>
      </section>

      {/* Live Advanced Chart Preview Showcase */}
      <section className="border-t border-border/10 bg-card py-20">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold">
              {t("trading.chart.title")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t("trading.chart.desc")}
            </p>
          </div>

          {/* Reusable Chart component */}
          <div className="relative h-[520px] overflow-hidden rounded-3xl border border-border/10 bg-chart-bg shadow-2xl">
            <div className="absolute top-4 left-4 z-20 flex gap-2">
              {[
                "BINANCE:BTCUSD",
                "FX:EURUSD",
                "OANDA:XAUUSD",
                "NASDAQ:TSLA",
              ].map((sym) => (
                <button
                  key={sym}
                  onClick={() => setChartSymbol(sym)}
                  className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all ${
                    chartSymbol === sym
                      ? "border-primary bg-primary text-primary-foreground shadow-lg"
                      : "border-border/20 bg-card/60 text-muted-foreground hover:border-border/50"
                  }`}
                >
                  {sym.split(":")[1]}
                </button>
              ))}
            </div>
            <MarketChart
              type="advanced"
              symbol={chartSymbol}
              height="100%"
              isTransparent={false}
            />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

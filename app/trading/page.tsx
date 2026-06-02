"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { MarketChart } from "@/components/shared/market-chart";
import { useLanguage } from "@/lib/i18n/context";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  Zap, 
  Activity, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight, 
  Layers, 
  Cpu, 
  Server, 
  Sparkles 
} from "lucide-react";

export default function TradingPage() {
  const { t } = useLanguage();
  const [chartSymbol, setChartSymbol] = useState("BINANCE:BTCUSD");
  const [activeSpreadTab, setActiveSpreadTab] = useState<"standard" | "ecn">("ecn");

  return (
    <main translate="no" className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary mb-6">
              <Cpu className="w-4 h-4 animate-pulse" />
              {t("trading.hero.badge")}
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-[1.05]">
              <span>{t("trading.hero.title1")}</span> <br />
              <span className="text-gradient">{t("trading.hero.title2")}</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              {t("trading.hero.desc")}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="w-full sm:w-auto text-base h-13 px-8 bg-primary hover:bg-primary/95 text-primary-foreground font-bold rounded-2xl transition-all hover:scale-105 active:scale-95">
                {t("trading.hero.cta1")}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base h-13 px-8 border-white/10 hover:bg-white/5 font-bold rounded-2xl">
                {t("trading.hero.cta2")}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Latency Comparison Visual Showcase */}
      <section className="py-20 relative border-t border-border/10 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Visual speed timelines */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="glass-card p-8 rounded-[2rem] border border-white/5 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
              
              <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
                <Server className="w-6 h-6 text-primary" />
                {t("trading.latency.title")}
              </h3>

              <div className="space-y-8">
                {/* CarbonTrade Metric */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                      {t("trading.latency.carbonTitle")}
                    </span>
                    <span className="text-sm font-black text-primary animate-pulse">{t("trading.latency.carbonDesc")}</span>
                  </div>
                  <div className="w-full h-3.5 bg-zinc-900 rounded-full overflow-hidden border border-white/5 p-0.5">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "2%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="h-full bg-gradient-to-r from-primary to-secondary rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)]"
                    />
                  </div>
                  <span className="text-[10px] text-zinc-500 mt-1 block">{t("trading.latency.carbonSub")}</span>
                </div>

                {/* Legacy Retail Broker Metric */}
                <div className="opacity-60">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-zinc-400">{t("trading.latency.legacyTitle")}</span>
                    <span className="text-sm font-bold text-zinc-400">{t("trading.latency.legacyDesc")}</span>
                  </div>
                  <div className="w-full h-3.5 bg-zinc-900 rounded-full overflow-hidden border border-white/5 p-0.5">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "95%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, delay: 0.4 }}
                      className="h-full bg-zinc-700 rounded-full"
                    />
                  </div>
                  <span className="text-[10px] text-zinc-500 mt-1 block">{t("trading.latency.legacySub")}</span>
                </div>
              </div>

              <div className="mt-8 p-4 bg-white/5 border border-white/5 rounded-2xl text-xs text-muted-foreground leading-relaxed">
                <strong>{t("trading.latency.noteTitle")}</strong> {t("trading.latency.noteDesc")}
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
              <span className="text-xs uppercase tracking-widest font-black text-secondary mb-2 block">{t("trading.requotes.badge")}</span>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                {t("trading.requotes.title1")} <span className="text-gradient">{t("trading.requotes.title2")}</span>
              </h2>
              
              <div className="space-y-6">
                {[
                  { title: t("trading.requotes.step1.title"), desc: t("trading.requotes.step1.desc") },
                  { title: t("trading.requotes.step2.title"), desc: t("trading.requotes.step2.desc") },
                  { title: t("trading.requotes.step3.title"), desc: t("trading.requotes.step3.desc") }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0 text-primary font-bold text-xs mt-1">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base mb-1">{item.title}</h4>
                      <p className="text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Spread Comparison Matrix Showcase */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4 max-w-5xl">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              {t("trading.spreads.title1")} <span className="text-gradient">{t("trading.spreads.title2")}</span>
            </h2>
            <p className="text-muted-foreground">
              {t("trading.spreads.desc")}
            </p>
          </div>

          {/* Interactive spread box */}
          <div className="glass-card rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl relative">
            
            {/* Header Tabs */}
            <div className="flex border-b border-white/5 bg-zinc-950 p-4 justify-between items-center flex-wrap gap-4">
              <span className="text-xs uppercase tracking-widest font-black text-zinc-500 pl-4">{t("trading.spreads.badge")}</span>
              <div className="flex gap-2 p-1 bg-white/5 border border-white/10 rounded-xl">
                <button
                  onClick={() => setActiveSpreadTab("ecn")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeSpreadTab === "ecn" ? "bg-primary text-primary-foreground" : "text-zinc-400"
                  }`}
                >
                  {t("trading.spreads.ecnTab")}
                </button>
                <button
                  onClick={() => setActiveSpreadTab("standard")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeSpreadTab === "standard" ? "bg-zinc-800 text-white" : "text-zinc-400"
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
                  note: t("trading.spreads.eurusd.note") 
                },
                { 
                  asset: t("trading.spreads.btc.asset"), 
                  standard: t("trading.spreads.btc.standard"), 
                  ecn: t("trading.spreads.btc.ecn"), 
                  cost: t("trading.spreads.btc.cost"), 
                  ecnCost: t("trading.spreads.btc.ecnCost"), 
                  note: t("trading.spreads.btc.note") 
                },
                { 
                  asset: t("trading.spreads.gold.asset"), 
                  standard: t("trading.spreads.gold.standard"), 
                  ecn: t("trading.spreads.gold.ecn"), 
                  cost: t("trading.spreads.gold.cost"), 
                  ecnCost: t("trading.spreads.gold.ecnCost"), 
                  note: t("trading.spreads.gold.note") 
                },
                { 
                  asset: t("trading.spreads.us100.asset"), 
                  standard: t("trading.spreads.us100.standard"), 
                  ecn: t("trading.spreads.us100.ecn"), 
                  cost: t("trading.spreads.us100.cost"), 
                  ecnCost: t("trading.spreads.us100.ecnCost"), 
                  note: t("trading.spreads.us100.note") 
                }
              ].map((item, idx) => (
                <div key={idx} className="p-6 grid grid-cols-1 md:grid-cols-4 items-center gap-4 hover:bg-white/5 transition-colors">
                  <div className="font-bold text-white">{item.asset}</div>
                  
                  <div>
                    <span className="text-xs text-zinc-500 uppercase tracking-widest block mb-0.5">{t("trading.spreads.avgSpread")}</span>
                    <span className={`text-sm font-bold ${activeSpreadTab === "ecn" ? "text-primary" : "text-zinc-400"}`}>
                      {activeSpreadTab === "ecn" ? item.ecn : item.standard}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-zinc-500 uppercase tracking-widest block mb-0.5">{t("trading.spreads.feePerLot")}</span>
                    <span className={`text-sm font-bold ${activeSpreadTab === "ecn" ? "text-emerald-400" : "text-rose-400"}`}>
                      {activeSpreadTab === "ecn" ? item.ecnCost : item.cost}
                    </span>
                  </div>

                  <div className="text-xs text-zinc-500 leading-normal italic text-right md:text-left">
                    {item.note}
                  </div>
                </div>
              ))}
            </div>

          </div>

          <p className="text-center text-xs text-zinc-500 mt-6 max-w-xl mx-auto leading-relaxed">
            {t("trading.spreads.disclaimer")}
          </p>
        </div>
      </section>

      {/* Live Advanced Chart Preview Showcase */}
      <section className="py-20 bg-zinc-950 border-t border-border/10">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">{t("trading.chart.title")}</h2>
            <p className="text-muted-foreground text-sm">
              {t("trading.chart.desc")}
            </p>
          </div>

          {/* Reusable Chart component */}
          <div className="h-[520px] rounded-3xl border border-white/10 overflow-hidden shadow-2xl bg-[#131722] relative">
            <div className="absolute top-4 left-4 z-20 flex gap-2">
              {["BINANCE:BTCUSD", "FX:EURUSD", "OANDA:XAUUSD", "NASDAQ:TSLA"].map((sym) => (
                <button
                  key={sym}
                  onClick={() => setChartSymbol(sym)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    chartSymbol === sym 
                      ? "bg-primary border-primary text-primary-foreground shadow-lg" 
                      : "bg-black/60 border-white/5 hover:border-white/20 text-zinc-400"
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
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { MarketChart } from "@/components/shared/market-chart";
import { useLanguage } from "@/lib/i18n/context";
import { TrendingUp, TrendingDown, Wifi, Battery, Signal } from "lucide-react";

import Image from "next/image";

const liveAssets = [
  { symbol: "FX:EURUSD",      label: "EUR/USD",  tag: "Forex",  change: "+0.34%", up: true },
  { symbol: "BINANCE:BTCUSD", label: "BTC/USD",  tag: "Crypto", change: "+2.17%", up: true },
  { symbol: "NASDAQ:TSLA",    label: "TSLA",     tag: "Stock",  change: "-1.05%", up: false },
];

export function AppPreview() {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-background relative border-t border-border/10 overflow-hidden">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-16">

        {/* Left text column */}
        <div className="lg:w-1/2 relative z-10 text-center lg:text-left">
          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-bold mb-6"
          >
            {t("landing.appPreview.title1")} <span className="text-gradient">{t("landing.appPreview.title2")}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-muted-foreground mb-8"
          >
            {t("landing.appPreview.description")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
          >
            <Button size="lg" className="h-14 px-8 rounded-full border-glow bg-primary hover:bg-primary/90 text-primary-foreground font-semibold w-full sm:w-auto hover:scale-105 transition-transform">
              {t("landing.hero.getStarted")}
            </Button>
          </motion.div>
        </div>

        {/* iPhone mockup column */}
        <div className="lg:w-1/2 relative flex justify-center items-center">

          {/* Ambient glow */}
          <motion.div
            animate={{ opacity: [0.15, 0.35, 0.15], scale: [1, 1.05, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-72 h-72 bg-primary/25 blur-[100px] rounded-full pointer-events-none"
          />
          <motion.div
            animate={{ opacity: [0.1, 0.25, 0.1] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute w-48 h-48 bg-secondary/20 blur-[80px] rounded-full pointer-events-none translate-x-16 translate-y-16"
          />

          <motion.div
            initial={{ opacity: 0, y: 60, rotate: -3 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ type: "spring", stiffness: 45, damping: 18 }}
            whileHover={{ rotate: 1, scale: 1.02 }}
            className="relative"
          >
            {/* Side buttons — inside relative motion.div so they track the phone */}
            <div className="absolute left-[-5px] top-[120px] w-[5px] h-10 bg-zinc-700 rounded-l-md shadow-md" />
            <div className="absolute left-[-5px] top-[170px] w-[5px] h-10 bg-zinc-700 rounded-l-md shadow-md" />
            <div className="absolute left-[-5px] top-[222px] w-[5px] h-7 bg-zinc-700 rounded-l-md shadow-md" />
            <div className="absolute right-[-5px] top-[160px] w-[5px] h-14 bg-zinc-700 rounded-r-md shadow-md" />
            {/* Outer shell — titanium-like frame */}
            <div
              className="relative w-[300px] h-[620px] rounded-[44px] p-[3px] shadow-[0_40px_80px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.08)]"
              style={{ background: "linear-gradient(145deg, #3a3a3c 0%, #1c1c1e 40%, #2c2c2e 100%)" }}
            >
              {/* Screen glass */}
              <div className="w-full h-full rounded-[41px] overflow-hidden bg-[#000000] relative">

                {/* Screen gradient overlay for glare */}
                <div
                  className="absolute inset-0 pointer-events-none z-30 rounded-[41px]"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)",
                  }}
                />

                {/* ── STATUS BAR ── */}
                <div className="relative z-20 flex items-center justify-between px-6 pt-3 pb-1">
                  <span className="text-white text-[11px] font-semibold tracking-wide">9:41</span>
                  <div className="flex items-center gap-1.5">
                    <Signal className="w-3 h-3 text-white" />
                    <Wifi className="w-3 h-3 text-white" />
                    <Battery className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>

                {/* ── DYNAMIC ISLAND ── */}
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-30">
                  <div className="w-[100px] h-[30px] bg-black rounded-full shadow-inner" />
                </div>

                {/* ── SCREEN CONTENT ── */}
                <div className="absolute inset-0 top-[56px] overflow-y-auto custom-scrollbar px-4 pb-6">

                  {/* App header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">CarbonTrade</p>
                      <p className="text-[11px] text-zinc-400">Portfolio Overview</p>
                    </div>
                     <div className="w-7 h-7 rounded-full overflow-hidden border border-white/10 shrink-0">
                       <Image
                         src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&h=80&fit=crop&crop=face"
                         alt="User Profile"
                         width={28}
                         height={28}
                         className="w-full h-full object-cover"
                         unoptimized
                       />
                     </div>
                  </div>

                  {/* Portfolio value card */}
                  <motion.div
                    animate={{ scale: [1, 1.01, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="rounded-2xl mb-4 p-4 relative overflow-hidden"
                    style={{ background: "linear-gradient(135deg, #00c6ff18, #0072ff18)" }}
                  >
                    <div className="absolute inset-0 border border-white/5 rounded-2xl" />
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">{t("landing.appPreview.portfolioValue")}</p>
                    <motion.p
                      animate={{ color: ["#ffffff", "#00FF87", "#ffffff"] }}
                      transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: "easeOut" }}
                      className="text-2xl font-black text-white tracking-tight"
                    >
                      $12,450.00
                    </motion.p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3 text-emerald-400" />
                      <span className="text-[10px] text-emerald-400 font-semibold">+$284.50 today</span>
                    </div>
                  </motion.div>

                  {/* Quick stats row */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {[
                      { label: "Trades", value: "24" },
                      { label: "Win Rate", value: "76%" },
                    ].map((s, i) => (
                      <div key={i} className="rounded-xl bg-white/5 border border-white/5 px-3 py-2 text-center">
                        <p className="text-white font-bold text-sm">{s.value}</p>
                        <p className="text-zinc-500 text-[9px] uppercase tracking-wider">{s.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Live chart cards */}
                  <p className="text-[9px] text-zinc-600 uppercase tracking-widest mb-2 font-semibold">Live Markets</p>
                  <div className="space-y-3">
                    {liveAssets.map((asset, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 + i * 0.15, duration: 0.5 }}
                        className="rounded-2xl overflow-hidden border border-white/5 bg-[#0d0d0f] relative"
                      >
                        {/* Asset label row */}
                        <div className="flex items-center justify-between px-3 pt-2.5 pb-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-white text-[11px] font-bold">{asset.label}</span>
                            <span className="text-[8px] text-zinc-600 bg-zinc-800 px-1.5 py-0.5 rounded-full">{asset.tag}</span>
                          </div>
                          <div className={`flex items-center gap-0.5 text-[10px] font-semibold ${asset.up ? "text-emerald-400" : "text-red-400"}`}>
                            {asset.up ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                            {asset.change}
                          </div>
                        </div>
                        {/* Chart */}
                        <div className="h-[90px] pointer-events-none bg-[#0d0d0f]">
                          <MarketChart
                            type="mini"
                            theme="dark"
                            symbol={asset.symbol}
                            width="100%"
                            height="100%"
                            isTransparent={false}
                            autosize={true}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>

                </div>

                {/* ── HOME INDICATOR ── */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/30 rounded-full z-20" />

              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}

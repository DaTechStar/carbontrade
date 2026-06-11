"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { MarketChart } from "@/components/shared/market-chart"
import { useLanguage } from "@/lib/i18n/context"
import { siteConfig } from "@/config/site"
import { TrendingUp, TrendingDown, Wifi, Battery, Signal } from "lucide-react"
import Link from "next/link"

import Image from "next/image"

const liveAssets = [
  {
    symbol: "FX:EURUSD",
    label: "EUR/USD",
    tag: "Forex",
    change: "+0.34%",
    up: true,
  },
  {
    symbol: "BINANCE:BTCUSD",
    label: "BTC/USD",
    tag: "Crypto",
    change: "+2.17%",
    up: true,
  },
  {
    symbol: "NASDAQ:TSLA",
    label: "TSLA",
    tag: "Stock",
    change: "-1.05%",
    up: false,
  },
]

export function AppPreview() {
  const { t } = useLanguage()

  return (
    <section className="relative overflow-hidden border-t border-border/10 bg-background py-24">
      <div className="container mx-auto flex flex-col items-center gap-16 px-4 lg:flex-row">
        {/* Left text column */}
        <div className="relative z-10 text-center lg:w-1/2 lg:text-left">
          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="mb-6 text-3xl font-bold md:text-5xl"
          >
            {t("landing.appPreview.title1")}{" "}
            <span className="text-gradient">
              {t("landing.appPreview.title2")}
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8 text-lg text-muted-foreground"
          >
            {t("landing.appPreview.description")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start"
          >
            <Button
              size="lg"
              asChild
              className="border-glow h-14 w-full rounded-full bg-primary px-8 font-semibold text-primary-foreground transition-transform hover:scale-105 hover:bg-primary/90 sm:w-auto"
            >
              <Link href="/register">{t("landing.hero.getStarted")}</Link>
            </Button>
          </motion.div>
        </div>

        {/* iPhone mockup column */}
        <div className="relative flex items-center justify-center lg:w-1/2">
          {/* Ambient glow */}
          <motion.div
            animate={{ opacity: [0.15, 0.35, 0.15], scale: [1, 1.05, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute h-72 w-72 rounded-full bg-primary/25 blur-[100px]"
          />
          <motion.div
            animate={{ opacity: [0.1, 0.25, 0.1] }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="pointer-events-none absolute h-48 w-48 translate-x-16 translate-y-16 rounded-full bg-secondary/20 blur-[80px]"
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
            <div className="absolute top-[120px] left-[-5px] h-10 w-[5px] rounded-l-md bg-zinc-700 shadow-md" />
            <div className="absolute top-[170px] left-[-5px] h-10 w-[5px] rounded-l-md bg-zinc-700 shadow-md" />
            <div className="absolute top-[222px] left-[-5px] h-7 w-[5px] rounded-l-md bg-zinc-700 shadow-md" />
            <div className="absolute top-[160px] right-[-5px] h-14 w-[5px] rounded-r-md bg-zinc-700 shadow-md" />
            {/* Outer shell — titanium-like frame */}
            <div
              className="relative h-[620px] w-[300px] rounded-[44px] p-[3px] shadow-[0_40px_80px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.08)]"
              style={{
                background:
                  "linear-gradient(145deg, #3a3a3c 0%, #1c1c1e 40%, #2c2c2e 100%)",
              }}
            >
              {/* Screen glass */}
              <div className="relative h-full w-full overflow-hidden rounded-[41px] bg-[#000000]">
                {/* Screen gradient overlay for glare */}
                <div
                  className="pointer-events-none absolute inset-0 z-30 rounded-[41px]"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)",
                  }}
                />

                {/* ── STATUS BAR ── */}
                <div className="relative z-20 flex items-center justify-between px-6 pt-3 pb-1">
                  <span className="text-[11px] font-semibold tracking-wide text-white">
                    9:41
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Signal className="h-3 w-3 text-white" />
                    <Wifi className="h-3 w-3 text-white" />
                    <Battery className="h-3.5 w-3.5 text-white" />
                  </div>
                </div>

                {/* ── DYNAMIC ISLAND ── */}
                <div className="absolute top-2.5 left-1/2 z-30 -translate-x-1/2">
                  <div className="h-[30px] w-[100px] rounded-full bg-black shadow-inner" />
                </div>

                {/* ── SCREEN CONTENT ── */}
                <div className="custom-scrollbar absolute inset-0 top-[56px] overflow-y-auto px-4 pb-6">
                  {/* App header */}
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                        {siteConfig.name}
                      </p>
                      <p className="text-[11px] text-muted-foreground/70">
                        Portfolio Overview
                      </p>
                    </div>
                    <div className="h-7 w-7 shrink-0 overflow-hidden rounded-full border border-white/10">
                      <Image
                        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&h=80&fit=crop&crop=face"
                        alt="User Profile"
                        width={28}
                        height={28}
                        className="h-full w-full object-cover"
                        unoptimized
                      />
                    </div>
                  </div>

                  {/* Portfolio value card */}
                  <motion.div
                    animate={{ scale: [1, 1.01, 1] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="relative mb-4 overflow-hidden rounded-2xl p-4"
                    style={{
                      background:
                        "linear-gradient(135deg, color-mix(in srgb, var(--primary) 10%, transparent), color-mix(in srgb, var(--secondary) 10%, transparent))",
                    }}
                  >
                    <div className="absolute inset-0 rounded-2xl border border-white/5" />
                    <p className="mb-1 text-[10px] tracking-widest text-zinc-500 uppercase">
                      {t("landing.appPreview.portfolioValue")}
                    </p>
                    <motion.p
                      animate={{
                        color: [
                          "var(--foreground)",
                          "var(--profit)",
                          "var(--foreground)",
                        ],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatDelay: 2,
                        ease: "easeOut",
                      }}
                      className="text-2xl font-black tracking-tight text-white"
                    >
                      $12,450.00
                    </motion.p>
                    <div className="mt-1 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-profit" />
                      <span className="text-[10px] font-semibold text-profit">
                        +$284.50 today
                      </span>
                    </div>
                  </motion.div>

                  {/* Quick stats row */}
                  <div className="mb-4 grid grid-cols-2 gap-2">
                    {[
                      { label: "Trades", value: "24" },
                      { label: "Win Rate", value: "76%" },
                    ].map((s, i) => (
                      <div
                        key={i}
                        className="rounded-xl border border-white/5 bg-white/5 px-3 py-2 text-center"
                      >
                        <p className="text-sm font-bold text-white">
                          {s.value}
                        </p>
                        <p className="text-[9px] tracking-wider text-muted-foreground uppercase">
                          {s.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Live chart cards */}
                  <p className="mb-2 text-[9px] font-semibold tracking-widest text-muted-foreground/50 uppercase">
                    Live Markets
                  </p>
                  <div className="space-y-3">
                    {liveAssets.map((asset, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 + i * 0.15, duration: 0.5 }}
                        className="relative overflow-hidden rounded-2xl border border-border/10 bg-card"
                      >
                        {/* Asset label row */}
                        <div className="flex items-center justify-between px-3 pt-2.5 pb-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-bold text-white">
                              {asset.label}
                            </span>
                            <span className="rounded-full bg-muted px-1.5 py-0.5 text-[8px] text-muted-foreground/60">
                              {asset.tag}
                            </span>
                          </div>
                          <div
                            className={`flex items-center gap-0.5 text-[10px] font-semibold ${asset.up ? "text-profit" : "text-loss"}`}
                          >
                            {asset.up ? (
                              <TrendingUp className="h-2.5 w-2.5" />
                            ) : (
                              <TrendingDown className="h-2.5 w-2.5" />
                            )}
                            {asset.change}
                          </div>
                        </div>
                        {/* Chart */}
                        <div className="pointer-events-none h-[90px] bg-card">
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
                <div className="absolute bottom-2 left-1/2 z-20 h-1 w-28 -translate-x-1/2 rounded-full bg-white/30" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

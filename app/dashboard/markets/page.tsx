"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import {
  BarChart2,
  TrendingUp,
  Search,
  Flame,
  Globe,
  Bitcoin,
  Landmark,
  BarChart,
  Wheat,
  Layers,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/shared/skeleton"
import { useLanguage } from "@/lib/i18n/context"

// ─── Lazy-load TradingView widgets ────────────────────────────────────────────

const MarketChart = dynamic(
  () =>
    import("@/components/shared/market-chart").then((m) => ({
      default: m.MarketChart,
    })),
  {
    ssr: false,
    loading: () => <Skeleton className="h-full w-full" rounded="md" />,
  }
)

// ─── Data ─────────────────────────────────────────────────────────────────────

const CHART_TABS = [
  { label: "BTC/USD", symbol: "COINBASE:BTCUSD", category: "crypto" },
  { label: "ETH/USD", symbol: "COINBASE:ETHUSD", category: "crypto" },
  { label: "SOL/USD", symbol: "COINBASE:SOLUSD", category: "crypto" },
  { label: "EUR/USD", symbol: "FX:EURUSD", category: "forex" },
  { label: "GBP/USD", symbol: "FX:GBPUSD", category: "forex" },
  { label: "USD/JPY", symbol: "FX:USDJPY", category: "forex" },
  { label: "Gold", symbol: "OANDA:XAUUSD", category: "commodities" },
  { label: "Silver", symbol: "OANDA:XAGUSD", category: "commodities" },
  { label: "Oil", symbol: "OANDA:USOIL", category: "commodities" },
  { label: "AAPL", symbol: "NASDAQ:AAPL", category: "stocks" },
  { label: "NVDA", symbol: "NASDAQ:NVDA", category: "stocks" },
  { label: "TSLA", symbol: "NASDAQ:TSLA", category: "stocks" },
  { label: "MSFT", symbol: "NASDAQ:MSFT", category: "stocks" },
  { label: "META", symbol: "NASDAQ:META", category: "stocks" },
  { label: "S&P 500", symbol: "SP:SPX", category: "indices" },
  { label: "NASDAQ", symbol: "NASDAQ:NDX", category: "indices" },
  { label: "DAX 40", symbol: "XETR:DAX", category: "indices" },
]

type Category =
  | "all"
  | "crypto"
  | "forex"
  | "stocks"
  | "commodities"
  | "indices"

const CATEGORIES: {
  label: string
  value: Category
  icon: React.ElementType
}[] = [
  { label: "All", value: "all", icon: Layers },
  { label: "Crypto", value: "crypto", icon: Bitcoin },
  { label: "Forex", value: "forex", icon: Globe },
  { label: "Stocks", value: "stocks", icon: BarChart },
  { label: "Commodities", value: "commodities", icon: Wheat },
  { label: "Indices", value: "indices", icon: Landmark },
]

const OVERVIEW_TABS = [
  {
    title: "Crypto",
    symbols: [
      { s: "COINBASE:BTCUSD", d: "Bitcoin" },
      { s: "COINBASE:ETHUSD", d: "Ethereum" },
      { s: "COINBASE:SOLUSD", d: "Solana" },
      { s: "BINANCE:BNBUSDT", d: "BNB" },
      { s: "COINBASE:AVAXUSD", d: "Avalanche" },
    ],
    originalTitle: "Crypto",
  },
  {
    title: "Forex",
    symbols: [
      { s: "FX:EURUSD", d: "EUR/USD" },
      { s: "FX:GBPUSD", d: "GBP/USD" },
      { s: "FX:USDJPY", d: "USD/JPY" },
      { s: "FX:AUDUSD", d: "AUD/USD" },
      { s: "FX:USDCAD", d: "USD/CAD" },
    ],
    originalTitle: "Forex",
  },
  {
    title: "Stocks",
    symbols: [
      { s: "NASDAQ:AAPL", d: "Apple" },
      { s: "NASDAQ:NVDA", d: "NVIDIA" },
      { s: "NASDAQ:TSLA", d: "Tesla" },
      { s: "NASDAQ:MSFT", d: "Microsoft" },
      { s: "NASDAQ:AMZN", d: "Amazon" },
    ],
    originalTitle: "Stocks",
  },
  {
    title: "Commodities",
    symbols: [
      { s: "OANDA:XAUUSD", d: "Gold" },
      { s: "OANDA:XAGUSD", d: "Silver" },
      { s: "OANDA:USOIL", d: "Crude Oil" },
      { s: "OANDA:NATGAS", d: "Natural Gas" },
    ],
    originalTitle: "Commodities",
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fu = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" as const, delay },
})

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MarketsPage() {
  const { t } = useLanguage()
  const [activeCategory, setActiveCategory] = useState<Category>("all")
  const [search, setSearch] = useState("")
  const [activeSymbol, setActiveSymbol] = useState(CHART_TABS[0])
  const [chartView, setChartView] = useState<"advanced" | "technical">(
    "advanced"
  )

  const filteredTabs = CHART_TABS.filter((t) => {
    const matchCat = activeCategory === "all" || t.category === activeCategory
    const matchSearch =
      !search || t.label.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="flex w-full flex-col gap-6 pb-12">
      {/* ── Header ── */}
      <motion.div {...fu(0)} className="flex items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/20">
          <BarChart2 className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1
            suppressHydrationWarning
            className="text-2xl font-black tracking-tight text-foreground sm:text-3xl"
          >
            {t("dashboard.markets.title")}
          </h1>
          <p
            suppressHydrationWarning
            className="mt-0.5 text-sm text-muted-foreground"
          >
            {t("dashboard.markets.subtitle")}
          </p>
        </div>
      </motion.div>

      {/* ── Main layout: chart (left) + overview (right) ── */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        {/* ─── Left: symbol picker + chart ──────────────────────────────── */}
        <motion.div {...fu(0.1)} className="flex flex-col gap-4 xl:col-span-2">
          {/* Category + search bar */}
          <div className="flex flex-col gap-3">
            {/* Category pills */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(({ label, value, icon: Icon }) => (
                <button
                  key={value}
                  id={`market-cat-${value}`}
                  onClick={() => setActiveCategory(value)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all",
                    activeCategory === value
                      ? "border-primary/30 bg-primary/15 text-primary"
                      : "border-border/30 bg-muted/20 text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span suppressHydrationWarning>
                    {t(`dashboard.markets.cat${label.replace(" ", "")}`) ||
                      label}
                  </span>
                </button>
              ))}

              {/* Search */}
              <div className="relative ml-auto">
                <Search className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t("dashboard.markets.searchPlaceholder")}
                  className="w-36 rounded-xl border border-border/30 bg-muted/30 py-1.5 pr-3 pl-8 text-xs transition-colors placeholder:text-muted-foreground/50 focus:border-primary/40 focus:outline-none"
                />
              </div>
            </div>

            {/* Symbol tabs */}
            <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
              {filteredTabs.length === 0 ? (
                <p
                  suppressHydrationWarning
                  className="py-1.5 text-xs text-muted-foreground"
                >
                  {t("dashboard.markets.noSymbols")}
                </p>
              ) : (
                filteredTabs.map((tab) => (
                  <button
                    key={tab.symbol}
                    id={`market-sym-${tab.label.replace("/", "-")}`}
                    onClick={() => setActiveSymbol(tab)}
                    className={cn(
                      "flex shrink-0 items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-all",
                      activeSymbol.symbol === tab.symbol
                        ? "border-primary/40 bg-primary/20 text-primary shadow-sm"
                        : "border-border/30 bg-muted/20 text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                    )}
                  >
                    {tab.category === "crypto" && (
                      <Bitcoin className="h-3 w-3" />
                    )}
                    {tab.category === "forex" && <Globe className="h-3 w-3" />}
                    {tab.category === "stocks" && (
                      <BarChart className="h-3 w-3" />
                    )}
                    {tab.category === "commodities" && (
                      <Wheat className="h-3 w-3" />
                    )}
                    {tab.category === "indices" && (
                      <Landmark className="h-3 w-3" />
                    )}
                    {tab.label}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chart card */}
          <Card padding="none" className="flex flex-col overflow-hidden">
            {/* Chart header */}
            <div className="flex items-center justify-between gap-3 border-b border-border/30 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-profit" />
                <span className="text-sm font-bold text-foreground">
                  {activeSymbol.label}
                </span>
                <span className="rounded border border-border/40 bg-muted/20 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                  {activeSymbol.symbol}
                </span>
              </div>
              <div className="flex gap-1">
                {(["advanced", "technical"] as const).map((v) => (
                  <button
                    key={v}
                    id={`chart-view-${v}`}
                    onClick={() => setChartView(v)}
                    className={cn(
                      "rounded-lg px-2.5 py-1 text-[11px] font-bold capitalize transition-colors",
                      chartView === v
                        ? "border border-primary/30 bg-primary/20 text-primary"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    <span suppressHydrationWarning>
                      {v === "advanced"
                        ? t("dashboard.markets.chartAdvanced")
                        : t("dashboard.markets.chartTechnical")}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Chart */}
            <div className="h-[480px] w-full">
              {chartView === "advanced" ? (
                <MarketChart
                  type="advanced"
                  symbol={activeSymbol.symbol}
                  theme="dark"
                  isTransparent={false}
                  autosize
                />
              ) : (
                <MarketChart
                  type="technical"
                  symbol={activeSymbol.symbol}
                  theme="dark"
                  isTransparent={false}
                  autosize
                />
              )}
            </div>
          </Card>
        </motion.div>

        {/* ─── Right: Market Overview widget ────────────────────────────── */}
        <motion.div {...fu(0.2)} className="flex flex-col gap-4">
          <Card padding="none" className="flex flex-1 flex-col overflow-hidden">
            <div className="flex items-center gap-2 border-b border-border/30 px-4 py-3">
              <Flame className="h-4 w-4 text-warning" />
              <span suppressHydrationWarning className="text-sm font-bold">
                {t("dashboard.markets.marketOverview")}
              </span>
              <span className="ml-auto flex items-center gap-1 text-[10px] font-semibold text-profit">
                <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-profit" />
                <span suppressHydrationWarning>
                  {t("dashboard.markets.live")}
                </span>
              </span>
            </div>
            <div className="h-[560px]">
              <MarketChart
                type="overview"
                theme="dark"
                isTransparent={false}
                autosize
                showFloatingTooltip
                showSymbolLogo
                overviewTabs={OVERVIEW_TABS.map((tab) => ({
                  ...tab,
                  title:
                    t(`dashboard.markets.cat${tab.originalTitle}`) || tab.title,
                }))}
              />
            </div>
          </Card>

          {/* Quick tips card */}
          <Card className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span
                suppressHydrationWarning
                className="text-xs font-bold tracking-wider uppercase"
              >
                {t("dashboard.markets.quickAccess")}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "BTC/USD", symbol: "COINBASE:BTCUSD", cat: "crypto" },
                { label: "Gold", symbol: "OANDA:XAUUSD", cat: "commodities" },
                { label: "EUR/USD", symbol: "FX:EURUSD", cat: "forex" },
                { label: "NVDA", symbol: "NASDAQ:NVDA", cat: "stocks" },
                { label: "S&P 500", symbol: "SP:SPX", cat: "indices" },
                { label: "ETH/USD", symbol: "COINBASE:ETHUSD", cat: "crypto" },
              ].map(({ label, symbol, cat }) => (
                <button
                  key={symbol}
                  onClick={() => {
                    const found = CHART_TABS.find((t) => t.symbol === symbol)
                    if (found) setActiveSymbol(found)
                    setChartView("advanced")
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }}
                  className={cn(
                    "group rounded-xl border p-2.5 text-left transition-all hover:border-primary/30 hover:bg-primary/5",
                    activeSymbol.symbol === symbol
                      ? "border-primary/30 bg-primary/10"
                      : "border-border/30 bg-muted/10"
                  )}
                >
                  <p
                    suppressHydrationWarning
                    className="text-[11px] font-bold text-foreground transition-colors group-hover:text-primary"
                  >
                    {label}
                  </p>
                  <p
                    suppressHydrationWarning
                    className="mt-0.5 text-[10px] text-muted-foreground capitalize"
                  >
                    {t(
                      `dashboard.markets.cat${cat.charAt(0).toUpperCase() + cat.slice(1)}`
                    ) || cat}
                  </p>
                </button>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

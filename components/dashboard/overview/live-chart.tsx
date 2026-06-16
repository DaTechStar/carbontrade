"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { TrendingUp } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/shared/skeleton"
import { useLanguage } from "@/lib/i18n/context"

// Load TradingView widgets client-side only
const MarketChart = dynamic(
  () =>
    import("@/components/shared/market-chart").then((m) => ({
      default: m.MarketChart,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center">
        <Skeleton className="h-full w-full" rounded="md" />
      </div>
    ),
  }
)

const CHART_ASSETS = [
  { label: "BTC", symbol: "COINBASE:BTCUSD" },
  { label: "ETH", symbol: "COINBASE:ETHUSD" },
  { label: "EUR/USD", symbol: "FX:EURUSD" },
  { label: "Gold", symbol: "OANDA:XAUUSD" },
  { label: "NVDA", symbol: "NASDAQ:NVDA" },
  { label: "META", symbol: "NASDAQ:META" },
]

export function LiveChart() {
  const { t } = useLanguage()
  const [active, setActive] = useState(0)
  return (
    <Card padding="none" className="flex flex-col overflow-hidden">
      <div className="flex flex-wrap items-center gap-2 border-b border-border/30 px-4 pt-4 pb-3">
        <div className="mr-auto flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          <span suppressHydrationWarning className="text-sm font-bold">
            {t("dashboard.overview.liveMarket")}
          </span>
        </div>
        <div className="flex flex-wrap gap-1">
          {CHART_ASSETS.map((a, i) => (
            <button
              key={a.label}
              onClick={() => setActive(i)}
              className={cn(
                "rounded-lg px-2.5 py-1 text-[11px] font-bold transition-colors",
                i === active
                  ? "border border-primary/30 bg-primary/20 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>
      <div className="h-[400px] w-full bg-chart-bg">
        <MarketChart
          type="advanced"
          symbol={CHART_ASSETS[active].symbol}
          theme="dark"
          isTransparent={false}
          autosize
        />
      </div>
    </Card>
  )
}

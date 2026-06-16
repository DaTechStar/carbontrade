"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Users, Search, ChevronDown, TrendingUp } from "lucide-react"

import { Trader } from "@/types"
import { cn } from "@/lib/utils"
import { TraderCard } from "@/components/dashboard/trader-card"
import { toast } from "sonner"
import { useLanguage } from "@/lib/i18n/context"

import { useCopyTrader } from "@/hooks/use-copy-trader"

// ─── Constants ────────────────────────────────────────────────────────────────

const SORT_OPTIONS = [
  { label: "Monthly Profit", value: "monthlyReturn" },
  { label: "Win Rate", value: "winRate" },
  { label: "Yearly Return", value: "yearlyReturn" },
  { label: "Copiers", value: "copiers" },
  { label: "Min. Investment", value: "minCopy" },
]

const BADGE_FILTER_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Professional Trader", value: "Professional Trader" },
  { label: "Independent Analyst", value: "Independent Analyst" },
  { label: "Algo Trader", value: "Algo Trader" },
  { label: "Expert Advisor", value: "Expert Advisor" },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TradersClient({
  initialTraders,
}: {
  initialTraders: Trader[]
}) {
  const { handleCopy } = useCopyTrader()
  const { t } = useLanguage()
  const [search, setSearch] = useState("")
  const [sortKey, setSortKey] = useState<string>("monthlyReturn")
  const [sortOpen, setSortOpen] = useState(false)
  const [badgeFilter, setBadgeFilter] = useState("all")

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return initialTraders
      .filter((t) => {
        const matchesSearch =
          !q ||
          t.name.toLowerCase().includes(q) ||
          (t.bio && t.bio.toLowerCase().includes(q)) ||
          (t.badge || t.role)?.toLowerCase().includes(q)
        const matchesBadge =
          badgeFilter === "all" || (t.badge || t.role) === badgeFilter
        return matchesSearch && matchesBadge
      })
      .sort((a, b) => {
        const valA =
          a.metrics && sortKey in a.metrics
            ? (a.metrics as any)[sortKey]
            : (a as any)[sortKey]
        const valB =
          b.metrics && sortKey in b.metrics
            ? (b.metrics as any)[sortKey]
            : (b as any)[sortKey]
        return (valB as number) - (valA as number)
      })
  }, [search, sortKey, badgeFilter])

  const currentSortLabel =
    SORT_OPTIONS.find((o) => o.value === sortKey)?.label ?? "Sort"

  const translateSortOption = (opt: string) =>
    t(`dashboard.traders.sort_${opt}`)
  const translateBadgeOption = (opt: string) =>
    t(`dashboard.traders.badge_${opt}`)

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 pt-6 pb-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-3"
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/20">
          <Users className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1
            suppressHydrationWarning
            className="text-2xl font-black tracking-tight text-foreground sm:text-3xl"
          >
            {t("dashboard.traders.title")}
          </h1>
          <p
            suppressHydrationWarning
            className="mt-0.5 text-sm text-muted-foreground"
          >
            {t("dashboard.traders.subtitle")?.replace(
              "{{count}}",
              String(initialTraders.length)
            )}
          </p>
        </div>
      </motion.div>

      {/* Search + Sort row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex flex-col gap-3 sm:flex-row"
      >
        {/* Search */}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("dashboard.traders.searchPlaceholder")}
            className="h-11 w-full rounded-xl border border-border/50 bg-card/60 pr-4 pl-10 text-sm text-foreground backdrop-blur-md transition-all placeholder:text-muted-foreground focus:border-primary/50 focus:ring-1 focus:ring-primary/30 focus:outline-none"
          />
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <button
            onClick={() => setSortOpen((v) => !v)}
            className="flex h-11 items-center gap-2 rounded-xl border border-border/50 bg-card/60 px-4 text-sm font-bold whitespace-nowrap text-foreground backdrop-blur-md transition-all hover:border-primary/40"
          >
            <TrendingUp className="h-4 w-4 text-primary" />
            <span suppressHydrationWarning>{translateSortOption(sortKey)}</span>
            <ChevronDown
              className={cn(
                "h-4 w-4 text-muted-foreground transition-transform",
                sortOpen && "rotate-180"
              )}
            />
          </button>
          {sortOpen && (
            <div className="absolute top-12 right-0 z-50 w-48 overflow-hidden rounded-xl border border-border/50 bg-popover/95 shadow-2xl backdrop-blur-xl">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setSortKey(opt.value)
                    setSortOpen(false)
                  }}
                  className={cn(
                    "w-full px-4 py-2.5 text-left text-sm font-medium transition-colors hover:bg-muted/40",
                    sortKey === opt.value
                      ? "bg-primary/5 font-bold text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  <span suppressHydrationWarning>
                    {translateSortOption(opt.value)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Badge filter pills */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="flex flex-wrap gap-2"
      >
        {BADGE_FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setBadgeFilter(opt.value)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-[11px] font-bold transition-all",
              badgeFilter === opt.value
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-border/40 bg-muted/30 text-muted-foreground hover:border-primary/30 hover:text-foreground"
            )}
          >
            <span suppressHydrationWarning>
              {translateBadgeOption(opt.value)}
            </span>
          </button>
        ))}
      </motion.div>

      {/* Results count */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="-mt-2 text-xs text-muted-foreground"
      >
        <span suppressHydrationWarning>{t("dashboard.traders.showing")}</span>{" "}
        <span className="font-bold text-foreground">{filtered.length}</span>{" "}
        <span suppressHydrationWarning>{t("dashboard.traders.of")}</span>{" "}
        <span className="font-bold text-foreground">
          {initialTraders.length}
        </span>{" "}
        <span suppressHydrationWarning>
          {t("dashboard.traders.traders_count")}
        </span>
      </motion.p>

      {/* Trader Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((trader, i) => (
            <TraderCard
              key={trader.id}
              trader={trader}
              index={i}
              onCopy={handleCopy}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
          <Users className="h-10 w-10 text-muted-foreground/30" />
          <p suppressHydrationWarning className="text-sm text-muted-foreground">
            {t("dashboard.traders.noTraders")}
          </p>
          <button
            onClick={() => {
              setSearch("")
              setBadgeFilter("all")
            }}
            className="text-xs font-bold text-primary hover:opacity-80"
          >
            <span suppressHydrationWarning>
              {t("dashboard.traders.clearFilters")}
            </span>
          </button>
        </div>
      )}
    </div>
  )
}

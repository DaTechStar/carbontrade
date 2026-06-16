"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  Download,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

import { formatCurrency } from "@/lib/utils"
import { Transaction } from "@/types"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n/context"
import { EmptyState } from "@/components/shared/empty-state"
import { SummaryStat } from "@/components/dashboard/transactions/summary-stat"
import { TxRow } from "@/components/dashboard/transactions/tx-row"
import { ALL_TYPES, ALL_STATUSES } from "@/lib/transactions-config"

interface TransactionsClientProps {
  initialData: {
    data: Transaction[]
    totalPages: number
    currentPage: number
    totalRecords: number
    summary: {
      totalDeposited: number
      totalWithdrawn: number
      totalProfits: number
      totalFees: number
    }
    filters: {
      q: string
      type: string
      status: string
    }
  }
}

const fu = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" as const, delay },
})

export default function TransactionsClient({
  initialData,
}: TransactionsClientProps) {
  const { t } = useLanguage()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const {
    data: transactions,
    totalPages,
    currentPage,
    summary,
    filters,
  } = initialData

  const [q, setQ] = useState(filters.q)

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value && value !== "all") {
        params.set(name, value)
      } else {
        params.delete(name)
      }
      // Always reset to page 1 on filter change
      if (name !== "page") params.set("page", "1")
      return params.toString()
    },
    [searchParams]
  )

  // Debounced search logic
  useEffect(() => {
    // Only push if local state differs from URL params
    if (q === filters.q) return
    const handler = setTimeout(() => {
      router.push(pathname + "?" + createQueryString("q", q))
    }, 300)
    return () => clearTimeout(handler)
  }, [q, pathname, router, createQueryString, filters.q])

  return (
    <div className="flex w-full flex-col gap-6 pb-12">
      {/* ── Header ── */}
      <motion.div
        {...fu(0)}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1
            suppressHydrationWarning
            className="text-2xl font-black tracking-tight sm:text-3xl"
          >
            {t("dashboard.transactions.title")}
          </h1>
          <p
            suppressHydrationWarning
            className="mt-0.5 text-sm text-muted-foreground"
          >
            {t("dashboard.transactions.subtitle")}
          </p>
        </div>
        <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-border/30 bg-muted/20 px-4 py-2.5 text-xs font-bold transition-colors hover:bg-accent sm:w-auto">
          <Download className="h-3.5 w-3.5" />
          <span suppressHydrationWarning>
            {t("dashboard.transactions.exportCSV")}
          </span>
        </button>
      </motion.div>

      {/* ── Summary Stats ── */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <SummaryStat
          delay={0.1}
          label={t("dashboard.transactions.totalInflow")}
          value={formatCurrency(summary.totalDeposited)}
          icon={ArrowDownLeft}
          iconBg="bg-profit/15 text-profit"
          sub={t("dashboard.transactions.completedDeposits")}
        />
        <SummaryStat
          delay={0.15}
          label={t("dashboard.transactions.totalOutflow")}
          value={formatCurrency(summary.totalWithdrawn)}
          icon={ArrowUpRight}
          iconBg="bg-loss/15 text-loss"
          sub={t("dashboard.transactions.completedWithdrawals")}
        />
        <SummaryStat
          delay={0.2}
          label={t("dashboard.transactions.tradingProfit")}
          value={formatCurrency(summary.totalProfits)}
          icon={TrendingUp}
          iconBg="bg-primary/15 text-primary"
          sub={t("dashboard.transactions.fromCopiedTrades")}
        />
      </div>

      {/* ── Main content ── */}
      <motion.div {...fu(0.25)}>
        <Card padding="none" className="flex flex-col overflow-hidden">
          {/* Filters & Search */}
          <div className="flex flex-col gap-3 border-b border-border/30 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t("dashboard.transactions.searchPlaceholder")}
                className="w-full rounded-xl border border-border/30 bg-muted/20 py-2.5 pr-4 pl-9 text-sm transition-colors placeholder:text-muted-foreground/50 focus:border-primary/40 focus:outline-none"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={filters.type}
                onChange={(e) =>
                  router.push(
                    pathname + "?" + createQueryString("type", e.target.value)
                  )
                }
                className="rounded-xl border border-border/30 bg-muted/20 px-3 py-2 text-xs font-semibold text-foreground focus:outline-none"
              >
                {ALL_TYPES.map((t_opt) => (
                  <option key={t_opt} value={t_opt}>
                    {t_opt === "all"
                      ? t("dashboard.transactions.allTypes")
                      : t(`dashboard.transactions.type_${t_opt}`) ||
                        t_opt
                          .split("_")
                          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                          .join(" ")}
                  </option>
                ))}
              </select>
              <select
                value={filters.status}
                onChange={(e) =>
                  router.push(
                    pathname + "?" + createQueryString("status", e.target.value)
                  )
                }
                className="rounded-xl border border-border/30 bg-muted/20 px-3 py-2 text-xs font-semibold text-foreground focus:outline-none"
              >
                {ALL_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s === "all"
                      ? t("dashboard.transactions.allStatuses")
                      : t(`dashboard.transactions.status_${s}`) ||
                        s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* List */}
          {transactions.length === 0 ? (
            <div className="p-8">
              <EmptyState
                title={t("dashboard.transactions.noTransactionsTitle")}
                description={
                  filters.q ||
                  filters.type !== "all" ||
                  filters.status !== "all"
                    ? t("dashboard.transactions.noTransactionsFiltered")
                    : t("dashboard.transactions.noTransactionsDesc")
                }
              />
            </div>
          ) : (
            <div className="flex flex-col">
              <AnimatePresence mode="popLayout">
                {transactions.map((tx, i) => (
                  <TxRow key={tx.id} tx={tx} i={i} />
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border/30 bg-muted/10 p-4">
              <div className="text-sm text-muted-foreground">
                Page{" "}
                <span className="font-semibold text-foreground">
                  {currentPage}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-foreground">
                  {totalPages}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage <= 1}
                  onClick={() =>
                    router.push(
                      pathname +
                        "?" +
                        createQueryString("page", (currentPage - 1).toString())
                    )
                  }
                  className="rounded-xl"
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Prev
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= totalPages}
                  onClick={() =>
                    router.push(
                      pathname +
                        "?" +
                        createQueryString("page", (currentPage + 1).toString())
                    )
                  }
                  className="rounded-xl"
                >
                  Next
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  )
}

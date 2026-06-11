"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Layers,
  Search,
  SlidersHorizontal,
  Receipt,
  ChevronDown,
  X,
  Download,
} from "lucide-react"

import { formatCurrency } from "@/lib/mock-data"
import { Transaction } from "@/types"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import useSWR from "swr"
import { SharedPagination } from "@/components/shared/shared-pagination"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

// ─── Config ───────────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<
  Transaction["type"],
  {
    label: string
    icon: React.ElementType
    color: string
    bg: string
    amountColor: string
  }
> = {
  deposit: {
    label: "Deposit",
    icon: ArrowDownLeft,
    color: "text-profit",
    bg: "bg-profit/10",
    amountColor: "text-profit",
  },
  withdrawal: {
    label: "Withdrawal",
    icon: ArrowUpRight,
    color: "text-loss",
    bg: "bg-loss/10",
    amountColor: "text-loss",
  },
  trade_profit: {
    label: "Trade Profit",
    icon: TrendingUp,
    color: "text-profit",
    bg: "bg-profit/10",
    amountColor: "text-profit",
  },
  trade_loss: {
    label: "Trade Loss",
    icon: TrendingDown,
    color: "text-loss",
    bg: "bg-loss/10",
    amountColor: "text-loss",
  },
  interest: {
    label: "Interest",
    icon: Sparkles,
    color: "text-primary",
    bg: "bg-primary/10",
    amountColor: "text-primary",
  },
  fee: {
    label: "Fee",
    icon: Layers,
    color: "text-muted-foreground",
    bg: "bg-muted/30",
    amountColor: "text-muted-foreground",
  },
}

const STATUS_CONFIG: Record<
  Transaction["status"],
  { label: string; dot: string; text: string }
> = {
  completed: { label: "Completed", dot: "bg-profit", text: "text-profit" },
  pending: {
    label: "Pending Approval",
    dot: "bg-warning",
    text: "text-warning",
  },
  failed: { label: "Failed", dot: "bg-loss", text: "text-loss" },
}

const ALL_TYPES: Array<Transaction["type"] | "all"> = [
  "all",
  "deposit",
  "withdrawal",
  "trade_profit",
  "trade_loss",
  "interest",
  "fee",
]
const ALL_STATUSES: Array<Transaction["status"] | "all"> = [
  "all",
  "completed",
  "pending",
  "failed",
]

// ─── Summary stat cards ───────────────────────────────────────────────────────

function SummaryStat({
  label,
  value,
  sub,
  icon: Icon,
  iconBg,
  delay,
}: {
  label: string
  value: string
  sub?: string
  icon: React.ElementType
  iconBg: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
    >
      <Card className="flex flex-col gap-3 transition-all duration-300 hover:border-primary/30">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
            {label}
          </p>
          <div
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl",
              iconBg
            )}
          >
            <Icon className="h-3.5 w-3.5" />
          </div>
        </div>
        <p className="text-xl font-black tracking-tight sm:text-2xl">{value}</p>
        {sub && <p className="text-[10px] text-muted-foreground">{sub}</p>}
      </Card>
    </motion.div>
  )
}

// ─── Transaction row ──────────────────────────────────────────────────────────

function TxRow({ tx, i }: { tx: Transaction; i: number }) {
  const cfg = TYPE_CONFIG[tx.type as Transaction["type"]] || {
    label: tx.type || "Unknown",
    icon: Layers,
    color: "text-muted-foreground",
    bg: "bg-muted/30",
    amountColor: "text-muted-foreground",
  }
  const status = STATUS_CONFIG[tx.status as Transaction["status"]] || {
    label: tx.status || "Unknown",
    dot: "bg-muted",
    text: "text-muted-foreground",
  }
  const Icon = cfg.icon
  const isPositive = tx.amount > 0
  const formatted = isPositive
    ? `+${formatCurrency(tx.amount)}`
    : `-${formatCurrency(Math.abs(tx.amount))}`

  const dateValue = (tx as any).timestamp || tx.createdAt
  const date = dateValue ? new Date(dateValue) : new Date()
  const dateStr = date.toLocaleDateString("en", {
    month: "short",
    day: "numeric",
    year: "2-digit",
  })
  const timeStr = date.toLocaleTimeString("en", {
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, delay: Math.min(i * 0.03, 0.3) }}
      className="group flex cursor-default items-center gap-4 border-b border-border/20 px-4 py-3.5 transition-colors hover:bg-accent/30"
    >
      {/* Icon */}
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105",
          cfg.bg
        )}
      >
        <Icon className={cn("h-4 w-4", cfg.color)} />
      </div>

      {/* Description + date */}
      <div className="min-w-0 flex-1">
        <p className="text-sm leading-snug font-semibold text-foreground">
          {tx.description}
        </p>
        <div className="mt-0.5 flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground">
            {dateStr} · {timeStr}
          </span>
          {tx.asset && (
            <span className="rounded border border-border/30 bg-muted/40 px-1.5 py-0.5 font-mono text-[10px] font-bold text-muted-foreground">
              {tx.asset}
            </span>
          )}
        </div>
      </div>

      {/* Type badge */}
      <span className="hidden shrink-0 rounded-full border border-border/30 bg-muted/30 px-2 py-0.5 text-[10px] font-bold text-muted-foreground sm:block">
        {cfg.label}
      </span>

      {/* Status */}
      <div className="hidden shrink-0 items-center gap-1.5 md:flex">
        <div className={cn("h-1.5 w-1.5 rounded-full", status.dot)} />
        <span className={cn("text-[11px] font-semibold", status.text)}>
          {status.label}
        </span>
      </div>

      {/* Amount */}
      <p
        className={cn(
          "shrink-0 text-sm font-black tabular-nums",
          cfg.amountColor
        )}
      >
        {formatted}
      </p>
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TransactionsClient({
  initialData,
}: {
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
  }
}) {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<Transaction["type"] | "all">(
    "all"
  )
  const [statusFilter, setStatusFilter] = useState<
    Transaction["status"] | "all"
  >("all")
  const [showFilters, setShowFilters] = useState(false)

  // Simple debounce for search
  useMemo(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timeout)
  }, [search])

  // Reset page to 1 when filters change
  useMemo(() => {
    setPage(1)
  }, [debouncedSearch, typeFilter, statusFilter])

  const { data } = useSWR(
    `/api/user/transactions-data?page=${page}&limit=10&type=${typeFilter}&status=${statusFilter}&search=${encodeURIComponent(debouncedSearch)}`,
    fetcher,
    { fallbackData: initialData, refreshInterval: 10000 }
  )

  const transactions: any[] = data?.data || []
  const totalPages = data?.totalPages || 1
  const summary = data?.summary || {
    totalDeposited: 0,
    totalWithdrawn: 0,
    totalProfits: 0,
    totalFees: 0,
  }

  const totalDeposited = summary.totalDeposited
  const totalWithdrawn = summary.totalWithdrawn
  const totalProfits = summary.totalProfits

  // Group by date
  const grouped = useMemo(() => {
    const map = new Map<string, any[]>()
    transactions.forEach((tx) => {
      const date = new Date(tx.timestamp || tx.createdAt).toLocaleDateString(
        "en-US",
        { year: "numeric", month: "short", day: "numeric" }
      )
      if (!map.has(date)) map.set(date, [])
      map.get(date)!.push(tx)
    })
    return Array.from(map.entries())
  }, [transactions])

  const hasActiveFilters =
    typeFilter !== "all" || statusFilter !== "all" || search

  return (
    <div className="flex w-full flex-col gap-6 pb-12">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-4"
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-secondary/30 bg-secondary/20">
          <Receipt className="h-5 w-5 text-secondary" />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            Transactions
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Your complete financial history
          </p>
        </div>
        <button className="hidden items-center gap-2 rounded-xl border border-border/40 bg-muted/20 px-3 py-2 text-xs font-bold text-muted-foreground transition-colors hover:bg-muted/40 sm:flex">
          <Download className="h-3.5 w-3.5" />
          Export
        </button>
      </motion.div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <SummaryStat
          delay={0.05}
          label="Total Deposited"
          value={formatCurrency(totalDeposited)}
          sub="Completed deposits"
          icon={ArrowDownLeft}
          iconBg="bg-profit/10 text-profit"
        />
        <SummaryStat
          delay={0.1}
          label="Total Withdrawn"
          value={formatCurrency(totalWithdrawn)}
          sub="Completed withdrawals"
          icon={ArrowUpRight}
          iconBg="bg-loss/10 text-loss"
        />
        <SummaryStat
          delay={0.15}
          label="Trade Profits"
          value={formatCurrency(totalProfits)}
          sub="All copy trades"
          icon={TrendingUp}
          iconBg="bg-primary/10 text-primary"
        />
      </div>

      {/* ── Filters bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.25 }}
        className="flex flex-col gap-3"
      >
        {/* Search + toggle */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="tx-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search description, asset, amount…"
              className="w-full rounded-xl border border-border/30 bg-muted/30 py-2.5 pr-4 pl-10 text-sm text-foreground transition-colors placeholder:text-muted-foreground/50 focus:border-primary/40 focus:outline-none"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <button
            id="tx-filter-toggle"
            onClick={() => setShowFilters((f) => !f)}
            className={cn(
              "flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all",
              showFilters || hasActiveFilters
                ? "border-primary/30 bg-primary/10 text-primary"
                : "border-border/30 bg-muted/20 text-muted-foreground hover:text-foreground"
            )}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
            {hasActiveFilters && (
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
            )}
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 transition-transform",
                showFilters && "rotate-180"
              )}
            />
          </button>
        </div>

        {/* Expandable filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22 }}
              className="overflow-hidden"
            >
              <div className="flex flex-col gap-4 pt-1 sm:flex-row">
                {/* Type filter */}
                <div className="flex-1">
                  <p className="mb-2 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                    Type
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {ALL_TYPES.map((t) => (
                      <button
                        key={t}
                        onClick={() => setTypeFilter(t)}
                        className={cn(
                          "rounded-lg border px-2.5 py-1 text-[11px] font-semibold capitalize transition-all",
                          typeFilter === t
                            ? "border-primary/30 bg-primary/15 text-primary"
                            : "border-border/30 bg-muted/20 text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {t === "all" ? "All types" : t.replace("_", " ")}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Status filter */}
                <div>
                  <p className="mb-2 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                    Status
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {ALL_STATUSES.map((s) => (
                      <button
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        className={cn(
                          "rounded-lg border px-2.5 py-1 text-[11px] font-semibold capitalize transition-all",
                          statusFilter === s
                            ? "border-primary/30 bg-primary/15 text-primary"
                            : "border-border/30 bg-muted/20 text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {s === "all" ? "All statuses" : s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clear */}
                {hasActiveFilters && (
                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setSearch("")
                        setTypeFilter("all")
                        setStatusFilter("all")
                      }}
                      className="rounded-lg border border-border/30 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground transition-all hover:border-border/50 hover:text-foreground"
                    >
                      Clear all
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Transaction list ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.3 }}
      >
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Receipt className="mb-4 h-12 w-12 text-muted-foreground/30" />
            <h3 className="mb-1 text-base font-bold">No transactions found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your filters or search terms.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {grouped.map(([day, txs]) => (
              <div key={day}>
                {/* Day label */}
                <div className="mb-2 flex items-center gap-3 px-1">
                  <span className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
                    {day}
                  </span>
                  <div className="h-px flex-1 bg-border/30" />
                  <span className="text-[11px] text-muted-foreground">
                    {txs.length} tx
                  </span>
                </div>

                {/* Rows */}
                <Card className="overflow-hidden p-0">
                  <div className="divide-y divide-border/0">
                    {txs.map((tx: any, i: number) => (
                      <TxRow key={tx._id || tx.id} tx={tx} i={i} />
                    ))}
                  </div>
                </Card>
              </div>
            ))}

            <SharedPagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </motion.div>
    </div>
  )
}

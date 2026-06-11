"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  Download,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react"

import { formatCurrency } from "@/lib/utils"
import { Transaction } from "@/types"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
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
    summary: any
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
  const initialTransactions = initialData.data
  const [q, setQ] = useState("")
  const [typeFilter, setTypeFilter] = useState<Transaction["type"] | "all">(
    "all"
  )
  const [statusFilter, setStatusFilter] = useState<
    Transaction["status"] | "all"
  >("all")

  // Filter
  const filtered = initialTransactions.filter((tx) => {
    if (typeFilter !== "all" && tx.type !== typeFilter) return false
    if (statusFilter !== "all" && tx.status !== statusFilter) return false
    if (q) {
      return (
        tx.description.toLowerCase().includes(q.toLowerCase()) ||
        tx.id.toLowerCase().includes(q.toLowerCase())
      )
    }
    return true
  })

  // Summary logic
  const totalIn = initialTransactions
    .filter((t) => t.amount > 0 && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0)
  const totalOut = initialTransactions
    .filter((t) => t.amount < 0 && t.status === "completed")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)
  const totalProfit = initialTransactions
    .filter((t) => t.type === "trade_profit" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0)

  return (
    <div className="flex w-full flex-col gap-6 pb-12">
      {/* ── Header ── */}
      <motion.div
        {...fu(0)}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
            Transactions
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Track your deposits, withdrawals, and trading history
          </p>
        </div>
        <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-border/30 bg-muted/20 px-4 py-2.5 text-xs font-bold transition-colors hover:bg-accent sm:w-auto">
          <Download className="h-3.5 w-3.5" />
          Export CSV
        </button>
      </motion.div>

      {/* ── Summary Stats ── */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <SummaryStat
          delay={0.1}
          label="Total Inflow"
          value={formatCurrency(totalIn)}
          icon={ArrowDownLeft}
          iconBg="bg-profit/15 text-profit"
          sub="Completed deposits & profits"
        />
        <SummaryStat
          delay={0.15}
          label="Total Outflow"
          value={formatCurrency(totalOut)}
          icon={ArrowUpRight}
          iconBg="bg-loss/15 text-loss"
          sub="Completed withdrawals"
        />
        <SummaryStat
          delay={0.2}
          label="Trading Profit"
          value={formatCurrency(totalProfit)}
          icon={TrendingUp}
          iconBg="bg-primary/15 text-primary"
          sub="From copied trades"
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
                placeholder="Search description or ID..."
                className="w-full rounded-xl border border-border/30 bg-muted/20 py-2.5 pr-4 pl-9 text-sm transition-colors placeholder:text-muted-foreground/50 focus:border-primary/40 focus:outline-none"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as any)}
                className="rounded-xl border border-border/30 bg-muted/20 px-3 py-2 text-xs font-semibold text-foreground focus:outline-none"
              >
                {ALL_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t === "all"
                      ? "All Types"
                      : t
                          .split("_")
                          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                          .join(" ")}
                  </option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="rounded-xl border border-border/30 bg-muted/20 px-3 py-2 text-xs font-semibold text-foreground focus:outline-none"
              >
                {ALL_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s === "all"
                      ? "All Statuses"
                      : s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* List */}
          {filtered.length === 0 ? (
            <div className="p-8">
              <EmptyState
                title="No transactions found"
                description={
                  q || typeFilter !== "all" || statusFilter !== "all"
                    ? "Try adjusting your filters or search query."
                    : "When you deposit or trade, your transactions will appear here."
                }
              />
            </div>
          ) : (
            <div className="flex flex-col">
              <AnimatePresence mode="popLayout">
                {filtered.map((tx, i) => (
                  <TxRow key={tx.id} tx={tx} i={i} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  )
}

"use client"

import { useState } from "react"
import {
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Layers,
  Search,
  ChevronRight,
  BarChart2,
  Wallet,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/shared/empty-state"
import { Transaction } from "@/types"

export function Transactions({
  recentTransactions,
}: {
  recentTransactions: Transaction[]
}) {
  const [q, setQ] = useState("")
  const rows = recentTransactions.filter((t) =>
    t.description.toLowerCase().includes(q.toLowerCase())
  )

  const iconMap: Record<string, React.ElementType> = {
    deposit: ArrowDownLeft,
    withdrawal: ArrowUpRight,
    trade_profit: TrendingUp,
    trade_loss: TrendingDown,
    interest: Sparkles,
    fee: Layers,
  }
  const colorMap: Record<string, string> = {
    deposit: "text-profit bg-profit-bg",
    withdrawal: "text-loss bg-loss-bg",
    trade_profit: "text-profit bg-profit-bg",
    trade_loss: "text-loss bg-loss-bg",
    interest: "text-primary bg-primary/10",
    fee: "text-muted-foreground bg-muted/40",
  }

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <BarChart2 className="h-4 w-4 shrink-0 text-secondary" />
        <h3 className="flex-1 text-sm font-bold">Recent Transactions</h3>
        <a
          href="/dashboard/transactions"
          className="flex items-center gap-1 text-xs font-semibold text-primary hover:opacity-80"
        >
          <ChevronRight className="h-3.5 w-3.5" />
          All
        </a>
      </div>
      <div className="relative">
        <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search transactions…"
          className="w-full rounded-xl border border-border/30 bg-muted/40 py-2 pr-3 pl-8 text-xs transition-colors placeholder:text-muted-foreground/50 focus:border-primary/40 focus:outline-none"
        />
      </div>
      {rows.length === 0 ? (
        <EmptyState
          compact
          title="No transactions"
          description="Your history will appear here."
        />
      ) : (
        <div className="flex flex-col gap-0.5">
          {rows.map((tx: Transaction) => {
            const Icon = iconMap[tx.type] ?? Wallet
            const colors =
              colorMap[tx.type] ?? "text-muted-foreground bg-muted/40"
            return (
              <div
                key={tx.id}
                className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-accent/40"
              >
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl",
                    colors
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold">
                    {tx.description}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {new Date(tx.createdAt).toLocaleDateString("en", {
                      month: "short",
                      day: "numeric",
                      year: "2-digit",
                    })}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p
                    className={cn(
                      "text-xs font-bold",
                      tx.amount > 0 ? "text-profit" : "text-loss"
                    )}
                  >
                    {tx.amount > 0 ? "+" : ""}
                    {formatCurrency(Math.abs(tx.amount))}
                  </p>
                  <Badge
                    variant={
                      tx.status === "completed"
                        ? "success"
                        : tx.status === "pending"
                          ? "warning"
                          : "danger"
                    }
                    size="sm"
                  >
                    {tx.status}
                  </Badge>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}

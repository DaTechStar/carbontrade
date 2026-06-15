"use client"

import { useState } from "react"
import { Search, ChevronRight, Activity } from "lucide-react"

import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/shared/empty-state"
import { CopyPosition } from "@/types"

export function CopyHistory({
  copyPositions,
}: {
  copyPositions: CopyPosition[]
}) {
  const [q, setQ] = useState("")
  const rows = copyPositions.filter((t) =>
    (t.trader as any)?.name.toLowerCase().includes(q.toLowerCase())
  )
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Activity className="h-4 w-4 shrink-0 text-primary" />
        <h3 className="flex-1 text-sm font-bold">Copy Trading History</h3>
        <a
          href="/dashboard/trade-history"
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
          placeholder="Search trader..."
          className="w-full rounded-xl border border-border/30 bg-muted/40 py-2 pr-3 pl-8 text-xs transition-colors placeholder:text-muted-foreground/50 focus:border-primary/40 focus:outline-none"
        />
      </div>
      {rows.length === 0 ? (
        <EmptyState
          compact
          title="No trades found"
          description="Start by copying a trader."
        />
      ) : (
        <>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[460px] text-xs">
              <thead>
                <tr className="border-b border-border/30">
                  {["Trader", "Invested", "PnL", "Status", "Date"].map((h) => (
                    <th
                      key={h}
                      className="px-1 pb-2 text-left text-[9px] font-bold tracking-wider text-muted-foreground uppercase first:pl-0"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((t) => (
                  <tr
                    key={t.id}
                    className="border-b border-border/20 transition-colors hover:bg-accent/30"
                  >
                    <td className="px-1 py-2.5 font-semibold first:pl-0">
                      {(t.trader as any)?.name || "Unknown"}
                    </td>
                    <td className="px-1 py-2.5 font-mono text-muted-foreground">
                      {formatCurrency(t.investedAmount)}
                    </td>
                    <td
                      className={cn(
                        "px-1 py-2.5 font-bold",
                        t.currentProfit >= 0 ? "text-profit" : "text-loss"
                      )}
                    >
                      {t.currentProfit >= 0 ? "+" : ""}
                      {formatCurrency(t.currentProfit)}
                    </td>
                    <td className="px-1 py-2.5">
                      <Badge
                        variant={t.status === "active" ? "success" : "default"}
                        dot
                        size="sm"
                      >
                        {t.status}
                      </Badge>
                    </td>
                    <td className="px-1 py-2.5 text-muted-foreground">
                      {new Date(t.createdAt).toLocaleDateString("en", {
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="mt-2 flex flex-col gap-3 md:hidden">
            {rows.map((t) => (
              <div
                key={`mobile-${t.id}`}
                className="flex flex-col gap-2 rounded-xl border border-border/50 bg-muted/20 p-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">
                    {(t.trader as any)?.name || "Unknown"}
                  </span>
                  <Badge
                    variant={t.status === "active" ? "success" : "default"}
                    dot
                    size="sm"
                  >
                    {t.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-[10px] text-muted-foreground">
                      Invested
                    </p>
                    <p className="font-mono text-foreground/80">
                      {formatCurrency(t.investedAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">PnL</p>
                    <p
                      className={cn(
                        "font-bold",
                        t.currentProfit >= 0 ? "text-profit" : "text-loss"
                      )}
                    >
                      {t.currentProfit >= 0 ? "+" : ""}
                      {formatCurrency(t.currentProfit)}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[10px] text-muted-foreground">Date</p>
                    <p className="text-muted-foreground">
                      {new Date(t.createdAt).toLocaleDateString("en", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  )
}

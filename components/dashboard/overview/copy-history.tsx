"use client"

import { useState } from "react"
import { Search, ChevronRight, Activity } from "lucide-react"

import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/shared/empty-state"
import { useLanguage } from "@/lib/i18n/context"
import { CopyPosition } from "@/types"

export function CopyHistory({
  copyPositions,
}: {
  copyPositions: CopyPosition[]
}) {
  const { t } = useLanguage()
  const [q, setQ] = useState("")
  const rows = copyPositions.filter((pos) =>
    (pos.trader as any)?.name.toLowerCase().includes(q.toLowerCase())
  )
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Activity className="h-4 w-4 shrink-0 text-primary" />
        <h3 suppressHydrationWarning className="flex-1 text-sm font-bold">
          {t("dashboard.copyHistory.title")}
        </h3>
        <a
          href="/dashboard/trade-history"
          className="flex items-center gap-1 text-xs font-semibold text-primary hover:opacity-80"
        >
          <ChevronRight className="h-3.5 w-3.5" />
          {t("dashboard.copyHistory.all")}
        </a>
      </div>
      <div className="relative">
        <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("dashboard.copyHistory.searchPlaceholder")}
          className="w-full rounded-xl border border-border/30 bg-muted/40 py-2 pr-3 pl-8 text-xs transition-colors placeholder:text-muted-foreground/50 focus:border-primary/40 focus:outline-none"
        />
      </div>
      {rows.length === 0 ? (
        <EmptyState
          compact
          title={t("dashboard.copyHistory.noTradesTitle")}
          description={t("dashboard.copyHistory.noTradesDesc")}
        />
      ) : (
        <>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[460px] text-xs">
              <thead>
                <tr className="border-b border-border/30">
                  {[
                    t("dashboard.copyHistory.colTrader"),
                    t("dashboard.copyHistory.colInvested"),
                    t("dashboard.copyHistory.colPnl"),
                    t("dashboard.copyHistory.colStatus"),
                    t("dashboard.copyHistory.colDate"),
                  ].map((h) => (
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
                {rows.map((pos) => (
                  <tr
                    key={pos.id}
                    className="border-b border-border/20 transition-colors hover:bg-accent/30"
                  >
                    <td className="px-1 py-2.5 font-semibold first:pl-0">
                      {(pos.trader as any)?.name ||
                        t("dashboard.copyHistory.unknown")}
                    </td>
                    <td className="px-1 py-2.5 font-mono text-muted-foreground">
                      {formatCurrency(pos.investedAmount)}
                    </td>
                    <td
                      className={cn(
                        "px-1 py-2.5 font-bold",
                        pos.currentProfit >= 0 ? "text-profit" : "text-loss"
                      )}
                    >
                      {pos.currentProfit >= 0 ? "+" : ""}
                      {formatCurrency(pos.currentProfit)}
                    </td>
                    <td className="px-1 py-2.5">
                      <Badge
                        variant={
                          pos.status === "active" ? "success" : "default"
                        }
                        dot
                        size="sm"
                      >
                        {pos.status}
                      </Badge>
                    </td>
                    <td className="px-1 py-2.5 text-muted-foreground">
                      {new Date(pos.createdAt).toLocaleDateString("en", {
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
            {rows.map((item) => (
              <div
                key={`mobile-${item.id}`}
                className="flex flex-col gap-2 rounded-xl border border-border/50 bg-muted/20 p-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">
                    {(item.trader as any)?.name ||
                      t("dashboard.copyHistory.unknown")}
                  </span>
                  <Badge
                    variant={item.status === "active" ? "success" : "default"}
                    dot
                    size="sm"
                  >
                    {item.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-[10px] text-muted-foreground">
                      {t("dashboard.copyHistory.colInvested")}
                    </p>
                    <p className="font-mono text-foreground/80">
                      {formatCurrency(item.investedAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">
                      {t("dashboard.copyHistory.colPnl")}
                    </p>
                    <p
                      className={cn(
                        "font-bold",
                        item.currentProfit >= 0 ? "text-profit" : "text-loss"
                      )}
                    >
                      {item.currentProfit >= 0 ? "+" : ""}
                      {formatCurrency(item.currentProfit)}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[10px] text-muted-foreground">
                      {t("dashboard.copyHistory.colDate")}
                    </p>
                    <p className="text-muted-foreground">
                      {new Date(item.createdAt).toLocaleDateString("en", {
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

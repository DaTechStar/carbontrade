"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Copy,
  ChevronRight,
  Users,
  Star,
  TrendingUp,
  Clock,
  BarChart2,
} from "lucide-react"
import { toast } from "sonner"

import { formatCurrency } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { TraderCard } from "@/components/dashboard/trader-card"
import useSWR from "swr"
import { Trader } from "@/types"
import { useCopyTrader } from "@/hooks/use-copy-trader"
import { SharedPagination } from "@/components/shared/shared-pagination"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export type HistoryItem = {
  _id: string
  traderName: string
  investedAmount: number
  currentProfit: number
  status: string
  createdAt: string
  updatedAt: string
}

// ─── History Table ────────────────────────────────────────────────────────────

function HistoryTable({ trades }: { trades: HistoryItem[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
    >
      <Card className="glass-card overflow-hidden border-border/40">
        <div className="flex items-center gap-2 border-b border-border/30 p-5">
          <Clock className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-bold tracking-wider uppercase">
            Your Copies
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/20">
                {["Trader", "Invested", "Date", "P&L", "Status"].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-[10px] font-bold tracking-wider text-muted-foreground uppercase"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {trades.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-16 text-center text-sm text-muted-foreground"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <BarChart2 className="h-8 w-8 opacity-20" />
                      <span>No copies yet.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                trades.map((trade) => (
                  <tr
                    key={trade._id}
                    className="border-b border-border/10 transition-colors hover:bg-muted/10"
                  >
                    <td className="px-5 py-3 font-semibold">
                      {trade.traderName ||
                        (trade as any).trader?.name ||
                        "Unknown"}
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-muted-foreground">
                      {formatCurrency(trade.investedAmount)}
                    </td>
                    <td className="px-5 py-3 text-xs text-muted-foreground">
                      {new Date(trade.createdAt).toLocaleDateString()}
                    </td>
                    <td
                      className={cn(
                        "px-5 py-3 font-bold",
                        trade.currentProfit >= 0 ? "text-profit" : "text-loss"
                      )}
                    >
                      {trade.currentProfit >= 0 ? "+" : ""}
                      {formatCurrency(trade.currentProfit)}
                    </td>
                    <td className="px-5 py-3">
                      {trade.status === "active" ? (
                        <span className="rounded-full border border-profit/20 bg-profit/10 px-2.5 py-1 text-[10px] font-bold text-profit">
                          Active
                        </span>
                      ) : (
                        <span className="rounded-full border border-border/30 bg-muted/30 px-2.5 py-1 text-[10px] font-bold text-muted-foreground capitalize">
                          {trade.status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const fu = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
})
export default function CopytradingClient({
  topTraders: initialTraders,
  initialHistoryData,
}: {
  topTraders: Trader[]
  initialHistoryData: { data: HistoryItem[]; totalPages: number }
}) {
  const { handleCopy } = useCopyTrader()
  const [page, setPage] = useState(1)

  // We keep dashboard-data for topTraders (auto refreshing)
  const { data: dashboardData } = useSWR("/api/user/dashboard-data", fetcher, {
    fallbackData: { topTraders: initialTraders },
    refreshInterval: 10000,
  })

  // We use copy-data for paginated history
  const { data: historyData } = useSWR(
    `/api/user/copy-data?page=${page}&limit=10`,
    fetcher,
    {
      fallbackData: initialHistoryData,
      refreshInterval: 10000,
    }
  )

  const topTraders: Trader[] = dashboardData?.topTraders || initialTraders
  const history: HistoryItem[] = historyData?.data || initialHistoryData.data
  const totalPages =
    historyData?.totalPages || initialHistoryData.totalPages || 1

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 pt-6 pb-16">
      {/* Header */}
      <motion.div {...fu(0)} className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/20">
          <Copy className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            Copytrading
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Mirror the best traders and grow your portfolio automatically.
          </p>
        </div>
      </motion.div>

      {/* Top Traders section */}
      <div className="flex flex-col gap-4">
        <motion.div {...fu(0.1)} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-warning" />
            <h2 className="text-base font-black">Top Traders</h2>
          </div>
          <Link
            href="/dashboard/traders"
            className="flex items-center gap-1 text-xs font-bold text-primary transition-opacity hover:opacity-80"
          >
            Browse All <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {topTraders.map((trader, i) => (
            <TraderCard
              key={trader.id || trader._id}
              trader={trader}
              index={i}
              onCopy={handleCopy}
            />
          ))}
        </div>
      </div>

      {/* History */}
      <div className="flex flex-col gap-4">
        <motion.div {...fu(0.4)} className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          <h2 className="text-base font-black">Copy History</h2>
        </motion.div>
        <HistoryTable trades={history} />
        {totalPages > 1 && (
          <SharedPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  )
}

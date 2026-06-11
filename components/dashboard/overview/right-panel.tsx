import Link from "next/link"
import { ArrowDownLeft, ArrowUpRight, Copy, RefreshCcw } from "lucide-react"

import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { DashboardStats } from "@/types"

export function RightPanel({ userStats }: { userStats: DashboardStats }) {
  const actions = [
    {
      label: "Deposit",
      icon: ArrowDownLeft,
      color: "text-profit",
      bg: "bg-profit-bg border-profit/20 hover:bg-profit/20",
      href: "/dashboard/payments?tab=deposit",
    },
    {
      label: "Withdraw",
      icon: ArrowUpRight,
      color: "text-loss",
      bg: "bg-loss-bg border-loss/20 hover:bg-loss/20",
      href: "/dashboard/payments?tab=withdraw",
    },
    {
      label: "Copy",
      icon: Copy,
      color: "text-primary",
      bg: "bg-primary/10 border-primary/20 hover:bg-primary/20",
      href: "/dashboard/copytrading",
    },
    {
      label: "Refresh",
      icon: RefreshCcw,
      color: "text-secondary",
      bg: "bg-secondary/10 border-secondary/20 hover:bg-secondary/20",
    },
  ]
  return (
    <div className="flex h-full flex-col gap-4">
      <Card className="flex flex-col gap-4">
        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
          Quick Actions
        </p>
        <div className="grid grid-cols-2 gap-2">
          {actions.map(({ label, icon: Icon, color, bg, href }) => {
            const content = (
              <>
                <Icon className="h-4 w-4" />
                {label}
              </>
            )
            const className = cn(
              "flex flex-col items-center gap-2 rounded-xl border p-3 text-xs font-bold transition-all active:scale-95",
              bg,
              color
            )
            return href ? (
              <Link key={label} href={href} className={className}>
                {content}
              </Link>
            ) : (
              <button key={label} className={className}>
                {content}
              </button>
            )
          })}
        </div>
      </Card>

      <Card className="flex flex-1 flex-col gap-3">
        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
          Account Overview
        </p>
        {[
          { label: "Equity", value: formatCurrency(userStats.equity) },
          {
            label: "Margin Used",
            value: `${userStats.equity > 0 ? Math.round((userStats.invested / userStats.equity) * 100) : 0}%`,
          },
          { label: "Free Margin", value: formatCurrency(userStats.freeMargin) },
          { label: "Profit Factor", value: "1.00" },
          { label: "Open Positions", value: String(userStats.openPositions) },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="flex items-center justify-between border-b border-border/20 py-1.5 last:border-0"
          >
            <span className="text-xs text-muted-foreground">{label}</span>
            <span className="text-xs font-bold">{value}</span>
          </div>
        ))}
        <div className="mt-1">
          <div className="mb-1 flex justify-between text-[10px] text-muted-foreground">
            <span>Margin</span>
            <span>
              {userStats.equity > 0
                ? Math.round((userStats.invested / userStats.equity) * 100)
                : 0}
              %
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted/40">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all"
              style={{
                width: `${userStats.equity > 0 ? Math.round((userStats.invested / userStats.equity) * 100) : 0}%`,
              }}
            />
          </div>
        </div>
      </Card>
    </div>
  )
}

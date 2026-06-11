"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import dynamic from "next/dynamic"
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Sparkles,
  Copy,
  Search,
  ChevronRight,
  Shield,
  AlertTriangle,
  Users,
  BarChart2,
  Activity,
  Layers,
  RefreshCcw,
  X,
} from "lucide-react"

import { formatCurrency, formatPercent } from "@/lib/mock-data"
import { Transaction, DashboardStats, CopyPosition, Trader } from "@/types"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { TraderCard } from "@/components/dashboard/trader-card"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/shared/empty-state"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())
import { Skeleton } from "@/components/shared/skeleton"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useSession } from "next-auth/react"

interface DashboardClientProps {
  userStats: DashboardStats
  copyPositions: CopyPosition[]
  recentTransactions: Transaction[]
  topTraders: Trader[]
}

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

// ─── Animation helper ─────────────────────────────────────────────────────────
const fu = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" as const, delay },
})

// ─── Alert banner ─────────────────────────────────────────────────────────────
function AlertBanner({
  icon: Icon,
  message,
  linkText,
  href,
  variant = "warning",
  onDismiss,
}: {
  icon: React.ElementType
  message: string
  linkText: string
  href: string
  variant?: "warning" | "info"
  onDismiss?: () => void
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border px-4 py-2.5 text-sm",
        variant === "warning"
          ? "border-warning/25 bg-warning-bg text-warning"
          : "border-primary/25 bg-primary/10 text-primary"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="flex-1 text-xs text-foreground/80 sm:text-sm">
        {message}{" "}
        <a
          href={href}
          className={cn(
            "font-semibold underline underline-offset-2",
            variant === "warning" ? "text-warning" : "text-primary"
          )}
        >
          {linkText}
        </a>
        .
      </span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="ml-2 shrink-0 text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  )
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  icon: Icon,
  sub,
  iconBg,
}: {
  label: string
  value: string
  icon: React.ElementType
  sub?: string
  iconBg: string
}) {
  return (
    <Card className="flex flex-col gap-3 transition-all duration-300 hover:border-primary/30">
      <div className="flex items-center justify-between">
        <p className="text-[10px] leading-tight font-bold tracking-widest text-muted-foreground uppercase">
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
      <p className="truncate text-xl font-black tracking-tight sm:text-2xl">
        {value}
      </p>
      {sub && (
        <p className="truncate text-[10px] text-muted-foreground">{sub}</p>
      )}
    </Card>
  )
}

// ─── TradingView live chart with asset tabs ────────────────────────────────────
const CHART_ASSETS = [
  { label: "BTC", symbol: "COINBASE:BTCUSD" },
  { label: "ETH", symbol: "COINBASE:ETHUSD" },
  { label: "EUR/USD", symbol: "FX:EURUSD" },
  { label: "Gold", symbol: "OANDA:XAUUSD" },
  { label: "NVDA", symbol: "NASDAQ:NVDA" },
  { label: "META", symbol: "NASDAQ:META" },
]

function LiveChart() {
  const [active, setActive] = useState(0)
  return (
    <Card padding="none" className="flex flex-col overflow-hidden">
      <div className="flex flex-wrap items-center gap-2 border-b border-border/30 px-4 pt-4 pb-3">
        <div className="mr-auto flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          <span className="text-sm font-bold">Live Market</span>
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

// ─── Quick actions + account panel ────────────────────────────────────────────
function RightPanel({ userStats }: { userStats: DashboardStats }) {
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

// ─── Copy history table ────────────────────────────────────────────────────────
function CopyHistory({ copyPositions }: { copyPositions: CopyPosition[] }) {
  const [q, setQ] = useState("")
  const rows = copyPositions.filter((t) =>
    t.trader?.name.toLowerCase().includes(q.toLowerCase())
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
        <div className="overflow-x-auto">
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
                    {t.trader?.name || "Unknown"}
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
      )}
    </Card>
  )
}

// ─── Transactions ─────────────────────────────────────────────────────────────
function Transactions({
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

import { useCopyTrader } from "@/hooks/use-copy-trader"

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DashboardPage({
  userStats: initialStats,
  copyPositions: initialPositions,
  recentTransactions: initialTx,
  topTraders: initialTraders,
}: DashboardClientProps) {
  const { data: session } = useSession()
  const displayName =
    (session?.user as any)?.username || session?.user?.name || "User"
  const [banners, setBanners] = useState({
    balance: initialStats.equity === 0,
    kyc: true,
  })
  const { handleCopy } = useCopyTrader()

  const { data } = useSWR("/api/user/dashboard-data", fetcher, {
    fallbackData: {
      userStats: initialStats,
      copyPositions: initialPositions,
      recentTransactions: initialTx,
      topTraders: initialTraders,
    },
    refreshInterval: 10000, // Silently poll every 10 seconds
  })

  const stats: any = data?.userStats || initialStats
  const copyPositions: any[] = data?.copyPositions || initialPositions
  const recentTransactions: any[] = data?.recentTransactions || initialTx
  const topTraders: any[] = data?.topTraders || initialTraders

  const statCards = [
    {
      label: "Total Equity",
      value: formatCurrency(stats.equity),
      icon: Wallet,
      iconBg: "bg-primary/15 text-primary",
      sub: "Updated now",
    },
    {
      label: "Available Margin",
      value: formatCurrency(stats.available),
      icon: ArrowDownLeft,
      iconBg: "bg-profit-bg text-profit",
      sub: "Free to trade",
    },
    {
      label: "Invested",
      value: formatCurrency(stats.invested),
      icon: Layers,
      iconBg: "bg-secondary/15 text-secondary",
      sub: "Active positions",
    },
    {
      label: "Total Profit",
      value: formatCurrency(stats.totalProfit),
      icon: TrendingUp,
      iconBg: "bg-profit/15 text-profit",
      sub: "All time",
    },
    {
      label: "Free Margin",
      value: formatCurrency(stats.freeMargin),
      icon: Activity,
      iconBg: "bg-warning-bg text-warning",
      sub: "Available cash",
    },
    {
      label: "Open Positions",
      value: String(stats.openPositions),
      icon: Copy,
      iconBg: "bg-primary/15 text-primary",
      sub: "Live now",
    },
  ]

  return (
    <div className="flex w-full flex-col gap-5 pb-10">
      {/* ── Banners ── */}
      {(banners.balance || banners.kyc) && (
        <motion.div {...fu(0)} className="flex flex-col gap-2">
          {banners.balance && (
            <AlertBanner
              icon={AlertTriangle}
              variant="warning"
              message="Your balance is empty. Make a"
              linkText="Deposit"
              href="/dashboard/payments"
              onDismiss={() => setBanners((b) => ({ ...b, balance: false }))}
            />
          )}
          {banners.kyc && (
            <AlertBanner
              icon={Shield}
              variant="info"
              message="Complete your identity verification. Provide"
              linkText="KYC Data"
              href="/dashboard/settings"
              onDismiss={() => setBanners((b) => ({ ...b, kyc: false }))}
            />
          )}
        </motion.div>
      )}

      {/* ── Welcome ── */}
      <motion.div {...fu(0.05)}>
        <p className="mb-0.5 text-xs font-medium text-muted-foreground">
          {new Date().toLocaleDateString("en", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
        <h1 className="text-gradient text-2xl font-black tracking-tight sm:text-3xl">
          Welcome back, {displayName}!
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Here&apos;s your portfolio snapshot for today.
        </p>
      </motion.div>

      {/* ── Stats (2 col → 3 col → 6 col on very wide) ── */}
      <motion.div
        {...fu(0.1)}
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 2xl:grid-cols-6"
      >
        {statCards.map((c) => (
          <StatCard key={c.label} {...c} />
        ))}
      </motion.div>

      {/* ── Main chart + right panel ── */}
      <motion.div
        {...fu(0.15)}
        className="grid grid-cols-1 gap-4 xl:grid-cols-3"
      >
        <div className="min-w-0 xl:col-span-2">
          <LiveChart />
        </div>
        <div className="min-w-0">
          <RightPanel userStats={stats} />
        </div>
      </motion.div>

      {/* ── Top traders (horizontal scroll on mobile) ── */}
      <motion.div {...fu(0.25)}>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-bold">Top Traders to Copy</h2>
          </div>
          <a
            href="/dashboard/copytrading"
            className="flex items-center gap-1 text-xs font-semibold text-primary hover:opacity-80"
          >
            <ChevronRight className="h-3.5 w-3.5" />
            Browse All
          </a>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {topTraders.slice(0, 3).map((trader, i) => (
            <TraderCard
              key={trader.id}
              trader={trader}
              index={i}
              onCopy={handleCopy}
            />
          ))}
        </div>
      </motion.div>

      {/* ── Copy history + Transactions ── */}
      <motion.div
        {...fu(0.3)}
        className="grid grid-cols-1 gap-4 lg:grid-cols-2"
      >
        <CopyHistory copyPositions={copyPositions} />
        <Transactions recentTransactions={recentTransactions} />
      </motion.div>
    </div>
  )
}

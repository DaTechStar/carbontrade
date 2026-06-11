"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  TrendingUp,
  Wallet,
  ArrowDownLeft,
  Layers,
  Activity,
  Copy,
  AlertTriangle,
  Shield,
  ChevronRight,
  Users,
} from "lucide-react"
import useSWR from "swr"
import { useSession } from "next-auth/react"

import { Transaction, DashboardStats, CopyPosition, Trader } from "@/types"
import { formatCurrency } from "@/lib/utils"
import { TraderCard } from "@/components/dashboard/trader-card"
import { useCopyTrader } from "@/hooks/use-copy-trader"

// Extracted Components
import { AlertBanner } from "@/components/dashboard/overview/alert-banner"
import { StatCard } from "@/components/dashboard/overview/stat-card"
import { LiveChart } from "@/components/dashboard/overview/live-chart"
import { RightPanel } from "@/components/dashboard/overview/right-panel"
import { CopyHistory } from "@/components/dashboard/overview/copy-history"
import { Transactions } from "@/components/dashboard/overview/recent-transactions"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface DashboardClientProps {
  userStats: DashboardStats
  copyPositions: CopyPosition[]
  recentTransactions: Transaction[]
  topTraders: Trader[]
}

const fu = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" as const, delay },
})

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

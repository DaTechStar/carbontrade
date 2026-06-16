"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { ShieldCheck, Star, BarChart2, BrainCircuit, Zap } from "lucide-react"

import { formatCurrency } from "@/lib/utils"
import { type Trader } from "@/types"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n/context"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getBadgeStyle(badge: Trader["badge"]) {
  switch (badge) {
    case "Professional Trader":
      return "bg-primary/10 text-primary border-primary/20"
    case "Independent Analyst":
      return "bg-secondary/10 text-secondary border-secondary/20"
    case "Algo Trader":
      return "bg-warning/10 text-warning border-warning/20"
    case "Expert Advisor":
      return "bg-profit/10 text-profit border-profit/20"
    default:
      return "bg-muted/40 text-muted-foreground border-border/40"
  }
}

export function getBadgeIcon(badge: Trader["badge"]) {
  switch (badge) {
    case "Professional Trader":
      return <Star className="h-2.5 w-2.5" />
    case "Independent Analyst":
      return <BarChart2 className="h-2.5 w-2.5" />
    case "Algo Trader":
      return <BrainCircuit className="h-2.5 w-2.5" />
    case "Expert Advisor":
      return <Zap className="h-2.5 w-2.5" />
    default:
      return null
  }
}

// ─── Props ────────────────────────────────────────────────────────────────────

export interface TraderCardProps {
  trader: any
  index?: number
  onCopy?: (trader: any) => void
  className?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TraderCard({
  trader,
  index = 0,
  onCopy,
  className,
}: TraderCardProps) {
  const { t } = useLanguage()
  const isLive = trader.status === "active" || trader.status === "live"
  const minInvestment = trader.metrics?.minInvestment ?? trader.minCopy

  const primaryStats = [
    {
      labelKey: "dashboard.traderCard.winRate",
      value: `${trader.metrics?.winRate ?? trader.winRate}%`,
      green: true,
    },
    {
      labelKey: "dashboard.traderCard.monthly",
      value: `+${trader.metrics?.monthlyReturn ?? trader.monthlyReturn}%`,
      green: true,
    },
    {
      labelKey: "dashboard.traderCard.yearly",
      value: `+${trader.yearlyReturn ?? ((trader.metrics?.monthlyReturn ?? trader.monthlyReturn) * 12).toFixed(1)}%`,
      green: true,
    },
  ]

  const secondaryStats = [
    {
      labelKey: "dashboard.traderCard.experience",
      value: `${trader.experienceYears ?? 5} yrs`,
    },
    {
      labelKey: "dashboard.traderCard.copiers",
      value: trader.copiers ?? (((trader.name?.length || 5) * 43) % 900) + 500,
    },
    {
      labelKey: "dashboard.traderCard.share",
      value: `${trader.metrics?.profitShareFee ?? trader.fee}%`,
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.06, 0.4) }}
      layout
      className={cn("group", className)}
    >
      <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-card transition-all duration-300 hover:border-primary/30">
        {/* Glow */}
        <div
          className="pointer-events-none absolute -top-10 -left-10 h-40 w-40 rounded-full opacity-10 blur-[70px] transition-opacity duration-500 group-hover:opacity-20"
          style={{ background: trader.avatarColor || "#22c55e" }}
        />

        {/* ── Top: Avatar row ────────────────────────────────────── */}
        <div className="relative z-10 flex items-center justify-between px-4 pt-4 pb-3">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div
              className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl text-sm font-black text-primary-foreground shadow-md"
              style={{ background: trader.avatarColor || "#22c55e" }}
            >
              {trader.avatar?.startsWith("http") ? (
                <Image
                  src={trader.avatar}
                  alt={trader.name}
                  fill
                  draggable={false}
                  className="pointer-events-none object-cover select-none"
                />
              ) : (
                trader.avatar || trader.name?.substring(0, 2).toUpperCase()
              )}
            </div>

            {/* Name + role */}
            <div>
              <div className="flex items-center gap-1">
                <span className="text-sm leading-tight font-black text-foreground">
                  {trader.name}
                </span>
                {(trader.verified ?? true) && (
                  <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-primary" />
                )}
              </div>
              <div
                className={cn(
                  "mt-0.5 inline-flex items-center gap-1 text-[9px] font-semibold",
                  getBadgeStyle(trader.badge || trader.role)
                )}
              >
                {getBadgeIcon(trader.badge || trader.role)}
                {trader.badge || trader.role}
              </div>
            </div>
          </div>

          {/* Status */}
          <span
            suppressHydrationWarning
            className={cn(
              "rounded-full border px-2 py-0.5 text-[9px] font-black tracking-widest uppercase",
              isLive
                ? "border-profit/20 bg-profit/10 text-profit"
                : "border-border/30 bg-muted/30 text-muted-foreground"
            )}
          >
            {isLive
              ? t("dashboard.traderCard.live")
              : t("dashboard.traderCard.discontinued")}
          </span>
        </div>

        {/* ── Stats row: inline, 3 columns ───────────────────────── */}
        <div className="relative z-10 grid grid-cols-3 divide-x divide-border/30 border-y border-border/30 bg-muted/10">
          {primaryStats.map(({ labelKey, value, green }) => (
            <div
              key={labelKey}
              className="flex flex-col items-center gap-0.5 py-2.5"
            >
              <span
                suppressHydrationWarning
                className="text-[9px] font-medium tracking-wider text-muted-foreground uppercase"
              >
                {t(labelKey)}
              </span>
              <span
                className={cn(
                  "text-xs font-black",
                  green ? "text-profit" : "text-foreground"
                )}
              >
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* ── Secondary stats: 3 columns ─────────────────────────── */}
        <div className="relative z-10 grid grid-cols-3 divide-x divide-border/20 bg-muted/5">
          {secondaryStats.map(({ labelKey, value }) => (
            <div
              key={labelKey}
              className="flex flex-col items-center gap-0.5 py-2"
            >
              <span
                suppressHydrationWarning
                className="text-[9px] font-medium tracking-wider text-muted-foreground uppercase"
              >
                {t(labelKey)}
              </span>
              <span className="text-xs font-bold text-foreground">{value}</span>
            </div>
          ))}
        </div>

        {/* ── Footer: min copy + button ──────────────────────────── */}
        <div className="relative z-10 flex items-center justify-between border-t border-border/30 px-4 py-3">
          <div>
            <p
              suppressHydrationWarning
              className="text-[9px] tracking-wider text-muted-foreground uppercase"
            >
              {t("dashboard.traderCard.minCopy")}
            </p>
            <p className="text-xs font-black text-foreground">
              {formatCurrency(minInvestment)}
            </p>
          </div>
          {onCopy ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="sm"
                  className="h-7 rounded-lg border border-primary/20 bg-primary/10 px-4 text-[11px] font-bold text-primary shadow-none transition-all hover:border-primary/40 hover:bg-primary/20"
                  variant="ghost"
                >
                  <span suppressHydrationWarning>
                    {t("dashboard.traderCard.copyButton")}
                  </span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    <span suppressHydrationWarning>
                      {t("dashboard.traderCard.dialogTitle").replace(
                        "{{name}}",
                        trader.name
                      )}
                    </span>
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    <span suppressHydrationWarning>
                      {t("dashboard.traderCard.dialogDesc")
                        .replace("{{name}}", trader.name)
                        .replace("{{amount}}", formatCurrency(minInvestment))}
                    </span>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>
                    <span suppressHydrationWarning>
                      {t("dashboard.traderCard.cancel")}
                    </span>
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onCopy(trader)}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <span suppressHydrationWarning>
                      {t("dashboard.traderCard.confirmCopy")}
                    </span>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <Button
              size="sm"
              disabled
              className="h-7 rounded-lg border border-primary/20 bg-primary/10 px-4 text-[11px] font-bold text-primary shadow-none transition-all hover:border-primary/40 hover:bg-primary/20"
              variant="ghost"
            >
              <span suppressHydrationWarning>
                {t("dashboard.traderCard.copyButton")}
              </span>
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

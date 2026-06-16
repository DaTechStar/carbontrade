"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, ChevronRight, Users, TrendingUp } from "lucide-react"

import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/utils"
import { Tier } from "@/lib/rewards-config"
import { TierBadge } from "@/components/dashboard/rewards/tier-badge"
import { useLanguage } from "@/lib/i18n/context"

function progressTo(tier: Tier, currentDeposit: number) {
  if (tier.minDeposit === 0) return 100
  return Math.min(100, Math.round((currentDeposit / tier.minDeposit) * 100))
}

export function TierCard({
  tier,
  isActive,
  isUnlocked,
}: {
  tier: Tier
  isActive: boolean
  isUnlocked: boolean
}) {
  const [expanded, setExpanded] = useState(false)
  const { t } = useLanguage()
  const locked = !isUnlocked && !isActive

  return (
    <motion.div
      layout
      className={cn(
        "group cursor-pointer overflow-hidden rounded-2xl border transition-all duration-300",
        isActive
          ? cn("border-2", tier.border, "shadow-lg")
          : locked
            ? "border-border/20 opacity-60"
            : "border-border/30 hover:border-border/50"
      )}
      onClick={() => setExpanded((v) => !v)}
    >
      {/* Active glow strip */}
      {isActive && (
        <div className={cn("h-0.5 w-full bg-gradient-to-r", tier.gradient)} />
      )}

      <div className="flex items-center gap-4 p-4">
        <TierBadge tier={tier} size="md" active={isActive} locked={locked} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "text-sm font-black",
                isActive
                  ? tier.color
                  : locked
                    ? "text-muted-foreground/50"
                    : "text-foreground"
              )}
            >
              <span suppressHydrationWarning>
                {t(`dashboard.rewards.tier_${tier.id}`) || tier.name}
              </span>
            </span>
            <span
              suppressHydrationWarning
              className="rounded-full border border-border/30 bg-muted/30 px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground"
            >
              {t("dashboard.rewards.cardLevel")} {tier.level}
            </span>
            {isActive && (
              <span
                suppressHydrationWarning
                className="rounded-full border border-profit/20 bg-profit/10 px-2 py-0.5 text-[10px] font-black text-profit"
              >
                {t("dashboard.rewards.cardCurrent")}
              </span>
            )}
          </div>

          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5">
            <span
              suppressHydrationWarning
              className="text-[11px] text-muted-foreground"
            >
              {t("dashboard.rewards.cardMin")}{" "}
              <span className="font-semibold text-foreground">
                {formatCurrency(tier.minDeposit)}
              </span>
            </span>
            {tier.bonus > 0 && (
              <span
                suppressHydrationWarning
                className="text-[11px] text-muted-foreground"
              >
                {t("dashboard.rewards.cardBonus")}{" "}
                <span className="font-semibold text-profit">
                  {formatCurrency(tier.bonus)}
                </span>
              </span>
            )}
          </div>

          {/* Progress bar (for next tier) */}
          {!isActive && !locked && (
            <div className="mt-2">
              <div className="h-1 w-full rounded-full bg-muted/30">
                <div
                  className={cn(
                    "h-full rounded-full bg-gradient-to-r",
                    tier.gradient
                  )}
                  style={{ width: `${progressTo(tier, 0)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <ChevronRight
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
            expanded && "rotate-90"
          )}
        />
      </div>

      {/* Expanded perks */}
      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="border-t border-border/20 bg-muted/10"
        >
          <div className="grid gap-2 p-4 sm:grid-cols-2">
            {tier.perks.map((perk) => (
              <div key={perk} className="flex items-start gap-2">
                <Check
                  className={cn(
                    "mt-0.5 h-3.5 w-3.5 shrink-0",
                    locked ? "text-muted-foreground/30" : tier.color
                  )}
                />
                <span
                  suppressHydrationWarning
                  className={cn(
                    "text-xs leading-snug",
                    locked ? "text-muted-foreground/40" : "text-foreground/80"
                  )}
                >
                  {t(`dashboard.rewards.perks.${perk}`) || perk}
                </span>
              </div>
            ))}
          </div>
          {tier.minReferrals > 0 && (
            <div className="flex flex-wrap gap-4 px-4 pb-4">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Users className="h-3.5 w-3.5" />
                <span suppressHydrationWarning>
                  {t("dashboard.rewards.cardRequires")}{" "}
                  <span className="font-bold text-foreground">
                    {tier.minReferrals}
                  </span>{" "}
                  {t("dashboard.rewards.cardDirectRefs")}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <TrendingUp className="h-3.5 w-3.5" />
                <span suppressHydrationWarning>
                  {t("dashboard.rewards.cardRefDeposits")}{" "}
                  <span className="font-bold text-foreground">
                    {formatCurrency(tier.minReferralDeposits)}
                  </span>
                </span>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}

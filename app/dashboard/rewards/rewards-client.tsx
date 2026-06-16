"use client"

import { motion } from "framer-motion"
import { Crown, ArrowRight, Gift, Users, Lock, Check } from "lucide-react"

import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/utils"
import { TIERS } from "@/lib/rewards-config"
import { useLanguage } from "@/lib/i18n/context"
import { TierBadge } from "@/components/dashboard/rewards/tier-badge"
import { TierCard } from "@/components/dashboard/rewards/tier-card"
import { Card } from "@/components/ui/card"

const fu = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" as const, delay },
})

interface RewardsClientProps {
  currentLevel: number
  currentDeposit: number
  currentReferrals: number
  currentReferralDeposits: number
}

export default function RewardsClient({
  currentLevel,
  currentDeposit,
  currentReferrals,
  currentReferralDeposits,
}: RewardsClientProps) {
  const currentTier = TIERS.find((t) => t.level === currentLevel) || TIERS[0]
  const nextTier = TIERS.find((t) => t.level === currentLevel + 1)
  const progressPct = nextTier
    ? Math.min(100, Math.round((currentDeposit / nextTier.minDeposit) * 100))
    : 100
  const { t } = useLanguage()

  return (
    <div className="flex w-full flex-col gap-8 pb-12">
      {/* ── Header ── */}
      <motion.div {...fu(0)} className="flex items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/20">
          <Crown className="h-5 w-5 text-purple-400" />
        </div>
        <div>
          <h1
            suppressHydrationWarning
            className="text-2xl font-black tracking-tight sm:text-3xl"
          >
            {t("dashboard.rewards.title")}
          </h1>
          <p
            suppressHydrationWarning
            className="mt-0.5 text-sm text-muted-foreground"
          >
            {t("dashboard.rewards.subtitle")}
          </p>
        </div>
      </motion.div>

      {/* ── Hero: current status ── */}
      <motion.div {...fu(0.1)}>
        <div className="relative overflow-hidden rounded-2xl border border-border/30">
          {/* Background gradient */}
          <div
            className="pointer-events-none absolute inset-0 opacity-10"
            style={{
              background: `radial-gradient(ellipse at 20% 50%, ${currentTier.glow} 0%, transparent 70%)`,
            }}
          />

          <div className="relative z-10 flex flex-col items-start gap-6 p-6 sm:flex-row sm:items-center sm:p-8">
            {/* Big badge */}
            <TierBadge tier={currentTier} size="lg" active />

            {/* Status text */}
            <div className="min-w-0 flex-1">
              <p
                suppressHydrationWarning
                className="mb-1 text-xs font-bold tracking-widest text-muted-foreground uppercase"
              >
                {t("dashboard.rewards.yourRank")}
              </p>
              <div className="flex flex-wrap items-baseline gap-3">
                <h2
                  suppressHydrationWarning
                  className={cn(
                    "text-3xl font-black tracking-tight",
                    currentTier.color
                  )}
                >
                  {t(`dashboard.rewards.tier_${currentTier.id}`) ||
                    currentTier.name}
                </h2>
                <span
                  suppressHydrationWarning
                  className="text-sm font-bold text-muted-foreground"
                >
                  {t("dashboard.rewards.levelOf")
                    ?.replace("{{level}}", String(currentTier.level))
                    .replace("{{total}}", String(TIERS.length))}
                </span>
              </div>
              {nextTier && (
                <div className="mt-3">
                  <div className="mb-1.5 flex items-center justify-between">
                    <span
                      suppressHydrationWarning
                      className="text-xs text-muted-foreground"
                    >
                      {t("dashboard.rewards.progressTo")}{" "}
                      <span
                        suppressHydrationWarning
                        className={cn("font-bold", nextTier.color)}
                      >
                        {t(`dashboard.rewards.tier_${nextTier.id}`) ||
                          nextTier.name}
                      </span>
                    </span>
                    <span className="text-xs font-bold text-foreground">
                      {progressPct}%
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted/30">
                    <motion.div
                      className={cn(
                        "h-full rounded-full bg-gradient-to-r",
                        nextTier.gradient
                      )}
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPct}%` }}
                      transition={{
                        duration: 0.8,
                        ease: "easeOut",
                        delay: 0.3,
                      }}
                    />
                  </div>
                  <p
                    suppressHydrationWarning
                    className="mt-1.5 text-xs text-muted-foreground"
                  >
                    {t("dashboard.rewards.depositMore")
                      ?.replace(
                        "{{amount}}",
                        formatCurrency(
                          Math.max(0, nextTier.minDeposit - currentDeposit)
                        )
                      )
                      .replace(
                        "{{tier}}",
                        t(`dashboard.rewards.tier_${nextTier.id}`) ||
                          nextTier.name
                      )}
                  </p>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="flex shrink-0 flex-row gap-4 sm:flex-col sm:gap-3">
              {[
                {
                  label: t("dashboard.rewards.myDeposit"),
                  value: formatCurrency(currentDeposit),
                },
                {
                  label: t("dashboard.rewards.referrals"),
                  value: String(currentReferrals),
                },
                {
                  label: t("dashboard.rewards.refDeposits"),
                  value: formatCurrency(currentReferralDeposits),
                },
              ].map(({ label, value }) => (
                <div key={label} className="text-center sm:text-right">
                  <p
                    suppressHydrationWarning
                    className="text-[10px] tracking-wider text-muted-foreground uppercase"
                  >
                    {label}
                  </p>
                  <p className="text-sm font-black text-foreground">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Tier progression track ── */}
      <motion.div {...fu(0.15)}>
        <p
          suppressHydrationWarning
          className="mb-4 text-xs font-bold tracking-widest text-muted-foreground uppercase"
        >
          {t("dashboard.rewards.allTiers")}
        </p>
        <div className="scrollbar-hide flex items-center gap-0 overflow-x-auto pb-3">
          {TIERS.map((tier, i) => {
            const isActive = tier.level === currentLevel
            const isUnlocked = tier.level < currentLevel
            const locked = !isActive && !isUnlocked
            const Icon = locked ? Lock : tier.icon

            return (
              <div key={tier.id} className="flex shrink-0 items-center">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-2xl border-2 transition-all",
                      isActive
                        ? cn(
                            tier.bg,
                            tier.border,
                            "shadow-md ring-2 ring-offset-2 ring-offset-background",
                            tier.border.replace("border-", "ring-")
                          )
                        : isUnlocked
                          ? cn(tier.bg, tier.border)
                          : "border-border/20 bg-muted/10"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-5 w-5",
                        locked ? "text-muted-foreground/25" : tier.color
                      )}
                    />
                  </div>
                  <span
                    suppressHydrationWarning
                    className={cn(
                      "text-[10px] font-semibold whitespace-nowrap",
                      isActive
                        ? tier.color
                        : locked
                          ? "text-muted-foreground/30"
                          : "text-muted-foreground"
                    )}
                  >
                    {t(`dashboard.rewards.tier_${tier.id}`) || tier.name}
                  </span>
                </div>
                {i < TIERS.length - 1 && (
                  <div
                    className={cn(
                      "mx-1 h-0.5 w-8 rounded-full",
                      isUnlocked || isActive ? "bg-primary/40" : "bg-border/20"
                    )}
                  />
                )}
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* ── Main layout: tier list + next tier card ── */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Tier list */}
        <motion.div {...fu(0.2)} className="flex flex-col gap-3 xl:col-span-2">
          <p
            suppressHydrationWarning
            className="text-xs font-bold tracking-widest text-muted-foreground uppercase"
          >
            {t("dashboard.rewards.tierDetails")}
          </p>
          {TIERS.map((tier) => (
            <TierCard
              key={tier.id}
              tier={tier}
              isActive={tier.level === currentLevel}
              isUnlocked={tier.level < currentLevel}
            />
          ))}
        </motion.div>

        {/* Right column */}
        <motion.div {...fu(0.25)} className="flex flex-col gap-4">
          {/* Next tier unlock card */}
          {nextTier && (
            <Card
              className={cn(
                "relative overflow-hidden border-2",
                nextTier.border
              )}
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-5"
                style={{
                  background: `radial-gradient(ellipse at top left, ${nextTier.glow} 0%, transparent 70%)`,
                }}
              />
              <div className="relative z-10 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <TierBadge tier={nextTier} size="sm" />
                  <div>
                    <p
                      suppressHydrationWarning
                      className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase"
                    >
                      {t("dashboard.rewards.nextRank")}
                    </p>
                    <p
                      suppressHydrationWarning
                      className={cn("text-sm font-black", nextTier.color)}
                    >
                      {t(`dashboard.rewards.tier_${nextTier.id}`) ||
                        nextTier.name}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5">
                  {[
                    {
                      label: t("dashboard.rewards.reqDeposit"),
                      value: formatCurrency(nextTier.minDeposit),
                      diff:
                        formatCurrency(
                          Math.max(0, nextTier.minDeposit - currentDeposit)
                        ) +
                        " " +
                        t("dashboard.rewards.toGo"),
                    },
                    {
                      label: t("dashboard.rewards.bonusUnlock"),
                      value: formatCurrency(nextTier.bonus),
                      diff: null,
                    },
                    ...(nextTier.minReferrals > 0
                      ? [
                          {
                            label: t("dashboard.rewards.refsNeeded"),
                            value: String(nextTier.minReferrals),
                            diff: `${Math.max(0, nextTier.minReferrals - currentReferrals)} ${t("dashboard.rewards.more")}`,
                          },
                        ]
                      : []),
                  ].map(({ label, value, diff }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between"
                    >
                      <span
                        suppressHydrationWarning
                        className="text-xs text-muted-foreground"
                      >
                        {label}
                      </span>
                      <div className="text-right">
                        <span className="text-xs font-bold text-foreground">
                          {value}
                        </span>
                        {diff && (
                          <p
                            suppressHydrationWarning
                            className="text-[10px] text-muted-foreground"
                          >
                            {diff}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="h-1.5 overflow-hidden rounded-full bg-muted/30">
                  <motion.div
                    className={cn(
                      "h-full rounded-full bg-gradient-to-r",
                      nextTier.gradient
                    )}
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPct}%` }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
                  />
                </div>

                <a
                  href="/dashboard/payments?tab=deposit"
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-black transition-all",
                    "bg-gradient-to-r text-primary-foreground shadow-md hover:opacity-90 active:scale-95",
                    nextTier.gradient
                  )}
                >
                  <span suppressHydrationWarning>
                    {t("dashboard.rewards.depositToRankUp")}
                  </span>{" "}
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </Card>
          )}

          {/* Referral boost card */}
          <Card className="flex flex-col gap-3 border-primary/20 bg-primary/5">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/15">
                <Gift className="h-4 w-4 text-primary" />
              </div>
              <p suppressHydrationWarning className="text-sm font-bold">
                {t("dashboard.rewards.boostWithRefs")}
              </p>
            </div>
            <p
              suppressHydrationWarning
              className="text-xs leading-relaxed text-muted-foreground"
            >
              {t("dashboard.rewards.boostDesc")}
            </p>
            <div className="flex flex-col gap-1.5">
              {[
                { tier: "Diamond", refs: 5, deposits: "$500K" },
                { tier: "Ambassador", refs: 12, deposits: "$2.55M" },
              ].map(({ tier, refs, deposits }) => (
                <div
                  key={tier}
                  className="flex items-center justify-between border-b border-border/20 py-1.5 last:border-0"
                >
                  <span className="text-xs text-muted-foreground">{tier}</span>
                  <div className="flex items-center gap-3">
                    <span
                      suppressHydrationWarning
                      className="text-[10px] text-muted-foreground"
                    >
                      {refs} {t("dashboard.rewards.refsShort")}
                    </span>
                    <span
                      suppressHydrationWarning
                      className="text-[10px] font-bold text-foreground"
                    >
                      {deposits} {t("dashboard.rewards.volShort")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button className="flex items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/10 py-2 text-xs font-bold text-primary transition-all hover:bg-primary/20">
              <Users className="h-3.5 w-3.5" />
              <span suppressHydrationWarning>
                {t("dashboard.rewards.viewRefProg")}
              </span>
            </button>
          </Card>

          {/* Perks summary */}
          <Card className="flex flex-col gap-3">
            <p
              suppressHydrationWarning
              className="text-xs font-bold tracking-widest text-muted-foreground uppercase"
            >
              {t("dashboard.rewards.activePerks")}
            </p>
            {currentTier.perks.map((perk) => (
              <div key={perk} className="flex items-start gap-2">
                <Check
                  className={cn(
                    "mt-0.5 h-3.5 w-3.5 shrink-0",
                    currentTier.color
                  )}
                />
                <span
                  suppressHydrationWarning
                  className="text-xs leading-snug text-foreground/80"
                >
                  {t(`dashboard.rewards.perks.${perk}`) || perk}
                </span>
              </div>
            ))}
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

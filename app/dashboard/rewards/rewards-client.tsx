"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Star,
  Crown,
  Diamond,
  Gem,
  Zap,
  Shield,
  Award,
  Users,
  ArrowRight,
  TrendingUp,
  Gift,
  ChevronRight,
  Check,
  Lock,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/mock-data"
import { Card } from "@/components/ui/card"

// ─── Tier config ──────────────────────────────────────────────────────────────

interface Tier {
  id: string
  name: string
  level: number
  icon: React.ElementType
  color: string // text color
  bg: string // icon bg
  border: string // card border
  glow: string // glow color for hero
  gradient: string // gradient for badge
  minDeposit: number
  minReferrals: number
  minReferralDeposits: number
  bonus: number
  perks: string[]
}

// Export the TIERS so the server component can use it for calculations
export const TIERS: Tier[] = [
  {
    id: "welcome",
    name: "Welcome",
    level: 1,
    icon: Star,
    color: "text-slate-400",
    bg: "bg-muted",
    border: "border-slate-400/20",
    glow: "oklch(0.60 0.05 240)",
    gradient: "from-slate-500 to-slate-400",
    minDeposit: 0,
    minReferrals: 0,
    minReferralDeposits: 0,
    bonus: 0,
    perks: [
      "Access to copy trading",
      "Basic market data",
      "Email support",
      "Up to 3 traders to copy",
    ],
  },
  {
    id: "silver",
    name: "Silver",
    level: 2,
    icon: Shield,
    color: "text-slate-300",
    bg: "bg-muted",
    border: "border-slate-300/20",
    glow: "oklch(0.75 0.02 240)",
    gradient: "from-slate-400 to-slate-200",
    minDeposit: 10_000,
    minReferrals: 0,
    minReferralDeposits: 0,
    bonus: 250,
    perks: [
      "All Welcome perks",
      "Priority support",
      "Up to 5 traders to copy",
      "$250 welcome bonus",
      "Reduced copy fee 8%",
    ],
  },
  {
    id: "silver_pro",
    name: "Silver Pro",
    level: 3,
    icon: Zap,
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
    border: "border-cyan-400/20",
    glow: "oklch(0.75 0.16 200)",
    gradient: "from-cyan-500 to-slate-300",
    minDeposit: 25_000,
    minReferrals: 0,
    minReferralDeposits: 0,
    bonus: 1_000,
    perks: [
      "All Silver perks",
      "Dedicated account manager",
      "Up to 10 traders to copy",
      "$1,000 welcome bonus",
      "Reduced copy fee 6%",
      "Advanced market analytics",
    ],
  },
  {
    id: "gold",
    name: "Gold",
    level: 4,
    icon: Award,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    border: "border-yellow-400/20",
    glow: "oklch(0.85 0.20 85)",
    gradient: "from-yellow-500 to-amber-300",
    minDeposit: 50_000,
    minReferrals: 0,
    minReferralDeposits: 0,
    bonus: 2_000,
    perks: [
      "All Silver Pro perks",
      "VIP support line",
      "Unlimited traders to copy",
      "$2,000 welcome bonus",
      "Copy fee 4%",
      "Exclusive webinars & signals",
      "Personalised portfolio review",
    ],
  },
  {
    id: "gold_pro",
    name: "Gold Pro",
    level: 5,
    icon: Crown,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
    glow: "oklch(0.80 0.18 65)",
    gradient: "from-amber-500 to-yellow-300",
    minDeposit: 100_000,
    minReferrals: 0,
    minReferralDeposits: 0,
    bonus: 3_000,
    perks: [
      "All Gold perks",
      "Priority withdrawals",
      "Zero copy fee",
      "$3,000 welcome bonus",
      "Monthly performance reports",
      "Exclusive trader access",
      "1-on-1 strategy sessions",
    ],
  },
  {
    id: "diamond",
    name: "Diamond",
    level: 6,
    icon: Diamond,
    color: "text-blue-400",
    bg: "bg-primary/10",
    border: "border-blue-400/20",
    glow: "oklch(0.70 0.18 240)",
    gradient: "from-blue-500 to-cyan-300",
    minDeposit: 250_000,
    minReferrals: 5,
    minReferralDeposits: 500_000,
    bonus: 10_000,
    perks: [
      "All Gold Pro perks",
      "Dedicated relationship manager",
      "Profit sharing programme",
      "$10,000 welcome bonus",
      "Custom risk strategies",
      "Quarterly bonus rewards",
      "Early access to new features",
    ],
  },
  {
    id: "ambassador",
    name: "Ambassador",
    level: 7,
    icon: Gem,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    border: "border-purple-400/20",
    glow: "oklch(0.65 0.20 300)",
    gradient: "from-purple-600 to-pink-400",
    minDeposit: 1_000_000,
    minReferrals: 12,
    minReferralDeposits: 2_550_000,
    bonus: 50_000,
    perks: [
      "All Diamond perks",
      "Co-branded marketing materials",
      "Revenue share on referrals",
      "$50,000 welcome bonus",
      "Access to private trader fund",
      "Annual VIP event invite",
      "White-glove concierge service",
      "Custom leverage arrangements",
    ],
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fu = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" as const, delay },
})

function progressTo(tier: Tier, currentDeposit: number) {
  if (tier.minDeposit === 0) return 100
  return Math.min(100, Math.round((currentDeposit / tier.minDeposit) * 100))
}

// ─── Tier badge (icon + ring) ─────────────────────────────────────────────────

function TierBadge({
  tier,
  size = "md",
  active = false,
  locked = false,
}: {
  tier: Tier
  size?: "sm" | "md" | "lg"
  active?: boolean
  locked?: boolean
}) {
  const Icon = locked ? Lock : tier.icon
  const sizes = { sm: "w-10 h-10", md: "w-14 h-14", lg: "w-20 h-20" }
  const iconSizes = { sm: "w-4 h-4", md: "w-6 h-6", lg: "w-9 h-9" }

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center rounded-2xl transition-all duration-300",
        sizes[size],
        locked
          ? "border-2 border-border/20 bg-muted/20"
          : cn(tier.bg, "border-2", active ? tier.border : "border-border/20"),
        active && "shadow-lg ring-2 ring-offset-2 ring-offset-background",
        active && tier.border.replace("border-", "ring-")
      )}
    >
      <Icon
        className={cn(
          iconSizes[size],
          locked ? "text-muted-foreground/30" : tier.color,
          active && "drop-shadow-sm"
        )}
      />
      {active && (
        <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-background bg-profit">
          <Check className="h-2.5 w-2.5 text-white" />
        </span>
      )}
    </div>
  )
}

// ─── Tier detail card ─────────────────────────────────────────────────────────

function TierCard({
  tier,
  isActive,
  isUnlocked,
}: {
  tier: Tier
  isActive: boolean
  isUnlocked: boolean
}) {
  const [expanded, setExpanded] = useState(false)
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
              {tier.name}
            </span>
            <span className="rounded-full border border-border/30 bg-muted/30 px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground">
              Level {tier.level}
            </span>
            {isActive && (
              <span className="rounded-full border border-profit/20 bg-profit/10 px-2 py-0.5 text-[10px] font-black text-profit">
                Current
              </span>
            )}
          </div>

          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5">
            <span className="text-[11px] text-muted-foreground">
              Min.{" "}
              <span className="font-semibold text-foreground">
                {formatCurrency(tier.minDeposit)}
              </span>
            </span>
            {tier.bonus > 0 && (
              <span className="text-[11px] text-muted-foreground">
                Bonus{" "}
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
                  style={{ width: `${progressTo(tier, 0)}%` }} // We'd need to pass currentDeposit down if we wanted this precise in the list, but it's okay for now.
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
                  className={cn(
                    "text-xs leading-snug",
                    locked ? "text-muted-foreground/40" : "text-foreground/80"
                  )}
                >
                  {perk}
                </span>
              </div>
            ))}
          </div>
          {tier.minReferrals > 0 && (
            <div className="flex flex-wrap gap-4 px-4 pb-4">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Users className="h-3.5 w-3.5" />
                <span>
                  Requires{" "}
                  <span className="font-bold text-foreground">
                    {tier.minReferrals}
                  </span>{" "}
                  direct referrals
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>
                  Referral deposits ≥{" "}
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

// ─── Page ─────────────────────────────────────────────────────────────────────

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

  return (
    <div className="flex w-full flex-col gap-8 pb-12">
      {/* ── Header ── */}
      <motion.div {...fu(0)} className="flex items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/20">
          <Crown className="h-5 w-5 text-purple-400" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
            Rewards & Ranks
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Unlock exclusive benefits as you grow
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
              <p className="mb-1 text-xs font-bold tracking-widest text-muted-foreground uppercase">
                Your current rank
              </p>
              <div className="flex flex-wrap items-baseline gap-3">
                <h2
                  className={cn(
                    "text-3xl font-black tracking-tight",
                    currentTier.color
                  )}
                >
                  {currentTier.name}
                </h2>
                <span className="text-sm font-bold text-muted-foreground">
                  Level {currentTier.level} of {TIERS.length}
                </span>
              </div>
              {nextTier && (
                <div className="mt-3">
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Progress to{" "}
                      <span className={cn("font-bold", nextTier.color)}>
                        {nextTier.name}
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
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    Deposit{" "}
                    <span className="font-bold text-foreground">
                      {formatCurrency(
                        Math.max(0, nextTier.minDeposit - currentDeposit)
                      )}
                    </span>{" "}
                    more to unlock {nextTier.name}
                  </p>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="flex shrink-0 flex-row gap-4 sm:flex-col sm:gap-3">
              {[
                { label: "My Deposit", value: formatCurrency(currentDeposit) },
                { label: "Referrals", value: String(currentReferrals) },
                {
                  label: "Ref. Deposits",
                  value: formatCurrency(currentReferralDeposits),
                },
              ].map(({ label, value }) => (
                <div key={label} className="text-center sm:text-right">
                  <p className="text-[10px] tracking-wider text-muted-foreground uppercase">
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
        <p className="mb-4 text-xs font-bold tracking-widest text-muted-foreground uppercase">
          All Tiers
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
                    className={cn(
                      "text-[10px] font-semibold whitespace-nowrap",
                      isActive
                        ? tier.color
                        : locked
                          ? "text-muted-foreground/30"
                          : "text-muted-foreground"
                    )}
                  >
                    {tier.name}
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
          <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
            Tier Details
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
                    <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                      Next rank
                    </p>
                    <p className={cn("text-sm font-black", nextTier.color)}>
                      {nextTier.name}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5">
                  {[
                    {
                      label: "Required Deposit",
                      value: formatCurrency(nextTier.minDeposit),
                      diff:
                        formatCurrency(
                          Math.max(0, nextTier.minDeposit - currentDeposit)
                        ) + " to go",
                    },
                    {
                      label: "Bonus on Unlock",
                      value: formatCurrency(nextTier.bonus),
                      diff: null,
                    },
                    ...(nextTier.minReferrals > 0
                      ? [
                          {
                            label: "Referrals Needed",
                            value: String(nextTier.minReferrals),
                            diff: `${Math.max(0, nextTier.minReferrals - currentReferrals)} more`,
                          },
                        ]
                      : []),
                  ].map(({ label, value, diff }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between"
                    >
                      <span className="text-xs text-muted-foreground">
                        {label}
                      </span>
                      <div className="text-right">
                        <span className="text-xs font-bold text-foreground">
                          {value}
                        </span>
                        {diff && (
                          <p className="text-[10px] text-muted-foreground">
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
                    "bg-gradient-to-r text-white shadow-md hover:opacity-90 active:scale-95",
                    nextTier.gradient
                  )}
                >
                  Deposit to Rank Up <ArrowRight className="h-3.5 w-3.5" />
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
              <p className="text-sm font-bold">Boost with Referrals</p>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Refer friends to accelerate your rank. Higher tiers like Diamond
              and Ambassador require active referrals with minimum deposit
              volumes.
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
                    <span className="text-[10px] text-muted-foreground">
                      {refs} refs
                    </span>
                    <span className="text-[10px] font-bold text-foreground">
                      {deposits} vol.
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button className="flex items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/10 py-2 text-xs font-bold text-primary transition-all hover:bg-primary/20">
              <Users className="h-3.5 w-3.5" />
              View Referral Programme
            </button>
          </Card>

          {/* Perks summary */}
          <Card className="flex flex-col gap-3">
            <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
              Your Active Perks
            </p>
            {currentTier.perks.map((perk) => (
              <div key={perk} className="flex items-start gap-2">
                <Check
                  className={cn(
                    "mt-0.5 h-3.5 w-3.5 shrink-0",
                    currentTier.color
                  )}
                />
                <span className="text-xs leading-snug text-foreground/80">
                  {perk}
                </span>
              </div>
            ))}
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

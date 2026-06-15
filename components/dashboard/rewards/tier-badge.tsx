import { Check, Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tier } from "@/lib/rewards-config"

export function TierBadge({
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
          <Check className="h-2.5 w-2.5 text-primary-foreground" />
        </span>
      )}
    </div>
  )
}

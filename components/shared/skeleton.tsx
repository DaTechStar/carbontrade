import { cn } from "@/lib/utils"

interface SkeletonProps {
  className?: string
  /** Rounded shape */
  rounded?: "sm" | "md" | "lg" | "full"
  /** Number of repeated rows (for lists) */
  lines?: number
  /** Show as a full card block with inner structure */
  variant?: "text" | "card" | "avatar" | "stat" | "trader-card" | "table-row"
}

function SkeletonBase({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded bg-gradient-to-r from-muted/40 via-muted/70 to-muted/40 bg-[length:200%_100%]",
        "[animation:shimmer_1.8s_ease-in-out_infinite]",
        className
      )}
    />
  )
}

// Stat card skeleton — mirrors the summary cards on the dashboard
function StatSkeleton() {
  return (
    <div className="glass-card flex flex-col gap-3 rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <SkeletonBase className="h-3.5 w-24" />
        <SkeletonBase className="h-8 w-8 rounded-xl" />
      </div>
      <SkeletonBase className="h-7 w-32" />
      <SkeletonBase className="h-3 w-20" />
    </div>
  )
}

// Trader card skeleton
function TraderCardSkeleton() {
  return (
    <div className="glass-card flex min-w-[260px] flex-col gap-4 rounded-2xl p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <SkeletonBase className="h-11 w-11 rounded-full" />
          <div className="flex flex-col gap-1.5">
            <SkeletonBase className="h-4 w-28" />
            <SkeletonBase className="h-3 w-20" />
          </div>
        </div>
        <SkeletonBase className="h-5 w-14 rounded-full" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-1">
            <SkeletonBase className="h-3 w-12" />
            <SkeletonBase className="h-4 w-16" />
          </div>
        ))}
      </div>
      <SkeletonBase className="h-9 w-full rounded-xl" />
    </div>
  )
}

// Table row skeleton
function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 border-b border-border/30 py-3">
      <SkeletonBase className="h-4 w-4 rounded-sm" />
      <SkeletonBase className="h-4 w-24 flex-1" />
      <SkeletonBase className="h-4 w-16" />
      <SkeletonBase className="h-4 w-14" />
      <SkeletonBase className="h-5 w-16 rounded-full" />
    </div>
  )
}

export function Skeleton({
  className,
  rounded = "md",
  lines = 1,
  variant = "text",
}: SkeletonProps) {
  const roundedMap = {
    sm: "rounded",
    md: "rounded-lg",
    lg: "rounded-2xl",
    full: "rounded-full",
  }

  if (variant === "stat") return <StatSkeleton />
  if (variant === "trader-card") return <TraderCardSkeleton />
  if (variant === "table-row") {
    return (
      <>
        {Array.from({ length: lines }).map((_, i) => (
          <TableRowSkeleton key={i} />
        ))}
      </>
    )
  }
  if (variant === "avatar") {
    return <SkeletonBase className={cn("h-10 w-10 rounded-full", className)} />
  }
  if (variant === "card") {
    return (
      <div
        className={cn(
          "glass-card flex flex-col gap-3 rounded-2xl p-5",
          roundedMap[rounded],
          className
        )}
      >
        <SkeletonBase className="h-4 w-2/3" />
        <SkeletonBase className="h-4 w-1/2" />
        <SkeletonBase className="mt-2 h-24 w-full" />
      </div>
    )
  }

  // Default: text lines
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonBase
          key={i}
          className={cn(
            "h-4",
            roundedMap[rounded],
            i === lines - 1 && lines > 1 ? "w-2/3" : "w-full"
          )}
        />
      ))}
    </div>
  )
}

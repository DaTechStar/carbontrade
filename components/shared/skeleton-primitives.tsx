// Shared shimmer base — used by all dashboard loading skeletons
export function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={["animate-pulse rounded-xl bg-muted/40", className]
        .filter(Boolean)
        .join(" ")}
    />
  )
}

// ─── Building blocks ──────────────────────────────────────────────────────────

/** Matches the StatCard in page-client.tsx */
export function StatCardSkeleton() {
  return (
    <div className="glass-card flex flex-col gap-3 rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <Shimmer className="h-3 w-24" />
        <Shimmer className="h-8 w-8 rounded-xl" />
      </div>
      <Shimmer className="h-7 w-28" />
      <Shimmer className="h-3 w-16" />
    </div>
  )
}

/** Matches the TraderCard in trader-card.tsx */
export function TraderCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/40 bg-card">
      {/* Avatar row */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <div className="flex items-center gap-3">
          <Shimmer className="h-10 w-10 rounded-xl" />
          <div className="flex flex-col gap-1.5">
            <Shimmer className="h-3.5 w-24" />
            <Shimmer className="h-2.5 w-16" />
          </div>
        </div>
        <Shimmer className="h-5 w-12 rounded-full" />
      </div>
      {/* Stats row */}
      <div className="grid grid-cols-3 divide-x divide-border/30 border-y border-border/30">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex flex-col items-center gap-1.5 py-2.5">
            <Shimmer className="h-2.5 w-10" />
            <Shimmer className="h-3.5 w-12" />
          </div>
        ))}
      </div>
      {/* Secondary stats */}
      <div className="grid grid-cols-3 divide-x divide-border/20">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex flex-col items-center gap-1 py-2">
            <Shimmer className="h-2.5 w-8" />
            <Shimmer className="h-3 w-10" />
          </div>
        ))}
      </div>
      {/* Footer */}
      <div className="flex items-center justify-between border-t border-border/30 px-4 py-3">
        <div className="flex flex-col gap-1">
          <Shimmer className="h-2.5 w-12" />
          <Shimmer className="h-3.5 w-16" />
        </div>
        <Shimmer className="h-7 w-14 rounded-lg" />
      </div>
    </div>
  )
}

/** Matches a table row with N columns */
export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <tr className="border-b border-border/20">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-5 py-3">
          <Shimmer
            className={`h-3.5 ${i === 0 ? "w-28" : i === cols - 1 ? "w-14" : "w-20"}`}
          />
        </td>
      ))}
    </tr>
  )
}

/** Generic card shell with optional inner lines */
export function CardSkeleton({
  lines = 3,
  className = "",
}: {
  lines?: number
  className?: string
}) {
  return (
    <div
      className={`glass-card flex flex-col gap-3 rounded-2xl p-5 ${className}`}
    >
      <Shimmer className="h-4 w-1/3" />
      {Array.from({ length: lines }).map((_, i) => (
        <Shimmer
          key={i}
          className={`h-3.5 ${i % 2 === 0 ? "w-full" : "w-3/4"}`}
        />
      ))}
    </div>
  )
}

/** Transaction row skeleton (icon + text + amount) */
export function TxRowSkeleton() {
  return (
    <div className="flex items-center gap-3 p-2">
      <Shimmer className="h-8 w-8 shrink-0 rounded-xl" />
      <div className="flex flex-1 flex-col gap-1.5">
        <Shimmer className="h-3 w-40" />
        <Shimmer className="h-2.5 w-20" />
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <Shimmer className="h-3 w-16" />
        <Shimmer className="h-4 w-14 rounded-full" />
      </div>
    </div>
  )
}

/** Page header (icon + title + subtitle) */
export function PageHeaderSkeleton() {
  return (
    <div className="flex items-center gap-3">
      <Shimmer className="h-11 w-11 shrink-0 rounded-xl" />
      <div className="flex flex-col gap-2">
        <Shimmer className="h-7 w-40" />
        <Shimmer className="h-3 w-64" />
      </div>
    </div>
  )
}

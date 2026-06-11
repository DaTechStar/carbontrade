"use client"

import {
  Shimmer,
  StatCardSkeleton,
  PageHeaderSkeleton,
  TxRowSkeleton,
  CardSkeleton,
} from "@/components/shared/skeleton-primitives"

export default function TransactionsLoading() {
  return (
    <div className="flex w-full animate-in flex-col gap-6 pb-12 duration-500 fade-in">
      {/* Header */}
      <PageHeaderSkeleton />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      {/* Filters bar */}
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <Shimmer className="h-11 flex-1 rounded-xl" />
          <Shimmer className="h-11 w-24 rounded-xl" />
        </div>
      </div>

      {/* Transaction list */}
      <div className="flex flex-col gap-6">
        <div>
          <div className="mb-2 flex items-center gap-3 px-1">
            <Shimmer className="h-3 w-32" />
            <div className="h-px flex-1 bg-border/30" />
            <Shimmer className="h-3 w-12" />
          </div>
          <div className="glass-card flex flex-col gap-0 divide-y divide-border/20 overflow-hidden rounded-2xl">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-3.5">
                <TxRowSkeleton />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

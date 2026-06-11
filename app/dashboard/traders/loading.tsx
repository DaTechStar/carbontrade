"use client"

import {
  Shimmer,
  PageHeaderSkeleton,
  TraderCardSkeleton,
} from "@/components/shared/skeleton-primitives"

export default function TradersLoading() {
  return (
    <div className="mx-auto flex w-full max-w-6xl animate-in flex-col gap-6 pt-6 pb-16 duration-500 fade-in">
      {/* Header */}
      <PageHeaderSkeleton />

      {/* Search + Sort row */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Shimmer className="h-11 flex-1 rounded-xl" />
        <Shimmer className="h-11 w-32 rounded-xl" />
      </div>

      {/* Badge filter pills */}
      <div className="mt-2 flex flex-wrap gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Shimmer key={i} className="h-7 w-20 rounded-full" />
        ))}
      </div>

      {/* Results count */}
      <Shimmer className="-mt-2 h-4 w-32" />

      {/* Trader Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <TraderCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

"use client"

import {
  Shimmer,
  StatCardSkeleton,
  TraderCardSkeleton,
  CardSkeleton,
  TxRowSkeleton,
} from "@/components/shared/skeleton-primitives"

export default function DashboardLoading() {
  return (
    <div className="flex w-full animate-in flex-col gap-5 pb-10 duration-500 fade-in">
      {/* Banners skeleton */}
      <div className="flex flex-col gap-2">
        <Shimmer className="h-10 w-full rounded-xl" />
      </div>

      {/* Welcome */}
      <div>
        <Shimmer className="mb-2 h-4 w-32" />
        <Shimmer className="mb-2 h-8 w-64" />
        <Shimmer className="h-4 w-48" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 2xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      {/* Main chart + right panel */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <CardSkeleton className="h-[460px]" />
        </div>
        <div>
          <CardSkeleton className="h-[460px]" />
        </div>
      </div>

      {/* Top traders */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <Shimmer className="h-5 w-40" />
          <Shimmer className="h-4 w-20" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <TraderCardSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* Copy history + Transactions */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <CardSkeleton className="h-[300px]" lines={5} />
        <div className="glass-card flex flex-col gap-3 rounded-2xl p-5">
          <Shimmer className="h-5 w-40" />
          <Shimmer className="h-10 w-full rounded-xl" />
          <div className="mt-2 flex flex-col gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <TxRowSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

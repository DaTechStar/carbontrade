"use client"

import {
  Shimmer,
  PageHeaderSkeleton,
  TraderCardSkeleton,
  CardSkeleton,
} from "@/components/shared/skeleton-primitives"

export default function CopytradingLoading() {
  return (
    <div className="mx-auto flex w-full max-w-5xl animate-in flex-col gap-8 pt-6 pb-16 duration-500 fade-in">
      {/* Header */}
      <PageHeaderSkeleton />

      {/* Top Traders section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shimmer className="h-4 w-4 rounded-full" />
            <Shimmer className="h-5 w-32" />
          </div>
          <Shimmer className="h-4 w-20" />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <TraderCardSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* History */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Shimmer className="h-4 w-4 rounded-full" />
          <Shimmer className="h-5 w-32" />
        </div>
        <CardSkeleton lines={5} className="h-[300px]" />
      </div>
    </div>
  )
}

"use client"

import {
  Shimmer,
  PageHeaderSkeleton,
  CardSkeleton,
} from "@/components/shared/skeleton-primitives"

export default function MarketsLoading() {
  return (
    <div className="flex w-full animate-in flex-col gap-6 pb-12 duration-500 fade-in">
      {/* Header */}
      <PageHeaderSkeleton />

      {/* Main layout */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        {/* Left col */}
        <div className="flex flex-col gap-4 xl:col-span-2">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Shimmer key={i} className="h-8 w-20 rounded-xl" />
              ))}
              <Shimmer className="ml-auto h-8 w-36 rounded-xl" />
            </div>
            <div className="flex gap-2 overflow-x-hidden">
              {Array.from({ length: 8 }).map((_, i) => (
                <Shimmer key={i} className="h-7 w-24 shrink-0 rounded-lg" />
              ))}
            </div>
          </div>

          {/* Chart card */}
          <CardSkeleton className="h-[530px]" />
        </div>

        {/* Right col */}
        <div className="flex flex-col gap-4">
          <CardSkeleton className="h-[600px]" />

          {/* Quick tips */}
          <div className="glass-card flex flex-col gap-3 rounded-2xl p-5">
            <div className="flex items-center gap-2">
              <Shimmer className="h-4 w-4 rounded-full" />
              <Shimmer className="h-4 w-24" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Shimmer key={i} className="h-[52px] rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import {
  Shimmer,
  PageHeaderSkeleton,
  CardSkeleton,
} from "@/components/shared/skeleton-primitives"

export default function RewardsLoading() {
  return (
    <div className="flex w-full animate-in flex-col gap-8 pb-12 duration-500 fade-in">
      {/* Header */}
      <PageHeaderSkeleton />

      {/* Hero card */}
      <div className="glass-card flex flex-col items-start gap-6 rounded-2xl border border-border/30 p-6 sm:flex-row sm:items-center sm:p-8">
        <Shimmer className="h-20 w-20 shrink-0 rounded-2xl" />
        <div className="flex w-full min-w-0 flex-1 flex-col gap-3">
          <Shimmer className="h-3 w-32" />
          <Shimmer className="h-8 w-64" />
          <Shimmer className="mt-2 h-2 w-full max-w-sm rounded-full" />
          <Shimmer className="h-3 w-48" />
        </div>
        <div className="flex shrink-0 flex-row gap-4 sm:flex-col sm:gap-3">
          <Shimmer className="h-8 w-24" />
          <Shimmer className="h-8 w-24" />
          <Shimmer className="h-8 w-24" />
        </div>
      </div>

      {/* Tier progression track */}
      <div>
        <Shimmer className="mb-4 h-3 w-20" />
        <div className="flex items-center gap-4 overflow-hidden">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex shrink-0 items-center gap-4">
              <div className="flex flex-col items-center gap-2">
                <Shimmer className="h-12 w-12 rounded-2xl" />
                <Shimmer className="h-2.5 w-16" />
              </div>
              {i < 6 && <Shimmer className="h-0.5 w-8 rounded-full" />}
            </div>
          ))}
        </div>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Tier list */}
        <div className="flex flex-col gap-3 xl:col-span-2">
          <Shimmer className="mb-2 h-3 w-24" />
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="glass-card flex items-center gap-4 rounded-2xl border border-border/30 p-4"
            >
              <Shimmer className="h-14 w-14 shrink-0 rounded-2xl" />
              <div className="flex-1">
                <Shimmer className="mb-2 h-4 w-40" />
                <Shimmer className="h-3 w-32" />
              </div>
            </div>
          ))}
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          <CardSkeleton lines={4} />
          <CardSkeleton lines={3} />
          <CardSkeleton lines={5} />
        </div>
      </div>
    </div>
  )
}

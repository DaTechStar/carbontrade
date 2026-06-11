"use client"

import {
  Shimmer,
  PageHeaderSkeleton,
  CardSkeleton,
} from "@/components/shared/skeleton-primitives"

export default function SettingsLoading() {
  return (
    <div className="flex w-full animate-in flex-col gap-6 pb-12 duration-500 fade-in">
      {/* Header */}
      <PageHeaderSkeleton />

      {/* Tab bar */}
      <div className="flex gap-1 rounded-2xl border border-border/30 bg-muted/20 p-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <Shimmer key={i} className="h-10 flex-1 rounded-xl" />
        ))}
      </div>

      {/* Profile tab skeleton */}
      <div className="flex flex-col gap-6">
        {/* Avatar */}
        <div className="glass-card flex flex-col items-center gap-5 rounded-2xl p-5 sm:flex-row">
          <Shimmer className="h-20 w-20 shrink-0 rounded-2xl" />
          <div className="flex flex-1 flex-col items-center gap-2 text-center sm:items-start sm:text-left">
            <Shimmer className="h-5 w-40" />
            <Shimmer className="h-4 w-48" />
            <div className="mt-2 flex items-center gap-2">
              <Shimmer className="h-5 w-16 rounded-full" />
              <Shimmer className="h-5 w-16 rounded-full" />
            </div>
          </div>
          <Shimmer className="h-9 w-28 rounded-xl" />
        </div>

        {/* Personal info */}
        <CardSkeleton lines={6} />

        {/* KYC */}
        <CardSkeleton lines={3} />

        {/* Notifications */}
        <CardSkeleton lines={5} />
      </div>
    </div>
  )
}

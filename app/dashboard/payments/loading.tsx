"use client"

import { Shimmer, CardSkeleton } from "@/components/shared/skeleton-primitives"

export default function PaymentsLoading() {
  return (
    <div className="relative z-0 mx-auto flex w-full max-w-5xl animate-in flex-col items-center gap-8 pt-8 pb-16 duration-500 fade-in">
      {/* Header */}
      <div className="flex flex-col items-center text-center">
        <Shimmer className="mb-4 h-16 w-16 rounded-2xl" />
        <Shimmer className="mb-2 h-8 w-48" />
        <Shimmer className="h-4 w-64" />
      </div>

      {/* Tabs */}
      <div className="mt-2 flex w-full flex-col items-center">
        <Shimmer className="mb-8 h-[52px] w-full max-w-[400px] rounded-[16px]" />

        {/* Form skeleton */}
        <CardSkeleton className="w-full max-w-[500px]" lines={6} />
      </div>
    </div>
  )
}

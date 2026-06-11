"use client"

import { useEffect } from "react"
import { ErrorFallback } from "@/components/shared/error-fallback"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Dashboard boundary error:", error)
  }, [error])

  return (
    <div className="flex h-[80vh] w-full items-center justify-center p-6">
      <ErrorFallback
        title="Something went wrong"
        message={
          error.message || "Failed to load dashboard data. Please try again."
        }
        onRetry={reset}
      />
    </div>
  )
}

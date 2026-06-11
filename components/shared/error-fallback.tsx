"use client"

import { motion } from "framer-motion"
import { AlertTriangle, RefreshCcw } from "lucide-react"
import { cn } from "@/lib/utils"

interface ErrorFallbackProps {
  title?: string
  message?: string
  onRetry?: () => void
  className?: string
  compact?: boolean
}

export function ErrorFallback({
  title = "Something went wrong",
  message = "We couldn't load this section. Please try again.",
  onRetry,
  className,
  compact = false,
}: ErrorFallbackProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex flex-col items-center justify-center text-center",
        compact ? "gap-3 px-4 py-6" : "gap-5 px-6 py-12",
        className
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          "flex items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/10",
          compact ? "h-10 w-10" : "h-14 w-14"
        )}
      >
        <AlertTriangle
          className={cn("text-destructive", compact ? "h-5 w-5" : "h-7 w-7")}
        />
      </div>

      {/* Text */}
      <div className="flex flex-col gap-1.5">
        <p
          className={cn(
            "font-semibold text-foreground",
            compact ? "text-sm" : "text-base"
          )}
        >
          {title}
        </p>
        <p
          className={cn(
            "leading-relaxed text-muted-foreground",
            compact ? "text-xs" : "text-sm"
          )}
        >
          {message}
        </p>
      </div>

      {/* Retry */}
      {onRetry && (
        <button
          onClick={onRetry}
          className={cn(
            "group flex items-center gap-2 font-semibold text-primary transition-colors hover:text-primary/80",
            compact ? "text-xs" : "text-sm"
          )}
        >
          <RefreshCcw
            className={cn(
              "transition-transform duration-500 group-hover:rotate-180",
              compact ? "h-3 w-3" : "h-4 w-4"
            )}
          />
          Try again
        </button>
      )}
    </motion.div>
  )
}

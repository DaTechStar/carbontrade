"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"
import { BarChart2 } from "lucide-react"

interface EmptyStateProps {
  icon?: LucideIcon
  title?: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
  compact?: boolean
}

export function EmptyState({
  icon: Icon = BarChart2,
  title = "No data found",
  description = "Try adjusting your search or filters.",
  action,
  className,
  compact = false,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={cn(
        "flex flex-col items-center justify-center text-center",
        compact ? "gap-2 px-4 py-8" : "gap-4 px-6 py-14",
        className
      )}
    >
      {/* Glowing icon container */}
      <div
        className={cn(
          "relative flex items-center justify-center rounded-2xl border border-border/30",
          "bg-gradient-to-b from-muted/40 to-muted/10",
          compact ? "h-10 w-10" : "h-16 w-16"
        )}
      >
        {/* Soft glow behind icon */}
        <div className="absolute inset-0 rounded-2xl bg-primary/5 blur-sm" />
        <Icon
          className={cn(
            "relative text-muted-foreground/60",
            compact ? "h-5 w-5" : "h-7 w-7"
          )}
          strokeWidth={1.5}
        />
      </div>

      <div className="flex flex-col gap-1">
        <p
          className={cn(
            "font-semibold text-foreground/80",
            compact ? "text-xs" : "text-sm"
          )}
        >
          {title}
        </p>
        <p
          className={cn(
            "leading-relaxed text-muted-foreground",
            compact ? "text-[11px]" : "text-xs"
          )}
        >
          {description}
        </p>
      </div>

      {action && (
        <button
          onClick={action.onClick}
          className={cn(
            "mt-1 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5",
            "font-semibold text-primary transition-colors hover:bg-primary/20",
            compact ? "text-xs" : "text-sm"
          )}
        >
          {action.label}
        </button>
      )}
    </motion.div>
  )
}

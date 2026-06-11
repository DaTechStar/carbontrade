"use client"

import { motion } from "framer-motion"
import { Layers } from "lucide-react"

import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/utils"
import { Transaction } from "@/types"
import { TYPE_CONFIG, STATUS_CONFIG } from "@/lib/transactions-config"

export function TxRow({ tx, i }: { tx: Transaction; i: number }) {
  const cfg = TYPE_CONFIG[tx.type as Transaction["type"]] || {
    label: tx.type || "Unknown",
    icon: Layers,
    color: "text-muted-foreground",
    bg: "bg-muted/30",
    amountColor: "text-muted-foreground",
  }
  const status = STATUS_CONFIG[tx.status as Transaction["status"]] || {
    label: tx.status || "Unknown",
    dot: "bg-muted",
    text: "text-muted-foreground",
  }
  const Icon = cfg.icon
  const isPositive = tx.amount > 0
  const formatted = isPositive
    ? `+${formatCurrency(tx.amount)}`
    : `-${formatCurrency(Math.abs(tx.amount))}`

  const dateValue = (tx as any).timestamp || tx.createdAt
  const date = dateValue ? new Date(dateValue) : new Date()
  const dateStr = date.toLocaleDateString("en", {
    month: "short",
    day: "numeric",
    year: "2-digit",
  })
  const timeStr = date.toLocaleTimeString("en", {
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, delay: Math.min(i * 0.03, 0.3) }}
      className="group flex cursor-default items-center gap-4 border-b border-border/20 px-4 py-3.5 transition-colors hover:bg-accent/30"
    >
      {/* Icon */}
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105",
          cfg.bg
        )}
      >
        <Icon className={cn("h-4 w-4", cfg.color)} />
      </div>

      {/* Description + date */}
      <div className="min-w-0 flex-1">
        <p className="text-sm leading-snug font-semibold text-foreground">
          {tx.description}
        </p>
        <div className="mt-0.5 flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground">
            {dateStr} · {timeStr}
          </span>
          {tx.asset && (
            <span className="rounded border border-border/30 bg-muted/40 px-1.5 py-0.5 font-mono text-[10px] font-bold text-muted-foreground">
              {tx.asset}
            </span>
          )}
        </div>
      </div>

      {/* Type badge */}
      <span className="hidden shrink-0 rounded-full border border-border/30 bg-muted/30 px-2 py-0.5 text-[10px] font-bold text-muted-foreground sm:block">
        {cfg.label}
      </span>

      {/* Status */}
      <div className="hidden shrink-0 items-center gap-1.5 md:flex">
        <div className={cn("h-1.5 w-1.5 rounded-full", status.dot)} />
        <span className={cn("text-[11px] font-semibold", status.text)}>
          {status.label}
        </span>
      </div>

      {/* Amount */}
      <p
        className={cn(
          "shrink-0 text-sm font-black tabular-nums",
          cfg.amountColor
        )}
      >
        {formatted}
      </p>
    </motion.div>
  )
}

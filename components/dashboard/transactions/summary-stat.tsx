"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"

export function SummaryStat({
  label,
  value,
  sub,
  icon: Icon,
  iconBg,
  delay,
}: {
  label: string
  value: string
  sub?: string
  icon: React.ElementType
  iconBg: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
    >
      <Card className="flex flex-col gap-3 transition-all duration-300 hover:border-primary/30">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
            {label}
          </p>
          <div
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl",
              iconBg
            )}
          >
            <Icon className="h-3.5 w-3.5" />
          </div>
        </div>
        <p className="text-xl font-black tracking-tight sm:text-2xl">{value}</p>
        {sub && <p className="text-[10px] text-muted-foreground">{sub}</p>}
      </Card>
    </motion.div>
  )
}

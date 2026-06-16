import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"

export function StatCard({
  label,
  value,
  icon: Icon,
  sub,
  iconBg,
}: {
  label: string
  value: string
  icon: React.ElementType
  sub?: string
  iconBg: string
}) {
  return (
    <Card className="flex flex-col gap-3 transition-all duration-300 hover:border-primary/30">
      <div className="flex items-center justify-between">
        <p
          suppressHydrationWarning
          className="text-[10px] leading-tight font-bold tracking-widest text-muted-foreground uppercase"
        >
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
      <p
        suppressHydrationWarning
        className="truncate text-xl font-black tracking-tight sm:text-2xl"
      >
        {value}
      </p>
      {sub && (
        <p
          suppressHydrationWarning
          className="truncate text-[10px] text-muted-foreground"
        >
          {sub}
        </p>
      )}
    </Card>
  )
}

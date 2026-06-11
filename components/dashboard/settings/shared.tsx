import { cn } from "@/lib/utils"

export function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        {label}
      </label>
      {children}
    </div>
  )
}

export function Input({
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "w-full rounded-xl border border-border/40 bg-muted/30 px-3.5 py-2.5 text-sm",
        "transition-colors placeholder:text-muted-foreground/40 focus:border-primary/50 focus:outline-none",
        props.className
      )}
    />
  )
}

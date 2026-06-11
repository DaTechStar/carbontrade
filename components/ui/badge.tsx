import { cn } from "@/lib/utils"

type BadgeVariant =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "outline"
  | "ghost"

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  size?: "sm" | "md"
  dot?: boolean
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-muted/60 text-muted-foreground border border-border/40",
  primary: "bg-primary/15 text-primary border border-primary/30",
  secondary: "bg-secondary/15 text-secondary border border-secondary/30",
  success: "bg-profit-bg text-profit border border-profit/30",
  warning: "bg-warning-bg text-warning border border-warning/30",
  danger: "bg-loss-bg text-loss border border-loss/30",
  outline: "bg-transparent text-foreground border border-border",
  ghost: "bg-transparent text-muted-foreground border-transparent",
}

export function Badge({
  variant = "default",
  size = "md",
  dot = false,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-semibold whitespace-nowrap",
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            "inline-block h-1.5 w-1.5 shrink-0 rounded-full",
            variant === "success" && "bg-profit",
            variant === "warning" && "bg-warning",
            variant === "danger" && "bg-loss",
            variant === "primary" && "bg-primary",
            variant === "secondary" && "bg-secondary",
            !["success", "warning", "danger", "primary", "secondary"].includes(
              variant
            ) && "bg-muted-foreground"
          )}
        />
      )}
      {children}
    </span>
  )
}

import { cn } from "@/lib/utils"

// ─── Card ─────────────────────────────────────────────────────────────────────

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "solid" | "ghost"
  padding?: "none" | "sm" | "md" | "lg"
}

export function Card({
  className,
  variant = "glass",
  padding = "md",
  children,
  ...props
}: CardProps) {
  const variants = {
    default: "bg-card border border-border/50 shadow-md",
    glass: "glass-card",
    solid: "bg-card border border-border shadow-xl",
    ghost: "border border-border/30",
  }
  const paddings = {
    none: "",
    sm: "p-3",
    md: "p-5",
    lg: "p-6",
  }
  return (
    <div
      className={cn(
        "rounded-2xl",
        variants[variant],
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// ─── Card sub-parts ───────────────────────────────────────────────────────────

export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mb-4 flex items-center justify-between", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-sm font-semibold tracking-widest text-muted-foreground uppercase",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  )
}

export function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mt-4 flex items-center justify-between border-t border-border/30 pt-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

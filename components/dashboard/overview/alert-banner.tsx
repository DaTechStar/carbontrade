import Link from "next/link"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export function AlertBanner({
  icon: Icon,
  message,
  linkText,
  href,
  variant = "warning",
  onDismiss,
}: {
  icon: React.ElementType
  message: string
  linkText: string
  href: string
  variant?: "warning" | "info"
  onDismiss?: () => void
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border px-4 py-2.5 text-sm",
        variant === "warning"
          ? "border-warning/25 bg-warning-bg text-warning"
          : "border-primary/25 bg-primary/10 text-primary"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="flex-1 text-xs text-foreground/80 sm:text-sm">
        {message}{" "}
        <Link
          href={href}
          className={cn(
            "font-semibold underline underline-offset-2",
            variant === "warning" ? "text-warning" : "text-primary"
          )}
        >
          {linkText}
        </Link>
        .
      </span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="ml-2 shrink-0 text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  )
}

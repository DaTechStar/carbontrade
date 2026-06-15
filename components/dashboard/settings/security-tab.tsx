"use client"

import { useTransition } from "react"
import { Globe, LogOut, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { UAParser } from "ua-parser-js"

import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { revokeSession, revokeAllOtherSessions } from "@/app/actions/session"

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return "Just now"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hr ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} days ago`
  return date.toLocaleDateString()
}

export function SecurityTab({ sessions = [] }: { sessions?: any[] }) {
  const [isPending, startTransition] = useTransition()

  const handleRevoke = (sessionId: string) => {
    startTransition(async () => {
      const res = await revokeSession(sessionId)
      if (res?.error) {
        toast.error(res.error)
      } else {
        toast.success("Session revoked successfully")
      }
    })
  }

  const handleRevokeAll = () => {
    const currentSession = sessions.find((s) => s.current)
    if (!currentSession) return

    startTransition(async () => {
      const res = await revokeAllOtherSessions(currentSession.id)
      if (res?.error) {
        toast.error(res.error)
      } else {
        toast.success("All other sessions revoked")
      }
    })
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Active sessions */}
      <Card className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-secondary" />
            <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
              Active Sessions
            </p>
          </div>
          {sessions.length > 1 && (
            <button
              onClick={handleRevokeAll}
              disabled={isPending}
              className="text-xs font-bold text-loss transition-opacity hover:opacity-80 disabled:opacity-50"
            >
              {isPending ? "Revoking..." : "Revoke All"}
            </button>
          )}
        </div>

        {sessions.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No active sessions found.
          </p>
        ) : (
          sessions.map(
            ({ id, userAgent, ipAddress, location, lastActiveAt, current }) => {
              const parser = new UAParser(userAgent)
              const browser = parser.getBrowser()
              const os = parser.getOS()
              const deviceName = `${browser.name || "Unknown Browser"} on ${os.name || "Unknown OS"}`

              return (
                <div
                  key={id}
                  className="flex items-center gap-4 border-b border-border/20 py-2.5 last:border-0"
                >
                  <div
                    className={cn(
                      "h-2 w-2 shrink-0 rounded-full",
                      current
                        ? "animate-pulse bg-profit"
                        : "bg-muted-foreground/30"
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{deviceName}</p>
                    <p className="text-xs text-muted-foreground">
                      {location} ({ipAddress}) · {formatTimeAgo(lastActiveAt)}
                    </p>
                  </div>
                  {!current && (
                    <button
                      onClick={() => handleRevoke(id)}
                      disabled={isPending}
                      className="shrink-0 text-xs text-loss hover:opacity-80 disabled:opacity-50"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                    </button>
                  )}
                  {current && (
                    <span className="shrink-0 text-[10px] font-bold text-profit">
                      This device
                    </span>
                  )}
                </div>
              )
            }
          )
        )}
      </Card>
    </div>
  )
}

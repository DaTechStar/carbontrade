"use client"

import { useState, useRef, useEffect } from "react"
import {
  Bell,
  Check,
  Info,
  AlertTriangle,
  XCircle,
  CheckCircle2,
} from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"
import useSWR from "swr"
import Link from "next/link"

interface Notification {
  _id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  link?: string
  isRead: boolean
  createdAt: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

function timeAgo(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return "just now"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months}mo ago`
  const years = Math.floor(months / 12)
  return `${years}y ago`
}

export function NotificationsPopover() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const { data: notifications, mutate } = useSWR<Notification[]>(
    "/api/notifications",
    fetcher,
    { refreshInterval: 30000, revalidateOnFocus: true }
  )

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const unreadCount = notifications?.filter((n) => !n.isRead).length || 0

  async function markAsRead(id?: string) {
    if (!id && unreadCount === 0) return

    // Optimistic update
    if (notifications) {
      mutate(
        notifications.map((n) =>
          id
            ? n._id === id
              ? { ...n, isRead: true }
              : n
            : { ...n, isRead: true }
        ),
        false
      )
    }

    try {
      await fetch("/api/notifications/read", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(id ? { notificationIds: [id] } : {}),
      })
      mutate() // Re-fetch to ensure sync
    } catch (error) {
      console.error("Failed to mark notification as read", error)
    }
  }

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-destructive" />
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative rounded-xl p-2 text-muted-foreground transition-colors hover:bg-accent"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-background bg-primary text-[9px] font-bold text-primary-foreground">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-border/50 bg-popover shadow-2xl shadow-black/20 backdrop-blur-xl sm:w-96"
          >
            <div className="flex items-center justify-between border-b border-border/30 px-4 py-3">
              <h3 className="text-sm font-semibold text-foreground">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={() => markAsRead()}
                  className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-primary"
                >
                  <Check className="h-3 w-3" />
                  Mark all as read
                </button>
              )}
            </div>

            <div className="max-h-[400px] scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent overflow-y-auto p-1.5">
              {!notifications ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Loading...
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  <Bell className="mx-auto mb-2 h-8 w-8 opacity-20" />
                  No notifications yet
                </div>
              ) : (
                <div className="flex flex-col gap-0.5">
                  {notifications.map((notification) => {
                    const content = (
                      <div
                        onClick={() =>
                          !notification.isRead && markAsRead(notification._id)
                        }
                        className={cn(
                          "relative flex cursor-pointer items-start gap-3 rounded-xl p-3 text-left transition-colors hover:bg-accent/50",
                          !notification.isRead && "bg-accent/30"
                        )}
                      >
                        {!notification.isRead && (
                          <div className="absolute top-1/2 left-2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-primary" />
                        )}
                        <div
                          className={cn(
                            "mt-0.5 shrink-0 rounded-full",
                            !notification.isRead ? "pl-3" : ""
                          )}
                        >
                          {getIcon(notification.type)}
                        </div>
                        <div className="min-w-0 flex-1 space-y-1">
                          <p className="text-sm leading-none font-medium text-foreground">
                            {notification.title}
                          </p>
                          <p className="line-clamp-2 text-xs text-muted-foreground">
                            {notification.message}
                          </p>
                          <p className="text-[10px] font-medium text-muted-foreground/80">
                            {timeAgo(notification.createdAt)}
                          </p>
                        </div>
                      </div>
                    )

                    return notification.link ? (
                      <Link
                        key={notification._id}
                        href={notification.link}
                        onClick={() => setOpen(false)}
                      >
                        {content}
                      </Link>
                    ) : (
                      <div key={notification._id}>{content}</div>
                    )
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

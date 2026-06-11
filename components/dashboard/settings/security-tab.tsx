"use client"

import {
  Smartphone,
  Mail,
  Globe,
  LogOut,
  AlertTriangle,
  Trash2,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"

export function SecurityTab() {
  return (
    <div className="flex flex-col gap-6">
      {/* 2FA */}
      <Card className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Smartphone className="h-4 w-4 text-primary" />
          <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
            Two-Factor Authentication
          </p>
        </div>
        {[
          {
            icon: Smartphone,
            label: "Authenticator App",
            sub: "Use Google or Authy authenticator",
            active: false,
          },
          {
            icon: Mail,
            label: "Email OTP",
            sub: "Receive a code to your email on login",
            active: true,
          },
          {
            icon: Globe,
            label: "SMS Code",
            sub: "Receive a code to your phone number",
            active: false,
          },
        ].map(({ icon: Icon, label, sub, active }) => (
          <div
            key={label}
            className="flex items-center gap-4 rounded-xl border border-border/30 p-3.5 transition-colors hover:border-border/50"
          >
            <div
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                active ? "bg-primary/10" : "bg-muted/20"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">{label}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
            </div>
            <div className="flex items-center gap-3">
              {active && (
                <span className="text-[10px] font-bold text-profit">
                  Enabled
                </span>
              )}
              <button
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-xs font-bold transition-all",
                  active
                    ? "border-loss/20 text-loss hover:bg-loss/10"
                    : "border-primary/20 text-primary hover:bg-primary/10"
                )}
              >
                {active ? "Disable" : "Enable"}
              </button>
            </div>
          </div>
        ))}
      </Card>

      {/* Active sessions */}
      <Card className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-secondary" />
            <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
              Active Sessions
            </p>
          </div>
          <button className="text-xs font-bold text-loss transition-opacity hover:opacity-80">
            Revoke All
          </button>
        </div>
        {[
          {
            device: "Chrome on macOS",
            location: "Lagos, Nigeria",
            time: "Now",
            current: true,
          },
          {
            device: "Safari on iPhone 15",
            location: "Lagos, Nigeria",
            time: "2 hours ago",
            current: false,
          },
          {
            device: "Firefox on Windows 11",
            location: "London, UK",
            time: "3 days ago",
            current: false,
          },
        ].map(({ device, location, time, current }) => (
          <div
            key={device}
            className="flex items-center gap-4 border-b border-border/20 py-2.5 last:border-0"
          >
            <div
              className={cn(
                "h-2 w-2 shrink-0 rounded-full",
                current ? "animate-pulse bg-profit" : "bg-muted-foreground/30"
              )}
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">{device}</p>
              <p className="text-xs text-muted-foreground">
                {location} · {time}
              </p>
            </div>
            {!current && (
              <button className="shrink-0 text-xs text-loss hover:opacity-80">
                <LogOut className="h-3.5 w-3.5" />
              </button>
            )}
            {current && (
              <span className="shrink-0 text-[10px] font-bold text-profit">
                This device
              </span>
            )}
          </div>
        ))}
      </Card>

      {/* Login history */}
      <Card className="flex flex-col gap-4">
        <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
          Recent Login Activity
        </p>
        {[
          { date: "2026-06-07 12:41", ip: "102.89.23.45", status: "success" },
          { date: "2026-06-06 09:15", ip: "102.89.23.45", status: "success" },
          { date: "2026-06-04 20:03", ip: "41.206.10.12", status: "failed" },
          { date: "2026-06-03 14:22", ip: "102.89.23.45", status: "success" },
        ].map(({ date, ip, status }) => (
          <div
            key={date}
            className="flex items-center justify-between border-b border-border/15 py-1.5 last:border-0"
          >
            <div>
              <p className="font-mono text-xs text-muted-foreground">{date}</p>
              <p className="text-xs text-muted-foreground">{ip}</p>
            </div>
            <span
              className={cn(
                "rounded-full border px-2 py-0.5 text-[10px] font-bold",
                status === "success"
                  ? "border-profit/20 bg-profit/10 text-profit"
                  : "border-loss/20 bg-loss/10 text-loss"
              )}
            >
              {status}
            </span>
          </div>
        ))}
      </Card>

      {/* Danger zone */}
      <Card className="flex flex-col gap-4 border-loss/20 bg-loss/5">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-loss" />
          <p className="text-xs font-bold tracking-widest text-loss uppercase">
            Danger Zone
          </p>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold">Delete Account</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Permanently remove your account and all data. This cannot be
              undone.
            </p>
          </div>
          <button className="flex shrink-0 items-center gap-1.5 rounded-xl border border-loss/30 px-4 py-2 text-xs font-bold text-loss transition-all hover:bg-loss/10">
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </button>
        </div>
      </Card>
    </div>
  )
}

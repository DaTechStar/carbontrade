"use client"

import { useState } from "react"
import { Eye, EyeOff, ShieldCheck } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Field, Input } from "@/components/dashboard/settings/shared"

export function PasswordTab() {
  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  return (
    <div className="flex max-w-lg flex-col gap-6">
      <Card className="flex flex-col gap-5">
        <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
          Change Password
        </p>

        {(["current", "new", "confirm"] as const).map((field) => (
          <Field
            key={field}
            label={
              field === "current"
                ? "Current Password"
                : field === "new"
                  ? "New Password"
                  : "Confirm New Password"
            }
          >
            <div className="relative">
              <Input
                type={show[field] ? "text" : "password"}
                placeholder="••••••••••••"
                className="pr-10"
              />
              <button
                onClick={() => setShow((s) => ({ ...s, [field]: !s[field] }))}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              >
                {show[field] ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </Field>
        ))}

        {/* Strength indicator */}
        <div className="flex flex-col gap-1.5">
          <p className="text-xs text-muted-foreground">Password strength</p>
          <div className="flex gap-1">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={cn(
                  "h-1.5 flex-1 rounded-full",
                  i < 0 ? "bg-loss" : "bg-muted/30"
                )}
              />
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground">
            Use 12+ characters with uppercase, numbers & symbols
          </p>
        </div>

        <button className="w-full rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90">
          Update Password
        </button>
      </Card>

      <Card className="flex flex-col gap-3 border-muted/30">
        <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
          Password Tips
        </p>
        {[
          "Never share your password with anyone",
          "Use a unique password not used on other sites",
          "Enable two-factor authentication for extra security",
          "Change your password regularly every 90 days",
        ].map((tip) => (
          <div key={tip} className="flex items-start gap-2">
            <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
            <p className="text-xs text-muted-foreground">{tip}</p>
          </div>
        ))}
      </Card>
    </div>
  )
}

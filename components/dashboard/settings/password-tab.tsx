"use client"

import { useState, useTransition } from "react"
import { Eye, EyeOff, ShieldCheck, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Field, Input } from "@/components/dashboard/settings/shared"
import { changePassword } from "@/app/actions/user"

export function PasswordTab() {
  const [isPending, startTransition] = useTransition()

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  })

  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!passwords.current || !passwords.new || !passwords.confirm) {
      toast.error("Please fill in all fields")
      return
    }

    if (passwords.new !== passwords.confirm) {
      toast.error("New passwords do not match")
      return
    }

    if (passwords.new.length < 8) {
      toast.error("New password must be at least 8 characters long")
      return
    }

    startTransition(async () => {
      const res = await changePassword(passwords.current, passwords.new)
      if (res?.error) {
        toast.error(res.error)
      } else {
        toast.success("Password changed successfully!")
        setPasswords({ current: "", new: "", confirm: "" })
      }
    })
  }

  // Calculate generic password strength (0-4) based on length and patterns
  const getStrength = (pass: string) => {
    if (!pass) return -1
    let score = 0
    if (pass.length > 8) score += 1
    if (/[A-Z]/.test(pass)) score += 1
    if (/[0-9]/.test(pass)) score += 1
    if (/[^A-Za-z0-9]/.test(pass)) score += 1
    return Math.min(score, 3)
  }

  const strength = getStrength(passwords.new)

  return (
    <div className="flex max-w-lg flex-col gap-6">
      <form onSubmit={handleSubmit}>
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
                  value={passwords[field]}
                  onChange={(e) =>
                    setPasswords((s) => ({ ...s, [field]: e.target.value }))
                  }
                  disabled={isPending}
                />
                <button
                  type="button"
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
                    "h-1.5 flex-1 rounded-full transition-colors duration-300",
                    strength >= i
                      ? strength >= 3
                        ? "bg-profit"
                        : strength >= 2
                          ? "bg-secondary"
                          : "bg-loss"
                      : "bg-muted/30"
                  )}
                />
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground">
              Use 12+ characters with uppercase, numbers & symbols
            </p>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Update Password
          </button>
        </Card>
      </form>

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

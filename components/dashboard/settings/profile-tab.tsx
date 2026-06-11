"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import {
  Camera,
  Check,
  Bell,
  Lock,
  AlertTriangle,
  ChevronRight,
  Loader2,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Field, Input } from "@/components/dashboard/settings/shared"

export function ProfileTab({ user }: { user: any }) {
  const { update } = useSession()

  const names = user.name.split(" ")
  const [firstName, setFirstName] = useState(names[0])
  const [lastName, setLastName] = useState(names.slice(1).join(" "))
  const [username, setUsername] = useState(user.username || user.name || "")
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || "")
  const [dateOfBirth, setDateOfBirth] = useState(user.dateOfBirth || "")
  const [bio, setBio] = useState(user.bio || "")

  const [usernameStatus, setUsernameStatus] = useState<
    "idle" | "checking" | "available" | "taken"
  >("idle")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [usernameError, setUsernameError] = useState("")

  const [imagePreview, setImagePreview] = useState(user.image || "")
  const [imageBase64, setImageBase64] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [countryFlag, setCountryFlag] = useState<string>("🏳️")

  const initials = firstName.charAt(0) + (lastName.charAt(0) || "")
  const maxDateOfBirth = new Date(
    new Date().setFullYear(new Date().getFullYear() - 18)
  )
    .toISOString()
    .split("T")[0]

  // Fetch country flag
  useEffect(() => {
    async function fetchCountryFlag() {
      if (!user.country) return
      try {
        const res = await fetch(
          "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/index.json"
        )
        if (res.ok) {
          const data = await res.json()
          const countryData = data.find((c: any) => c.name === user.country)
          if (countryData && countryData.emoji) {
            setCountryFlag(countryData.emoji)
          }
        }
      } catch (err) {
        console.error("Failed to fetch country flag", err)
      }
    }
    fetchCountryFlag()
  }, [user.country])

  // Debounce username check
  useEffect(() => {
    if (username === user.username) {
      setUsernameStatus("idle")
      setUsernameError("")
      setSuggestions([])
      return
    }

    if (username.length < 3) {
      setUsernameStatus("idle")
      return
    }

    const delayDebounceFn = setTimeout(async () => {
      setUsernameStatus("checking")
      try {
        const res = await fetch(
          `/api/user/check-username?username=${encodeURIComponent(username)}`
        )
        const data = await res.json()

        if (res.ok && data.available) {
          setUsernameStatus("available")
          setUsernameError("")
          setSuggestions([])
        } else {
          setUsernameStatus("taken")
          setUsernameError(data.error || "Username is already taken")
          setSuggestions(data.suggestions || [])
        }
      } catch (err) {
        setUsernameStatus("idle")
      }
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [username, user.username])

  async function handleSave() {
    if (usernameStatus === "taken" || usernameStatus === "checking") {
      toast.error("Please fix your username before saving.")
      return
    }

    setIsSaving(true)
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          username,
          phoneNumber,
          dateOfBirth,
          bio,
          imageBase64: imageBase64 || undefined,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to update profile")

      toast.success("Profile updated successfully!")

      // Update NextAuth session instantly
      await update({
        name: data.user.name,
        username: data.user.username,
        image: data.user.image,
      })

      setImageBase64("")
      setImagePreview(data.user.image || imagePreview)
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Avatar */}
      <Card className="flex flex-col items-center gap-5 sm:flex-row">
        <div className="group relative shrink-0">
          {imagePreview ? (
            <div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-border/50 bg-muted shadow-lg">
              <Image
                src={imagePreview}
                alt="Profile Avatar"
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-2xl font-black text-primary-foreground shadow-lg">
              {initials}
            </div>
          )}
          <label className="absolute -right-1.5 -bottom-1.5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl border border-border/50 bg-muted shadow-sm transition-colors hover:bg-accent">
            <Camera className="h-4 w-4 text-muted-foreground" />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  const reader = new FileReader()
                  reader.onloadend = () => {
                    setImagePreview(reader.result as string)
                    setImageBase64(reader.result as string)
                  }
                  reader.readAsDataURL(file)
                }
              }}
            />
          </label>
        </div>
        <div className="flex-1 text-center sm:text-left">
          <p className="text-lg font-black">
            {firstName} {lastName}
          </p>
          <p className="text-sm text-muted-foreground">
            {username ? `@${username}` : user.email}
          </p>
          <div className="mt-2 flex items-center justify-center gap-2 sm:justify-start">
            <span className="rounded-full border border-profit/20 bg-profit/10 px-2 py-0.5 text-[10px] font-bold text-profit">
              Welcome
            </span>
            <span className="rounded-full border border-border/30 bg-muted/30 px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
              Level {user.tierLevel}
            </span>
          </div>
        </div>
      </Card>

      {/* Personal info */}
      <Card className="flex flex-col gap-5">
        <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
          Personal Information
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="First Name">
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </Field>
          <Field label="Last Name">
            <Input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Field>

          <div className="sm:col-span-2">
            <Field label="Username">
              <div className="relative">
                <span className="absolute top-1/2 left-3.5 -translate-y-1/2 font-semibold text-muted-foreground">
                  @
                </span>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-8"
                  placeholder="Choose a username"
                />
                <div className="absolute top-1/2 right-3.5 -translate-y-1/2">
                  {usernameStatus === "checking" && (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                  {usernameStatus === "available" && (
                    <Check className="h-4 w-4 text-profit" />
                  )}
                  {usernameStatus === "taken" && (
                    <AlertTriangle className="h-4 w-4 text-loss" />
                  )}
                </div>
              </div>
              {usernameStatus === "taken" && (
                <div className="mt-1.5 flex flex-col gap-1">
                  <p className="text-[10px] font-semibold text-loss">
                    {usernameError}
                  </p>
                  {suggestions.length > 0 && (
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="text-[10px] text-muted-foreground">
                        Suggestions:
                      </span>
                      {suggestions.map((s) => (
                        <button
                          key={s}
                          onClick={() => setUsername(s)}
                          className="rounded-md border border-border/50 bg-muted/50 px-2 py-0.5 text-[10px] font-bold transition-colors hover:bg-muted"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Field>
          </div>

          <Field label="Email Address">
            <Input
              type="email"
              defaultValue={user.email}
              readOnly
              className="cursor-not-allowed bg-muted/20"
            />
          </Field>
          <Field label="Phone Number">
            <Input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+1 (555) 000-0000"
            />
          </Field>
          <Field label="Country">
            <div className="relative">
              <div className="flex w-full cursor-not-allowed items-center justify-between rounded-xl border border-border/30 bg-muted/20 px-3.5 py-2.5 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="text-base leading-none">{countryFlag}</span>
                  <span>{user.country}</span>
                </div>
                <Lock className="h-3.5 w-3.5 shrink-0 text-muted-foreground/40" />
              </div>
              <p className="mt-1 text-[10px] text-muted-foreground/60">
                Country cannot be changed after registration. Contact support if
                needed.
              </p>
            </div>
          </Field>
          <Field label="Date of Birth">
            <Input
              type="date"
              max={maxDateOfBirth}
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
            />
          </Field>
        </div>
        <Field label="Bio / About">
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us a little about yourself…"
            className="w-full resize-none rounded-xl border border-border/40 bg-muted/30 px-3.5 py-2.5 text-sm transition-colors placeholder:text-muted-foreground/40 focus:border-primary/50 focus:outline-none"
          />
        </Field>
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={
              isSaving ||
              usernameStatus === "checking" ||
              usernameStatus === "taken"
            }
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
            Save Changes
          </button>
        </div>
      </Card>

      {/* KYC */}
      <Card className="flex flex-col gap-4 border-warning/20 bg-warning/5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-warning/10">
            <AlertTriangle className="h-4 w-4 text-warning" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold">Identity Verification (KYC)</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Required to enable withdrawals and higher deposit limits
            </p>
          </div>
          <button className="flex shrink-0 items-center gap-1.5 text-xs font-bold text-warning hover:opacity-80">
            Verify Now <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {["ID Document", "Proof of Address", "Selfie"].map((step, i) => (
            <div
              key={step}
              className={cn(
                "rounded-xl border p-3 text-center",
                i === 0
                  ? "border-warning/30 bg-warning/10"
                  : "border-border/20 bg-muted/10"
              )}
            >
              <p className="text-xs font-semibold text-foreground">{step}</p>
              <p
                className={cn(
                  "mt-0.5 text-[10px]",
                  i === 0 ? "font-bold text-warning" : "text-muted-foreground"
                )}
              >
                {i === 0 ? "Pending" : "Not Started"}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Notifications */}
      <Card className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-primary" />
          <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
            Notification Preferences
          </p>
        </div>
        {[
          {
            label: "Trade opened / closed",
            sub: "Get notified when a copied trade executes",
            on: true,
          },
          {
            label: "Profit & Loss alerts",
            sub: "Daily P&L summary to your email",
            on: true,
          },
          {
            label: "Deposit & Withdrawal updates",
            sub: "Status changes on your transactions",
            on: true,
          },
          {
            label: "Rank & Reward updates",
            sub: "When you unlock a new tier or bonus",
            on: false,
          },
          {
            label: "Marketing emails",
            sub: "Platform news and promotions",
            on: false,
          },
        ].map(({ label, sub, on }) => (
          <div
            key={label}
            className="flex items-center justify-between gap-4 border-b border-border/20 py-1.5 last:border-0"
          >
            <div>
              <p className="text-sm font-medium">{label}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
            </div>
            <button
              className={cn(
                "relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors duration-200",
                on ? "bg-primary" : "border border-border/40 bg-muted/50"
              )}
            >
              <span
                className={cn(
                  "absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200",
                  on ? "translate-x-6" : "translate-x-1"
                )}
              />
            </button>
          </div>
        ))}
      </Card>
    </div>
  )
}

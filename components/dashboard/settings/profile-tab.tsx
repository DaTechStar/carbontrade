"use client"

import Image from "next/image"
import { useState, useEffect, useTransition, useOptimistic } from "react"
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
import { toggleNotificationPreference } from "@/app/actions/user"
import { useLanguage } from "@/lib/i18n/context"

function NotificationToggle({
  label,
  sub,
  prefKey,
  initialOn,
}: {
  label: string
  sub: string
  prefKey: string
  initialOn: boolean
}) {
  const [isPending, startTransition] = useTransition()
  const [optimisticOn, setOptimisticOn] = useOptimistic(
    initialOn,
    (state: boolean, newState: boolean) => newState
  )

  return (
    <div className="flex items-center justify-between gap-4 border-b border-border/20 py-1.5 last:border-0">
      <div>
        <p suppressHydrationWarning className="text-sm font-medium">
          {label}
        </p>
        <p
          suppressHydrationWarning
          className="mt-0.5 text-xs text-muted-foreground"
        >
          {sub}
        </p>
      </div>
      <button
        onClick={() => {
          startTransition(async () => {
            setOptimisticOn(!optimisticOn)
            const res = await toggleNotificationPreference(
              prefKey,
              !optimisticOn
            )
            if (res?.error) {
              toast.error(res.error)
            } else {
              toast.success("Preference updated")
            }
          })
        }}
        disabled={isPending}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors duration-200",
          optimisticOn ? "bg-primary" : "border border-border/40 bg-muted/50",
          isPending && "opacity-70"
        )}
      >
        <span
          className={cn(
            "absolute top-1 h-4 w-4 rounded-full bg-background shadow-sm transition-transform duration-200",
            optimisticOn ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
    </div>
  )
}

export function ProfileTab({ user }: { user: any }) {
  const { update } = useSession()
  const { t } = useLanguage()

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
                sizes="80px"
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
            <span
              suppressHydrationWarning
              className="rounded-full border border-profit/20 bg-profit/10 px-2 py-0.5 text-[10px] font-bold text-profit"
            >
              {t("dashboard.settings.welcome")}
            </span>
            <span
              suppressHydrationWarning
              className="rounded-full border border-border/30 bg-muted/30 px-2 py-0.5 text-[10px] font-bold text-muted-foreground"
            >
              {t("dashboard.settings.level")} {user.tierLevel}
            </span>
          </div>
        </div>
      </Card>

      {/* Personal info */}
      <Card className="flex flex-col gap-5">
        <p
          suppressHydrationWarning
          className="text-xs font-bold tracking-widest text-muted-foreground uppercase"
        >
          {t("dashboard.settings.personalInfo")}
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t("dashboard.settings.firstName")}>
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </Field>
          <Field label={t("dashboard.settings.lastName")}>
            <Input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Field>

          <div className="sm:col-span-2">
            <Field label={t("dashboard.settings.username")}>
              <div className="relative">
                <span className="absolute top-1/2 left-3.5 -translate-y-1/2 font-semibold text-muted-foreground">
                  @
                </span>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-8"
                  placeholder={t("dashboard.settings.chooseUsername")}
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
                  <p
                    suppressHydrationWarning
                    className="text-[10px] font-semibold text-loss"
                  >
                    {usernameError === "Username is already taken"
                      ? t("dashboard.settings.usernameTaken")
                      : usernameError}
                  </p>
                  {suggestions.length > 0 && (
                    <div className="mt-1 flex items-center gap-1.5">
                      <span
                        suppressHydrationWarning
                        className="text-[10px] text-muted-foreground"
                      >
                        {t("dashboard.settings.suggestions")}
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

          <Field label={t("dashboard.settings.email")}>
            <Input
              type="email"
              defaultValue={user.email}
              readOnly
              className="cursor-not-allowed bg-muted/20"
            />
          </Field>
          <Field label={t("dashboard.settings.phone")}>
            <Input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+1 (555) 000-0000"
            />
          </Field>
          <Field label={t("dashboard.settings.country")}>
            <div className="relative">
              <div className="flex w-full cursor-not-allowed items-center justify-between rounded-xl border border-border/30 bg-muted/20 px-3.5 py-2.5 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="text-base leading-none">{countryFlag}</span>
                  <span>{user.country}</span>
                </div>
                <Lock className="h-3.5 w-3.5 shrink-0 text-muted-foreground/40" />
              </div>
              <p
                suppressHydrationWarning
                className="mt-1 text-[10px] text-muted-foreground/60"
              >
                {t("dashboard.settings.countryNote")}
              </p>
            </div>
          </Field>
          <Field label={t("dashboard.settings.dob")}>
            <Input
              type="date"
              max={maxDateOfBirth}
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
            />
          </Field>
        </div>
        <Field label={t("dashboard.settings.bio")}>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder={t("dashboard.settings.bioPlaceholder")}
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
            <span suppressHydrationWarning>
              {t("dashboard.settings.saveChanges")}
            </span>
          </button>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-primary" />
          <p
            suppressHydrationWarning
            className="text-xs font-bold tracking-widest text-muted-foreground uppercase"
          >
            {t("dashboard.settings.notificationPrefs")}
          </p>
        </div>
        {[
          {
            label: t("dashboard.settings.prefTradeTitle"),
            sub: t("dashboard.settings.prefTradeSub"),
            prefKey: "tradeExecution",
            on: user.notificationPreferences?.tradeExecution ?? true,
          },
          {
            label: t("dashboard.settings.prefPnlTitle"),
            sub: t("dashboard.settings.prefPnlSub"),
            prefKey: "dailyPnL",
            on: user.notificationPreferences?.dailyPnL ?? true,
          },
          {
            label: t("dashboard.settings.prefTxTitle"),
            sub: t("dashboard.settings.prefTxSub"),
            prefKey: "transactionUpdates",
            on: user.notificationPreferences?.transactionUpdates ?? true,
          },
          {
            label: t("dashboard.settings.prefTierTitle"),
            sub: t("dashboard.settings.prefTierSub"),
            prefKey: "tierUpdates",
            on: user.notificationPreferences?.tierUpdates ?? true,
          },
          {
            label: t("dashboard.settings.prefMktTitle"),
            sub: t("dashboard.settings.prefMktSub"),
            prefKey: "marketing",
            on: user.notificationPreferences?.marketing ?? false,
          },
        ].map(({ label, sub, prefKey, on }) => (
          <NotificationToggle
            key={prefKey}
            label={label}
            sub={sub}
            prefKey={prefKey}
            initialOn={on}
          />
        ))}
      </Card>
    </div>
  )
}

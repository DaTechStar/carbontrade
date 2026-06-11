"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSession } from "next-auth/react"
import useSWR from "swr"
import { toast } from "sonner"
import {
  User,
  Link2,
  Lock,
  ShieldCheck,
  Camera,
  Copy,
  Check,
  Bell,
  Eye,
  EyeOff,
  Smartphone,
  Globe,
  Mail,
  AlertTriangle,
  ChevronRight,
  LogOut,
  Trash2,
  Loader2,
} from "lucide-react"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "profile" | "referrals" | "password" | "security"

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "referrals", label: "Referrals", icon: Link2 },
  { id: "password", label: "Password", icon: Lock },
  { id: "security", label: "Security", icon: ShieldCheck },
]

// ─── Fetcher ──────────────────────────────────────────────────────────────────

const fetcher = (url: string) => fetch(url).then((r) => r.json())

// ─── Shared input ─────────────────────────────────────────────────────────────

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        {label}
      </label>
      {children}
    </div>
  )
}

function Input({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "w-full rounded-xl border border-border/40 bg-muted/30 px-3.5 py-2.5 text-sm",
        "transition-colors placeholder:text-muted-foreground/40 focus:border-primary/50 focus:outline-none",
        props.className
      )}
    />
  )
}

// ─── Profile tab ─────────────────────────────────────────────────────────────

function ProfileTab({ user }: { user: any }) {
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
              <img
                src={imagePreview}
                alt="Profile Avatar"
                className="h-full w-full object-cover"
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

// ─── Referrals tab ────────────────────────────────────────────────────────────

function ReferralsTab() {
  const { data: session } = useSession()
  const username =
    (session?.user as any)?.username || session?.user?.name || "User"
  const [copied, setCopied] = useState(false)

  // Use dynamic origin if available, otherwise fallback
  const origin =
    typeof window !== "undefined" ? window.location.origin : siteConfig.url
  const refLink = `${origin}/register?ref=${username}`

  function copyLink() {
    navigator.clipboard.writeText(refLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const { data, error, isLoading } = useSWR("/api/user/referrals", fetcher)

  const stats = [
    {
      label: "Total Referrals",
      value: data?.totalCount || "0",
      color: "text-primary",
    },
    { label: "Active", value: data?.activeCount || "0", color: "text-profit" },
    {
      label: "Pending",
      value: data?.pendingCount || "0",
      color: "text-warning",
    },
    {
      label: "Referral Deposits",
      value: `$${(data?.totalReferralDeposits || 0).toLocaleString()}`,
      color: "text-foreground",
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map(({ label, value, color }) => (
          <Card key={label} className="flex flex-col gap-1 text-center">
            <p className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
              {label}
            </p>
            <p className={cn("text-2xl font-black", color)}>{value}</p>
          </Card>
        ))}
      </div>

      {/* Referral link */}
      <Card className="flex flex-col gap-4">
        <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
          Referral Programme
        </p>
        <Field label="Your Referral Link">
          <div className="flex gap-2">
            <Input
              readOnly
              value={refLink}
              className="cursor-default font-mono text-xs text-muted-foreground"
            />
            <button
              onClick={copyLink}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold transition-all",
                copied
                  ? "border border-profit/20 bg-profit/10 text-profit"
                  : "border border-primary/20 bg-primary/10 text-primary hover:bg-primary/20"
              )}
            >
              {copied ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </Field>
        <Field label="Your Referral ID">
          <p className="text-sm font-black text-primary">{username}</p>
        </Field>
        <div className="rounded-xl border border-primary/15 bg-primary/5 p-3 text-xs leading-relaxed text-muted-foreground">
          Share your link and earn rewards for every friend who registers and
          deposits. Reach{" "}
          <span className="font-bold text-foreground">Diamond</span> rank with 5
          referrals and{" "}
          <span className="font-bold text-foreground">Ambassador</span> with 12.
        </div>
      </Card>

      {/* Referral table */}
      <Card className="flex flex-col gap-4">
        <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
          Your Referrals
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-sm">
            <thead>
              <tr className="border-b border-border/30">
                {["Client Name", "Level", "Parent", "Status", "Date"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-2 pb-2.5 text-left text-[10px] font-bold tracking-wider text-muted-foreground uppercase first:pl-0"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-8 text-center text-xs text-muted-foreground"
                  >
                    <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                  </td>
                </tr>
              )}
              {!isLoading && data?.referrals?.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-8 text-center text-xs text-muted-foreground"
                  >
                    No referrals yet. Share your link to start earning!
                  </td>
                </tr>
              )}
              {data?.referrals?.map((r: any) => (
                <tr
                  key={r.id}
                  className="border-b border-border/15 transition-colors hover:bg-accent/20"
                >
                  <td className="px-2 py-3 font-semibold first:pl-0">
                    {r.name}
                  </td>
                  <td className="px-2 py-3">
                    <span className="rounded-full border border-border/30 bg-muted/30 px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                      Level {r.level}
                    </span>
                  </td>
                  <td className="px-2 py-3 text-xs text-muted-foreground">
                    {username}
                  </td>
                  <td className="px-2 py-3">
                    <span
                      className={cn(
                        "rounded-full border px-2 py-0.5 text-[10px] font-bold",
                        r.status === "active"
                          ? "border-profit/20 bg-profit/10 text-profit"
                          : "border-warning/20 bg-warning/10 text-warning"
                      )}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-2 py-3 text-xs text-muted-foreground">
                    {new Date(r.date).toLocaleDateString("en", {
                      month: "short",
                      day: "numeric",
                      year: "2-digit",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

// ─── Password tab ─────────────────────────────────────────────────────────────

function PasswordTab() {
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

// ─── Security tab ─────────────────────────────────────────────────────────────

function SecurityTab() {
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SettingsClient({ initialUser }: { initialUser: any }) {
  const [tab, setTab] = useState<Tab>("profile")

  const content: Record<Tab, React.ReactNode> = {
    profile: <ProfileTab user={initialUser} />,
    referrals: <ReferralsTab />,
    password: <PasswordTab />,
    security: <SecurityTab />,
  }

  return (
    <div className="flex w-full flex-col gap-6 pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-4"
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border/40 bg-muted/30">
          <User className="h-5 w-5 text-muted-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
            Settings
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Manage your account, security and preferences
          </p>
        </div>
      </motion.div>

      {/* Tab bar */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="flex gap-1 overflow-x-auto rounded-2xl border border-border/30 bg-muted/20 p-1"
      >
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            id={`settings-tab-${id}`}
            onClick={() => setTab(id)}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition-all",
              tab === id
                ? "border border-border/40 bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </button>
        ))}
      </motion.div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
        >
          {content[tab]}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

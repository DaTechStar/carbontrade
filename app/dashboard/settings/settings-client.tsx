"use client"

import { motion, AnimatePresence } from "framer-motion"
import { User, Link2, Lock, ShieldCheck, FileCheck } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/i18n/context"
import { ProfileTab } from "@/components/dashboard/settings/profile-tab"
import { ReferralsTab } from "@/components/dashboard/settings/referrals-tab"
import { PasswordTab } from "@/components/dashboard/settings/password-tab"
import { SecurityTab } from "@/components/dashboard/settings/security-tab"
import { KycTab } from "@/components/dashboard/settings/kyc-tab"

type Tab = "profile" | "referrals" | "password" | "security" | "kyc"

export default function SettingsClient({
  initialUser,
  initialSessions = [],
  activeTab,
}: {
  initialUser: any
  initialSessions?: any[]
  activeTab: Tab
}) {
  const { t } = useLanguage()
  const router = useRouter()
  const pathname = usePathname()

  const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "profile", label: t("dashboard.settings.profile"), icon: User },
    { id: "referrals", label: t("dashboard.settings.referrals"), icon: Link2 },
    { id: "password", label: t("dashboard.settings.password"), icon: Lock },
    {
      id: "security",
      label: t("dashboard.settings.security"),
      icon: ShieldCheck,
    },
    { id: "kyc", label: t("dashboard.settings.kyc"), icon: FileCheck },
  ]

  const content: Record<Tab, React.ReactNode> = {
    profile: <ProfileTab user={initialUser} />,
    referrals: <ReferralsTab />,
    password: <PasswordTab />,
    security: <SecurityTab sessions={initialSessions} />,
    kyc: <KycTab user={initialUser} />,
  }

  const handleTabChange = (tab: Tab) => {
    const params = new URLSearchParams()
    if (tab !== "profile") params.set("tab", tab)
    const query = params.toString()
    router.push(query ? `${pathname}?${query}` : pathname)
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
          <h1
            suppressHydrationWarning
            className="text-2xl font-black tracking-tight sm:text-3xl"
          >
            {t("dashboard.settings.title")}
          </h1>
          <p
            suppressHydrationWarning
            className="mt-0.5 text-sm text-muted-foreground"
          >
            {t("dashboard.settings.subtitle")}
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
            onClick={() => handleTabChange(id)}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition-all",
              activeTab === id
                ? "border border-border/40 bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span suppressHydrationWarning>{label}</span>
          </button>
        ))}
      </motion.div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
        >
          {content[activeTab]}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

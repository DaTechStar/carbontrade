"use client"

import { useState } from "react"
import { Bell, Menu } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown, Settings, LogOut, User } from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useRef, useEffect } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"

import {
  Sidebar,
  SIDEBAR_EXPANDED,
  SIDEBAR_COLLAPSED,
} from "@/components/dashboard/sidebar"

// ── Profile dropdown ──────────────────────────────────────────────────────────

function ProfileDropdown() {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const name = session?.user?.name || "User"
  const email = session?.user?.email || ""
  const initials = name
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  async function handleSignOut() {
    setOpen(false)
    toast.loading("Signing out…")
    await signOut({ redirect: false })
    toast.dismiss()
    router.push("/login")
  }

  return (
    <div ref={ref} className="relative">
      <button
        id="profile-dropdown-trigger"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-xl p-1 transition-colors hover:bg-accent"
      >
        <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary to-secondary text-xs font-bold text-primary-foreground">
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt={name}
              fill
              className="object-cover"
            />
          ) : (
            initials
          )}
        </div>
        <ChevronDown
          className={cn(
            "h-3 w-3 text-muted-foreground transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-border/50 bg-popover shadow-2xl shadow-black/20 backdrop-blur-xl"
          >
            {/* User info */}
            <div className="border-b border-border/30 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary to-secondary text-xs font-bold text-primary-foreground">
                  {session?.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    initials
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {name}
                  </p>
                  <p className="truncate text-[11px] text-muted-foreground">
                    {email}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-0.5 p-1.5">
              <Link
                href="/dashboard/settings"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
              >
                <Settings className="h-4 w-4 text-muted-foreground" />
                Settings
              </Link>
            </div>

            <div className="border-t border-border/30 p-1.5">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10">
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Sign out?</AlertDialogTitle>
                    <AlertDialogDescription>
                      You will be redirected to the login page. Any unsaved
                      changes may be lost.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleSignOut}
                      className="text-destructive-foreground bg-destructive hover:bg-destructive/90"
                    >
                      Yes, sign out
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Layout ────────────────────────────────────────────────────────────────────

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  // CSS-driven sidebar offset — no JS measurement, no hydration flash.
  // lg: prefix ensures it only applies on desktop (≥1024px).
  const plClass = collapsed ? "lg:pl-[68px]" : "lg:pl-[240px]"
  const leftClass = collapsed ? "lg:left-[68px]" : "lg:left-[240px]"

  return (
    <div className="dark min-h-screen bg-background">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Content wrapper — offset via CSS classes only, no JS animation */}
      <div
        className={cn(
          "flex min-h-screen flex-col transition-all duration-300 ease-in-out",
          plClass
        )}
      >
        {/* ── Top bar ── */}
        <header
          className={cn(
            "fixed top-0 right-0 z-20 flex h-16 items-center gap-4 px-4 sm:px-6",
            "border-b border-border/30 bg-background/80 backdrop-blur-md",
            "left-0 transition-all duration-300 ease-in-out",
            leftClass
          )}
        >
          {/* Mobile sidebar toggle */}
          <button
            id="sidebar-mobile-toggle"
            onClick={() => setMobileOpen((v) => !v)}
            className="rounded-xl p-2 text-muted-foreground hover:bg-accent lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex-1" />

          <div className="flex items-center gap-2">
            {/* Notifications */}
            <button className="relative rounded-xl p-2 text-muted-foreground hover:bg-accent">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full border-2 border-background bg-primary" />
            </button>

            {/* Profile dropdown */}
            <ProfileDropdown />
          </div>
        </header>

        {/* ── Page content ── */}
        <main className="flex-1 overflow-x-hidden pt-16">
          <div className="mx-auto w-full max-w-[1440px] p-4 sm:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

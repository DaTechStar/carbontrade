"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { signOut } from "next-auth/react"
import { toast } from "sonner"
import { useLanguage } from "@/lib/i18n/context"
import { cn } from "@/lib/utils"
import { siteConfig } from "@/config/site"
import {
  LayoutDashboard,
  CreditCard,
  Users,
  Copy,
  History,
  ArrowLeftRight,
  BarChart2,
  ShieldCheck,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  FileCheck,
} from "lucide-react"
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

// ─── Constants ────────────────────────────────────────────────────────────────

export const SIDEBAR_EXPANDED = 240
export const SIDEBAR_COLLAPSED = 68

// ─── Nav config ───────────────────────────────────────────────────────────────

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  children?: { label: string; href: string }[]
  /** If set, active state is based on matching path + this tab param (null = no tab param) */
  matchPath?: string
  matchTab?: string | null
}

// ─── NavLink ──────────────────────────────────────────────────────────────────

function NavLink({
  item,
  collapsed,
  onNavigate,
}: {
  item: NavItem
  collapsed: boolean
  onNavigate?: () => void
}) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const hasChildren = !!item.children?.length
  const isActive =
    pathname === item.href || item.children?.some((c) => pathname === c.href)

  return (
    <div>
      <Link
        href={hasChildren ? "#" : item.href}
        onClick={(e) => {
          if (hasChildren) {
            e.preventDefault()
            setOpen((v) => !v)
          } else {
            onNavigate?.()
          }
        }}
        className={cn(
          "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
          "hover:bg-sidebar-accent",
          isActive
            ? "border border-primary/20 bg-primary/15 text-primary"
            : "text-sidebar-foreground/70",
          collapsed && "justify-center px-0"
        )}
      >
        {isActive && (
          <span className="absolute top-1/2 left-0 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary" />
        )}
        <item.icon
          className={cn(
            "h-4 w-4 shrink-0",
            isActive ? "text-primary" : "text-sidebar-foreground/50"
          )}
        />
        {!collapsed && (
          <>
            <span suppressHydrationWarning className="flex-1 truncate">
              {item.label}
            </span>
            {hasChildren && (
              <ChevronRight
                className={cn(
                  "h-3 w-3 text-muted-foreground transition-transform",
                  open && "rotate-90"
                )}
              />
            )}
          </>
        )}
        {/* Tooltip when collapsed */}
        {collapsed && (
          <span
            suppressHydrationWarning
            className="absolute left-full z-50 ml-3 hidden rounded-lg border border-border/50 bg-popover px-2.5 py-1.5 text-xs font-medium whitespace-nowrap shadow-xl group-hover:block"
          >
            {item.label}
          </span>
        )}
      </Link>

      {/* Sub-links */}
      <AnimatePresence>
        {hasChildren && open && !collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="mt-0.5 ml-7 flex flex-col gap-0.5 overflow-hidden border-l border-border/30 pl-3"
          >
            {item.children!.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                onClick={() => onNavigate?.()}
                className={cn(
                  "rounded-lg px-2 py-1.5 text-xs transition-colors",
                  pathname === c.href
                    ? "font-semibold text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {c.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── FooterLink ───────────────────────────────────────────────────────────────

function FooterLink({
  href,
  icon: Icon,
  label,
  collapsed,
  onNavigate,
  matchPath,
  matchTab,
}: {
  href: string
  icon: React.ElementType
  label: string
  collapsed: boolean
  onNavigate?: () => void
  matchPath?: string
  matchTab?: string | null
}) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentTab = searchParams.get("tab")
  const isActive = matchPath
    ? pathname === matchPath &&
      (matchTab === null ? !currentTab : currentTab === matchTab)
    : pathname === href

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
        "hover:bg-sidebar-accent",
        isActive
          ? "border border-primary/20 bg-primary/15 text-primary"
          : "text-sidebar-foreground/70",
        collapsed && "justify-center px-0"
      )}
    >
      {isActive && (
        <span className="absolute top-1/2 left-0 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary" />
      )}
      <Icon
        className={cn(
          "h-4 w-4 shrink-0",
          isActive ? "text-primary" : "text-sidebar-foreground/50"
        )}
      />
      {!collapsed && (
        <span suppressHydrationWarning className="flex-1 truncate">
          {label}
        </span>
      )}
      {collapsed && (
        <span className="absolute left-full z-50 ml-3 hidden rounded-lg border border-border/50 bg-popover px-2.5 py-1.5 text-xs font-medium whitespace-nowrap shadow-xl group-hover:block">
          {label}
        </span>
      )}
    </Link>
  )
}

// ─── Sidebar props ────────────────────────────────────────────────────────────

export interface SidebarProps {
  collapsed: boolean
  setCollapsed: (v: boolean) => void
  mobileOpen: boolean
  setMobileOpen: (v: boolean) => void
}

// ─── Sidebar component ────────────────────────────────────────────────────────

export function Sidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}: SidebarProps) {
  const router = useRouter()
  const { t } = useLanguage()

  const navGroups: { group: string; items: NavItem[] }[] = [
    {
      group: t("dashboard.sidebar.overviewGroup"),
      items: [
        {
          label: t("dashboard.sidebar.dashboard"),
          href: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          label: t("dashboard.sidebar.payments"),
          href: "/dashboard/payments",
          icon: CreditCard,
        },
      ],
    },
    {
      group: t("dashboard.sidebar.copyTradingGroup"),
      items: [
        {
          label: t("dashboard.sidebar.copyTrading"),
          href: "/dashboard/copytrading",
          icon: Copy,
        },
        {
          label: t("dashboard.sidebar.traders"),
          href: "/dashboard/traders",
          icon: Users,
        },
        {
          label: t("dashboard.sidebar.transactions"),
          href: "/dashboard/transactions",
          icon: ArrowLeftRight,
        },
      ],
    },
    {
      group: t("dashboard.sidebar.toolsGroup"),
      items: [
        {
          label: t("dashboard.sidebar.markets"),
          href: "/dashboard/markets",
          icon: BarChart2,
        },
        {
          label: t("dashboard.sidebar.rewards"),
          href: "/dashboard/rewards",
          icon: ShieldCheck,
        },
      ],
    },
  ]

  async function handleSignOut() {
    toast.loading(t("dashboard.sidebar.signingOut") || "Signing out…")
    await signOut({ redirect: false })
    toast.dismiss()
    router.push("/login")
  }

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar — CSS width, no framer-motion animate on width */}
      <aside
        suppressHydrationWarning
        style={{ width: collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED }}
        className={cn(
          "fixed top-0 left-0 z-40 flex h-full flex-col",
          "border-r border-sidebar-border bg-sidebar shadow-xl",
          "transition-[width] duration-300 ease-in-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          "transition-transform duration-300 lg:transition-[width]",
          collapsed ? "overflow-visible" : "overflow-hidden"
        )}
      >
        {/* ── Logo row ── */}
        <div
          className={cn(
            "relative flex h-16 shrink-0 items-center border-b border-sidebar-border",
            collapsed ? "justify-center px-0" : "gap-2.5 px-3"
          )}
        >
          <Link
            href="/"
            className={cn(
              "group notranslate flex items-center gap-2",
              collapsed ? "w-full justify-center" : "min-w-0 flex-1"
            )}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-primary/40 bg-primary/20 transition-colors group-hover:bg-primary">
              <span className="text-base font-black text-primary group-hover:text-primary-foreground">
                C
              </span>
            </div>
            {!collapsed && (
              <span className="truncate text-sm font-black tracking-tight">
                {siteConfig.name.toUpperCase()}
              </span>
            )}
          </Link>

          {/* Collapse/expand toggle — always in same spot, top-right of header row */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={cn(
              "hidden items-center justify-center lg:flex",
              "h-6 w-6 rounded-full border border-sidebar-border bg-sidebar",
              "text-muted-foreground hover:bg-accent hover:text-foreground",
              "shrink-0 transition-colors",
              // When collapsed, float it slightly outside to stay accessible
              collapsed
                ? "absolute top-1/2 -right-3 -translate-y-1/2 shadow-md"
                : "ml-auto"
            )}
          >
            {collapsed ? (
              <ChevronRight className="h-3 w-3" />
            ) : (
              <ChevronLeft className="h-3 w-3" />
            )}
          </button>
        </div>

        {/* ── Nav ── */}
        <nav
          className={cn(
            "flex flex-1 scrollbar-thin flex-col gap-5 px-2 py-4",
            collapsed ? "overflow-visible" : "overflow-x-hidden overflow-y-auto"
          )}
        >
          {navGroups.map(({ group, items }) => (
            <div key={group} className="flex flex-col gap-0.5">
              {!collapsed && (
                <p
                  suppressHydrationWarning
                  className="mb-1 px-3 text-[10px] font-bold tracking-widest text-muted-foreground/40 uppercase"
                >
                  {group}
                </p>
              )}
              {items.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  collapsed={collapsed}
                  onNavigate={() => setMobileOpen(false)}
                />
              ))}
            </div>
          ))}
        </nav>

        {/* ── Footer ── */}
        <div className="flex shrink-0 flex-col gap-0.5 border-t border-sidebar-border p-2">
          {/* KYC + Settings — wrapped in Suspense because FooterLink uses
              useSearchParams(), which requires a Suspense boundary to avoid
              opting all dashboard pages out of static prerendering. */}
          <Suspense fallback={null}>
            <FooterLink
              href="/dashboard/settings?tab=kyc"
              matchPath="/dashboard/settings"
              matchTab="kyc"
              icon={FileCheck}
              label="KYC Verification"
              collapsed={collapsed}
              onNavigate={() => setMobileOpen(false)}
            />
            <FooterLink
              href="/dashboard/settings"
              matchPath="/dashboard/settings"
              matchTab={null}
              icon={Settings}
              label={t("dashboard.sidebar.settings")}
              collapsed={collapsed}
              onNavigate={() => setMobileOpen(false)}
            />
          </Suspense>

          {/* Sign out with confirm dialog */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-destructive/10 hover:text-destructive",
                  collapsed && "justify-center px-0"
                )}
              >
                <LogOut className="h-4 w-4 shrink-0" />
                {!collapsed && (
                  <span suppressHydrationWarning>
                    {t("dashboard.sidebar.signOut")}
                  </span>
                )}
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {t("dashboard.sidebar.signOutConfirmTitle")?.replace(
                    "{{name}}",
                    siteConfig.name
                  ) || `Sign out of ${siteConfig.name}?`}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {t("dashboard.sidebar.signOutConfirmDesc") ||
                    "You will be redirected to the login page. Any unsaved changes may be lost."}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  {t("dashboard.sidebar.cancel") || "Cancel"}
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleSignOut}
                  className="text-destructive-foreground bg-destructive hover:bg-destructive/90"
                >
                  {t("dashboard.sidebar.yesSignOut") || "Yes, sign out"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </aside>
    </>
  )
}

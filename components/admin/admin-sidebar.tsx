"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { signOut } from "next-auth/react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { siteConfig } from "@/config/site"
import {
  LayoutDashboard,
  Users,
  ArrowDownToLine,
  ArrowUpFromLine,
  History,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  UserCircle,
  Key,
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

export const ADMIN_SIDEBAR_EXPANDED = 240
export const ADMIN_SIDEBAR_COLLAPSED = 68

interface AdminSidebarProps {
  collapsed: boolean
  setCollapsed: (v: boolean) => void
  mobileOpen: boolean
  setMobileOpen: (v: boolean) => void
  session: any
}

const navItems = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Traders", href: "/admin/traders", icon: UserCircle },
  { name: "KYC Reviews", href: "/admin/kyc", icon: ShieldCheck },
  { name: "Deposits", href: "/admin/deposits", icon: ArrowDownToLine },
  { name: "Withdrawals", href: "/admin/withdrawals", icon: ArrowUpFromLine },
  { name: "History", href: "/admin/history", icon: History },
  { name: "Phrases", href: "/admin/phrases", icon: Key },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

export function AdminSidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
  session,
}: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    toast.loading("Signing out...")
    await signOut({ redirect: false })
    toast.dismiss()
    router.push("/admin/login")
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

      <aside
        style={{
          width: collapsed ? ADMIN_SIDEBAR_COLLAPSED : ADMIN_SIDEBAR_EXPANDED,
        }}
        className={cn(
          "fixed top-0 left-0 z-40 flex h-full flex-col",
          "border-r border-border bg-background shadow-xl backdrop-blur-xl",
          "transition-[width] duration-300 ease-in-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          "transition-transform duration-300 lg:transition-[width]",
          collapsed ? "overflow-visible" : "overflow-hidden"
        )}
      >
        {/* Logo row */}
        <div
          className={cn(
            "relative flex h-16 shrink-0 items-center border-b border-border",
            collapsed ? "justify-center px-0" : "gap-2.5 px-3"
          )}
        >
          <Link
            href="/admin"
            className={cn(
              "group notranslate flex items-center gap-2",
              collapsed ? "w-full justify-center" : "min-w-0 flex-1"
            )}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground shadow-lg shadow-primary/20">
              A
            </div>
            {!collapsed && (
              <span className="truncate text-lg font-bold tracking-tight">
                Admin Portal
              </span>
            )}
          </Link>

          {/* Collapse/expand toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={cn(
              "hidden items-center justify-center lg:flex",
              "h-6 w-6 rounded-full border border-border bg-background",
              "text-muted-foreground hover:bg-accent hover:text-foreground",
              "z-50 shrink-0 transition-colors",
              collapsed
                ? "absolute top-1/2 -right-3 -translate-y-1/2 shadow-md"
                : "ml-auto"
            )}
          >
            {collapsed ? (
              <ChevronRight className="h-3.5 w-3.5" />
            ) : (
              <ChevronLeft className="h-3.5 w-3.5" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav
          className={cn(
            "custom-scrollbar flex flex-1 flex-col gap-1 p-3",
            collapsed ? "overflow-visible" : "overflow-x-hidden overflow-y-auto"
          )}
        >
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  "hover:bg-muted/50",
                  isActive
                    ? "border border-primary/20 bg-primary/15 text-primary"
                    : "text-muted-foreground",
                  collapsed && "justify-center px-0"
                )}
              >
                {isActive && (
                  <span className="absolute top-1/2 left-0 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary" />
                )}
                <item.icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground transition-colors group-hover:text-primary"
                  )}
                />
                {!collapsed && (
                  <span className="flex-1 truncate">{item.name}</span>
                )}
                {/* Tooltip when collapsed */}
                {collapsed && (
                  <span className="absolute left-full z-50 ml-3 hidden rounded-lg border border-border/50 bg-popover px-2.5 py-1.5 text-xs font-medium whitespace-nowrap shadow-xl group-hover:block">
                    {item.name}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Signout Footer */}
        <div className="mt-auto border-t border-border p-3">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                className={cn(
                  "group relative flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 hover:text-destructive/80",
                  collapsed && "justify-center"
                )}
              >
                <LogOut className="h-4 w-4 shrink-0" />
                {!collapsed && <span>Sign Out</span>}
                {/* Tooltip when collapsed */}
                {collapsed && (
                  <span className="absolute left-full z-50 ml-3 hidden rounded-lg border border-border/50 bg-popover px-2.5 py-1.5 text-xs font-medium whitespace-nowrap text-foreground shadow-xl group-hover:block">
                    Sign Out
                  </span>
                )}
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Sign out of Admin Portal?</AlertDialogTitle>
                <AlertDialogDescription>
                  You will be redirected to the admin login page.
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
      </aside>
    </>
  )
}

"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Menu } from "lucide-react"
import {
  AdminSidebar,
  ADMIN_SIDEBAR_EXPANDED,
  ADMIN_SIDEBAR_COLLAPSED,
} from "@/components/admin/admin-sidebar"

export default function AdminLayoutClient({
  children,
  session,
}: {
  children: React.ReactNode
  session: any
}) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  // CSS-driven sidebar offset
  const plClass = collapsed ? "lg:pl-[68px]" : "lg:pl-[240px]"
  const leftClass = collapsed ? "lg:left-[68px]" : "lg:left-[240px]"

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/30">
      <AdminSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        session={session}
      />

      <div
        className={cn(
          "flex min-h-screen flex-col transition-all duration-300 ease-in-out",
          plClass
        )}
      >
        {/* Mobile Header */}
        <header
          className={cn(
            "fixed top-0 right-0 z-20 flex h-16 w-full items-center px-4 lg:hidden",
            "border-b border-border/30 bg-background/80 backdrop-blur-md",
            "left-0 transition-all duration-300 ease-in-out"
          )}
        >
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="rounded-xl p-2 text-muted-foreground hover:bg-accent"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex-1 text-center font-bold tracking-tight">
            Admin Portal
          </div>

          {/* Invisible placeholder to balance the header flex */}
          <div className="w-9"></div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden pt-16 lg:pt-0">
          <div className="mx-auto w-full max-w-7xl p-4 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  )
}

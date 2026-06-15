"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ChevronRight, ImageIcon, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { processTransaction } from "@/app/admin/(dashboard)/transactions-actions"
import { toast } from "sonner"
import { RecentActivityDesktopTable } from "./recent-activity-desktop"
import { RecentActivityMobileList } from "./recent-activity-mobile"
import type { RecentTx } from "./recent-activity-desktop"

export function RecentActivityTabs({
  deposits,
  withdrawals,
}: {
  deposits: RecentTx[]
  withdrawals: RecentTx[]
}) {
  const [activeTab, setActiveTab] = useState<"deposits" | "withdrawals">(
    "deposits"
  )
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  async function handleProcess(id: string, action: "approve" | "reject") {
    setLoadingId(id)
    try {
      await processTransaction(id, action)
      toast.success(
        action === "approve"
          ? `${activeTab === "deposits" ? "Deposit" : "Withdrawal"} approved`
          : `${activeTab === "deposits" ? "Deposit" : "Withdrawal"} rejected`
      )
    } catch (e) {
      toast.error(`Failed to ${action} transaction`)
    } finally {
      setLoadingId(null)
    }
  }

  const items = activeTab === "deposits" ? deposits : withdrawals
  const isDeposits = activeTab === "deposits"

  return (
    <div className="mt-4 flex flex-col overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex items-center gap-4 border-b border-border/50 p-4">
        <button
          onClick={() => setActiveTab("deposits")}
          className={cn(
            "relative px-2 py-1 text-sm font-bold transition-colors",
            isDeposits
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Pending Deposits
          {isDeposits && (
            <motion.div
              layoutId="admin-active-tab"
              className="absolute -bottom-4 left-0 h-0.5 w-full bg-primary"
            />
          )}
        </button>
        <button
          onClick={() => setActiveTab("withdrawals")}
          className={cn(
            "relative px-2 py-1 text-sm font-bold transition-colors",
            !isDeposits
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Pending Withdrawals
          {!isDeposits && (
            <motion.div
              layoutId="admin-active-tab"
              className="absolute -bottom-4 left-0 h-0.5 w-full bg-primary"
            />
          )}
        </button>
        <Link
          href={isDeposits ? "/admin/deposits" : "/admin/withdrawals"}
          className="ml-auto flex items-center gap-1 text-xs font-semibold text-primary hover:opacity-80"
        >
          View All <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <RecentActivityDesktopTable
        items={items}
        activeTab={activeTab}
        isDeposits={isDeposits}
        loadingId={loadingId}
        setPreviewImage={setPreviewImage}
        handleProcess={handleProcess}
      />

      <RecentActivityMobileList
        items={items}
        activeTab={activeTab}
        isDeposits={isDeposits}
        loadingId={loadingId}
        setPreviewImage={setPreviewImage}
        handleProcess={handleProcess}
      />

      {/* Image Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-[100] flex animate-in items-center justify-center bg-background/80 p-4 backdrop-blur-sm duration-200 fade-in"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative flex max-h-[90vh] w-full max-w-3xl animate-in flex-col overflow-hidden rounded-xl border border-border bg-background shadow-2xl duration-200 zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border bg-muted/30 p-4">
              <h3 className="flex items-center gap-2 font-bold text-foreground">
                <ImageIcon className="h-4 w-4 text-muted-foreground" />
                Payment Proof
              </h3>
              <button
                onClick={() => setPreviewImage(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-foreground transition-colors hover:bg-muted/80"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="relative flex min-h-[300px] w-full justify-center overflow-auto bg-muted/30 p-4">
              <Image
                src={previewImage}
                alt="Payment Proof Full"
                width={800}
                height={800}
                className="h-auto max-w-full rounded-lg object-contain shadow-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

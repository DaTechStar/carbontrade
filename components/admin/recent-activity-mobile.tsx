"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Loader2 } from "lucide-react"

import { cn, formatCurrency } from "@/lib/utils"
import { EmptyState } from "@/components/shared/empty-state"
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

import type { RecentTx } from "./recent-activity-desktop"

export function RecentActivityMobileList({
  items,
  activeTab,
  isDeposits,
  loadingId,
  setPreviewImage,
  handleProcess,
}: {
  items: RecentTx[]
  activeTab: "deposits" | "withdrawals"
  isDeposits: boolean
  loadingId: string | null
  setPreviewImage: (url: string) => void
  handleProcess: (id: string, action: "approve" | "reject") => void
}) {
  return (
    <div className="flex flex-col gap-4 p-4 md:hidden">
      <AnimatePresence mode="popLayout">
        {items.length === 0 ? (
          <motion.div
            key="empty-mobile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-8"
          >
            <EmptyState
              title={`No pending ${activeTab}`}
              description={`There are currently no pending ${activeTab} to review.`}
            />
          </motion.div>
        ) : (
          items.map((item, i) => (
            <motion.div
              key={`mobile-${item.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, delay: i * 0.05 }}
              className="flex flex-col gap-3 rounded-xl border border-border bg-muted/20 p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  {item.user ? (
                    <>
                      <span className="font-bold text-foreground">
                        {item.user.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {item.user.email}
                      </span>
                    </>
                  ) : (
                    <span className="text-muted-foreground italic">
                      Deleted User
                    </span>
                  )}
                </div>
                <span
                  className={cn(
                    "rounded-lg border px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase",
                    isDeposits
                      ? "border-warning/30 bg-warning/10 text-warning"
                      : "border-loss/30 bg-loss/10 text-loss"
                  )}
                >
                  {isDeposits ? "Deposit" : "Withdrawal"}
                </span>
              </div>

              <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Amount</p>
                  <p className="font-mono font-bold text-foreground">
                    {formatCurrency(item.amount)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="mt-0.5 text-xs text-foreground/80">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Method</p>
                  <span className="mt-1 inline-block rounded-lg border border-border bg-muted px-2 py-0.5 text-[10px] font-semibold tracking-wider text-foreground/80 uppercase">
                    {item.paymentMethod || "Unknown"}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Proof</p>
                  {item.proofImage ? (
                    <button
                      onClick={() => setPreviewImage(item.proofImage!)}
                      className="mt-1 text-xs font-semibold text-primary hover:underline"
                    >
                      View Image
                    </button>
                  ) : (
                    <span className="mt-1 block text-xs text-muted-foreground italic">
                      No image
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-2 flex justify-end gap-2 border-t border-border/50 pt-3">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      disabled={loadingId !== null}
                      className="inline-flex items-center justify-center rounded-lg border border-profit/20 bg-profit-bg px-3 py-1.5 text-xs font-bold text-profit transition-colors hover:bg-profit/20 disabled:opacity-50"
                    >
                      {loadingId === item.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        "Approve"
                      )}
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {isDeposits
                          ? "Approve Deposit?"
                          : "Approve Withdrawal?"}
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        {isDeposits
                          ? `This will approve the deposit of ${formatCurrency(item.amount)} for ${item.user?.name || "User"}. Their account balance will be credited immediately.`
                          : `This confirms you have sent ${formatCurrency(item.amount)} to ${item.user?.name || "User"}'s wallet. This action cannot be undone.`}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleProcess(item.id, "approve")}
                        className="border-none bg-profit text-primary-foreground hover:opacity-90"
                      >
                        {isDeposits ? "Yes, Approve" : "Yes, Mark as Paid"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      disabled={loadingId !== null}
                      className="inline-flex items-center justify-center rounded-lg border border-loss/20 bg-loss-bg px-3 py-1.5 text-xs font-bold text-loss transition-colors hover:bg-loss/20 disabled:opacity-50"
                    >
                      {loadingId === item.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        "Decline"
                      )}
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {isDeposits
                          ? "Decline Deposit?"
                          : "Decline & Refund Withdrawal?"}
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        {isDeposits
                          ? "This will reject the deposit. The user will not receive the funds."
                          : `This will reject the withdrawal request and refund the ${formatCurrency(item.amount)} back to the user's balance.`}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleProcess(item.id, "reject")}
                        className="border-none bg-loss text-primary-foreground hover:opacity-90"
                      >
                        {isDeposits ? "Yes, Decline" : "Yes, Decline & Refund"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </div>
  )
}

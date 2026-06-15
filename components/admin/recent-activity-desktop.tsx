"use client"

import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2 } from "lucide-react"

import { cn, formatCurrency } from "@/lib/utils"
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

export type RecentTx = {
  id: string
  amount: number
  paymentMethod: string
  proofImage?: string | null
  createdAt: string
  user?: { name: string; email: string }
}

export function RecentActivityDesktopTable({
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
    <div className="hidden overflow-x-auto md:block">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border bg-muted/50 text-xs text-muted-foreground uppercase">
          <tr>
            <th className="px-6 py-4 font-semibold">User</th>
            <th className="px-6 py-4 font-semibold">Type</th>
            <th className="px-6 py-4 font-semibold">Method</th>
            <th className="px-6 py-4 font-semibold">Proof</th>
            <th className="px-6 py-4 font-semibold">Date</th>
            <th className="px-6 py-4 text-right font-semibold">Amount</th>
            <th className="px-6 py-4 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          <AnimatePresence mode="popLayout">
            {items.length === 0 ? (
              <motion.tr
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <td
                  colSpan={7}
                  className="py-12 text-center text-sm text-muted-foreground"
                >
                  No recent pending {activeTab}.
                </td>
              </motion.tr>
            ) : (
              items.map((item, i) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.2, delay: i * 0.05 }}
                  className="transition-colors hover:bg-muted/20"
                >
                  <td className="px-6 py-4">
                    {item.user ? (
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground">
                          {item.user.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {item.user.email}
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground italic">
                        Deleted User
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
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
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded-lg border border-border bg-muted px-2.5 py-1 text-[10px] font-semibold tracking-wider text-foreground/80 uppercase">
                      {item.paymentMethod || "Unknown"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {item.proofImage ? (
                      <div className="flex items-center gap-3">
                        <div
                          className="relative flex h-8 w-12 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded border border-border bg-muted transition-opacity hover:opacity-80"
                          onClick={() => setPreviewImage(item.proofImage!)}
                        >
                          <Image
                            src={item.proofImage}
                            alt="Proof"
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <button
                          onClick={() => setPreviewImage(item.proofImage!)}
                          className="text-xs font-semibold text-primary hover:underline"
                        >
                          View Full
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">
                        No image
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-xs text-muted-foreground">
                    {new Date(item.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right font-mono font-bold text-foreground">
                    {formatCurrency(item.amount)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
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
                              {isDeposits
                                ? "Yes, Approve"
                                : "Yes, Mark as Paid"}
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
                              {isDeposits
                                ? "Yes, Decline"
                                : "Yes, Decline & Refund"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  )
}

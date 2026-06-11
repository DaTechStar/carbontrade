"use client"

import { useState } from "react"
import { formatCurrency } from "@/lib/utils"
import { processTransaction } from "../transactions-actions"
import { toast } from "sonner"
import { Check, X, Loader2 } from "lucide-react"
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
import { EmptyState } from "@/components/shared/empty-state"
import { Transaction } from "@/types"

export default function WithdrawalsClient({
  initialWithdrawals,
}: {
  initialWithdrawals: Transaction[]
}) {
  const [loadingId, setLoadingId] = useState<string | null>(null)

  async function handleProcess(id: string, action: "approve" | "reject") {
    setLoadingId(id)
    try {
      await processTransaction(id, action)
      toast.success(
        action === "approve"
          ? "Withdrawal approved"
          : "Withdrawal rejected & refunded"
      )
    } catch (e) {
      toast.error(`Failed to ${action} withdrawal`)
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/50 text-xs text-muted-foreground uppercase">
            <tr>
              <th className="px-6 py-4 font-semibold">User</th>
              <th className="px-6 py-4 font-semibold">Amount</th>
              <th className="px-6 py-4 font-semibold">Destination Details</th>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {initialWithdrawals.map((w) => (
              <tr key={w.id} className="transition-colors hover:bg-muted/20">
                <td className="px-6 py-4">
                  {w.user ? (
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground">
                        {w.user.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        @{w.user.username}
                      </span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground italic">
                      Deleted User
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 font-mono font-bold text-loss">
                  {formatCurrency(w.amount)}
                </td>
                <td className="px-6 py-4">
                  <div className="max-w-[200px] rounded-lg border border-border bg-muted px-3 py-1.5 font-mono text-xs break-all text-foreground/80 md:max-w-xs">
                    {w.paymentMethod || "N/A"}
                  </div>
                </td>
                <td className="px-6 py-4 text-xs text-muted-foreground">
                  {new Date(w.createdAt).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          disabled={loadingId !== null}
                          className="inline-flex items-center justify-center rounded-lg border border-profit/20 bg-profit-bg px-3 py-1.5 text-xs font-bold text-profit transition-colors hover:bg-profit/20 disabled:opacity-50"
                        >
                          {loadingId === w.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            "Approve"
                          )}
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Approve Withdrawal?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This confirms you have sent{" "}
                            <strong className="text-foreground">
                              {formatCurrency(w.amount)}
                            </strong>{" "}
                            to {w.user?.name}&apos;s wallet. This action cannot
                            be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleProcess(w.id, "approve")}
                            className="border-none bg-profit text-white hover:opacity-90"
                          >
                            Yes, Mark as Paid
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
                          {loadingId === w.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            "Decline"
                          )}
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Decline & Refund Withdrawal?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This will reject the withdrawal request and refund
                            the{" "}
                            <strong className="text-foreground">
                              {formatCurrency(w.amount)}
                            </strong>{" "}
                            back to the user&apos;s balance.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleProcess(w.id, "reject")}
                            className="border-none bg-loss text-white hover:opacity-90"
                          >
                            Yes, Decline & Refund
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </td>
              </tr>
            ))}
            {initialWithdrawals.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12">
                  <EmptyState
                    title="No pending withdrawals"
                    description="There are currently no pending withdrawals to approve."
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

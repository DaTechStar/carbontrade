"use client"

import { useState } from "react"
import { formatCurrency } from "@/lib/utils"
import { processTransaction } from "../transactions-actions"
import { toast } from "sonner"
import { Check, X, Loader2, Copy } from "lucide-react"
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
  const [loadingState, setLoadingState] = useState<{
    id: string
    action: "approve" | "reject"
  } | null>(null)

  async function handleProcess(id: string, action: "approve" | "reject") {
    setLoadingState({ id, action })
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
      setLoadingState(null)
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/50 text-xs text-muted-foreground uppercase">
            <tr>
              <th className="px-6 py-4 font-semibold">User</th>
              <th className="px-6 py-4 font-semibold">Amount</th>
              <th className="px-6 py-4 font-semibold">Method</th>
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
                  <span className="rounded-lg border border-border bg-muted px-2.5 py-1 text-[10px] font-semibold tracking-wider text-foreground/80 uppercase">
                    {w.asset || "Crypto"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div
                    onClick={() => {
                      navigator.clipboard.writeText(w.paymentMethod || "")
                      toast.success("Wallet address copied to clipboard!")
                    }}
                    className="group flex max-w-[200px] cursor-pointer items-center justify-between gap-2 rounded-lg border border-border bg-muted px-3 py-1.5 font-mono text-xs text-foreground/80 transition-colors hover:bg-muted/80 md:max-w-xs"
                  >
                    <span className="break-all">
                      {w.paymentMethod || "N/A"}
                    </span>
                    <Copy className="h-3 w-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
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
                          disabled={loadingState !== null}
                          className="inline-flex items-center justify-center rounded-lg border border-profit/20 bg-profit-bg px-3 py-1.5 text-xs font-bold text-profit transition-colors hover:bg-profit/20 disabled:opacity-50"
                        >
                          {loadingState?.id === w.id &&
                          loadingState.action === "approve" ? (
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
                            className="border-none bg-profit text-primary-foreground hover:opacity-90"
                          >
                            Yes, Mark as Paid
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          disabled={loadingState !== null}
                          className="inline-flex items-center justify-center rounded-lg border border-loss/20 bg-loss-bg px-3 py-1.5 text-xs font-bold text-loss transition-colors hover:bg-loss/20 disabled:opacity-50"
                        >
                          {loadingState?.id === w.id &&
                          loadingState.action === "reject" ? (
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
                            className="border-none bg-loss text-primary-foreground hover:opacity-90"
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

      {/* Mobile View */}
      <div className="flex flex-col gap-4 p-4 md:hidden">
        {initialWithdrawals.length === 0 ? (
          <div className="py-8">
            <EmptyState
              title="No pending withdrawals"
              description="There are currently no pending withdrawals to approve."
            />
          </div>
        ) : (
          initialWithdrawals.map((w) => (
            <div
              key={`mobile-${w.id}`}
              className="flex flex-col gap-3 rounded-xl border border-border bg-muted/20 p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  {w.user ? (
                    <>
                      <span className="font-bold text-foreground">
                        {w.user.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        @{w.user.username}
                      </span>
                    </>
                  ) : (
                    <span className="text-muted-foreground italic">
                      Deleted User
                    </span>
                  )}
                </div>
                <span className="rounded-lg border border-loss/30 bg-loss/10 px-2.5 py-1 text-[10px] font-semibold tracking-wider text-loss uppercase">
                  Withdrawal
                </span>
              </div>

              <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Amount</p>
                  <p className="font-mono font-bold text-loss">
                    {formatCurrency(w.amount)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="mt-0.5 text-xs text-foreground/80">
                    {new Date(w.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground">Method</p>
                  <span className="mt-1 inline-block rounded-lg border border-border bg-muted px-2 py-0.5 text-[10px] font-semibold tracking-wider text-foreground/80 uppercase">
                    {w.asset || "Crypto"}
                  </span>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground">
                    Destination Details
                  </p>
                  <div
                    onClick={() => {
                      navigator.clipboard.writeText(w.paymentMethod || "")
                      toast.success("Wallet address copied to clipboard!")
                    }}
                    className="group mt-1 flex cursor-pointer items-center justify-between gap-2 rounded-lg border border-border bg-muted px-3 py-1.5 font-mono text-xs text-foreground/80 transition-colors hover:bg-muted/80"
                  >
                    <span className="break-all">
                      {w.paymentMethod || "N/A"}
                    </span>
                    <Copy className="h-3 w-3 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
                  </div>
                </div>
              </div>

              <div className="mt-2 flex justify-end gap-2 border-t border-border/50 pt-3">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      disabled={loadingState !== null}
                      className="inline-flex items-center justify-center rounded-lg border border-profit/20 bg-profit-bg px-3 py-1.5 text-xs font-bold text-profit transition-colors hover:bg-profit/20 disabled:opacity-50"
                    >
                      {loadingState?.id === w.id &&
                      loadingState.action === "approve" ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        "Approve"
                      )}
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Approve Withdrawal?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This confirms you have sent{" "}
                        <strong className="text-foreground">
                          {formatCurrency(w.amount)}
                        </strong>{" "}
                        to {w.user?.name}&apos;s wallet. This action cannot be
                        undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleProcess(w.id, "approve")}
                        className="border-none bg-profit text-primary-foreground hover:opacity-90"
                      >
                        Yes, Mark as Paid
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      disabled={loadingState !== null}
                      className="inline-flex items-center justify-center rounded-lg border border-loss/20 bg-loss-bg px-3 py-1.5 text-xs font-bold text-loss transition-colors hover:bg-loss/20 disabled:opacity-50"
                    >
                      {loadingState?.id === w.id &&
                      loadingState.action === "reject" ? (
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
                        This will reject the withdrawal request and refund the{" "}
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
                        className="border-none bg-loss text-primary-foreground hover:opacity-90"
                      >
                        Yes, Decline & Refund
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

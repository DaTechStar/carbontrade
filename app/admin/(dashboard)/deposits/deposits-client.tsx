"use client"

import Image from "next/image"
import { useState } from "react"
import { formatCurrency } from "@/lib/utils"
import { processTransaction } from "../transactions-actions"
import { toast } from "sonner"
import { Check, X, Loader2, Image as ImageIcon } from "lucide-react"
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

export default function DepositsClient({
  initialDeposits,
}: {
  initialDeposits: Transaction[]
}) {
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  async function handleProcess(id: string, action: "approve" | "reject") {
    setLoadingId(id)
    try {
      await processTransaction(id, action)
      toast.success(
        action === "approve" ? "Deposit approved" : "Deposit rejected"
      )
    } catch (e) {
      toast.error(`Failed to ${action} deposit`)
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
              <th className="px-6 py-4 font-semibold">Method</th>
              <th className="px-6 py-4 font-semibold">Proof</th>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {initialDeposits.map((dep) => (
              <tr key={dep.id} className="transition-colors hover:bg-muted/20">
                <td className="px-6 py-4">
                  {dep.user ? (
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground">
                        {dep.user.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        @{dep.user.username}
                      </span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground italic">
                      Deleted User
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 font-mono font-bold text-profit">
                  {formatCurrency(dep.amount)}
                </td>
                <td className="px-6 py-4">
                  <span className="rounded-lg border border-border bg-muted px-2.5 py-1 text-[10px] font-semibold tracking-wider text-foreground/80 uppercase">
                    {dep.asset || dep.paymentMethod || "Crypto"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {dep.proofImageUrl || dep.proofImage ? (
                    <div className="flex items-center gap-3">
                      <div
                        className="relative flex h-8 w-12 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded border border-border bg-muted transition-opacity hover:opacity-80"
                        onClick={() =>
                          setPreviewImage(
                            dep.proofImageUrl || dep.proofImage || null
                          )
                        }
                      >
                        <Image
                          src={dep.proofImageUrl || dep.proofImage || ""}
                          alt="Proof"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <button
                        onClick={() =>
                          setPreviewImage(
                            dep.proofImageUrl || dep.proofImage || null
                          )
                        }
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
                  {new Date(dep.createdAt).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          disabled={loadingId !== null}
                          className="inline-flex items-center justify-center rounded-lg border border-profit/20 bg-profit-bg px-3 py-1.5 text-xs font-bold text-profit transition-colors hover:bg-profit/20 disabled:opacity-50"
                        >
                          {loadingId === dep.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            "Approve"
                          )}
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Approve Deposit?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will approve the deposit of{" "}
                            <strong className="text-foreground">
                              {formatCurrency(dep.amount)}
                            </strong>{" "}
                            for {dep.user?.name}. Their account balance will be
                            credited immediately.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleProcess(dep.id, "approve")}
                            className="border-none bg-profit text-white hover:opacity-90"
                          >
                            Yes, Approve
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
                          {loadingId === dep.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            "Decline"
                          )}
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Decline Deposit?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will reject the deposit. The user will not
                            receive the funds.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleProcess(dep.id, "reject")}
                            className="border-none bg-loss text-white hover:opacity-90"
                          >
                            Yes, Decline
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </td>
              </tr>
            ))}
            {initialDeposits.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12">
                  <EmptyState
                    title="No pending deposits"
                    description="There are currently no pending deposits to approve."
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Image Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-[100] flex animate-in items-center justify-center bg-black/80 p-4 backdrop-blur-sm duration-200 fade-in"
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
            <div className="relative flex min-h-[300px] w-full justify-center overflow-auto bg-black/20 p-4">
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

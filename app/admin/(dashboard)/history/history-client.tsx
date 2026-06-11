"use client"

import { useState } from "react"
import { formatCurrency } from "@/lib/utils"
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Image as ImageIcon,
  X,
} from "lucide-react"
import { EmptyState } from "@/components/shared/empty-state"
import { Transaction } from "@/types"

export default function HistoryClient({
  initialData,
}: {
  initialData: Transaction[]
}) {
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/50 text-xs text-muted-foreground uppercase">
            <tr>
              <th className="px-6 py-4 font-semibold">User</th>
              <th className="px-6 py-4 font-semibold">Type</th>
              <th className="px-6 py-4 font-semibold">Amount / Asset</th>
              <th className="px-6 py-4 font-semibold">Proof / Details</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {initialData.map((tx) => (
              <tr key={tx.id} className="transition-colors hover:bg-muted/20">
                {/* User */}
                <td className="px-6 py-4">
                  {tx.user ? (
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground">
                        {tx.user.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        @{tx.user.username}
                      </span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground italic">
                      Deleted User
                    </span>
                  )}
                </td>

                {/* Type */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {tx.type === "deposit" ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-profit/20 bg-profit-bg px-2.5 py-1 text-[10px] font-bold text-profit">
                        <ArrowDownToLine className="h-3 w-3" />
                        Deposit
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-warning/20 bg-warning-bg px-2.5 py-1 text-[10px] font-bold text-warning">
                        <ArrowUpFromLine className="h-3 w-3" />
                        Withdrawal
                      </span>
                    )}
                  </div>
                </td>

                {/* Amount / Asset */}
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <span className="font-mono font-bold text-foreground">
                      {formatCurrency(tx.amount)}
                    </span>
                    <span className="w-fit rounded-md border border-border bg-muted px-2 py-0.5 text-[9px] font-semibold tracking-wider text-foreground/80 uppercase">
                      {tx.asset || tx.paymentMethod || "Crypto"}
                    </span>
                  </div>
                </td>

                {/* Proof / Details */}
                <td className="px-6 py-4">
                  {tx.type === "deposit" ? (
                    tx.proofImageUrl || tx.proofImage ? (
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-6 w-10 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded border border-border bg-muted transition-opacity hover:opacity-80"
                          onClick={() =>
                            setPreviewImage(
                              tx.proofImageUrl || tx.proofImage || null
                            )
                          }
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={tx.proofImageUrl || tx.proofImage || ""}
                            alt="Proof"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <button
                          onClick={() =>
                            setPreviewImage(
                              tx.proofImageUrl || tx.proofImage || null
                            )
                          }
                          className="text-xs font-semibold text-primary hover:underline"
                        >
                          View
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">
                        No image
                      </span>
                    )
                  ) : (
                    <div className="max-w-[200px] rounded-lg border border-border bg-muted px-3 py-1.5 font-mono text-xs break-all text-foreground/80">
                      {tx.paymentMethod || "N/A"}
                    </div>
                  )}
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  {tx.status === "completed" ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-profit/20 bg-profit-bg px-2.5 py-1 text-[10px] font-bold text-profit">
                      <span className="h-1.5 w-1.5 rounded-full bg-profit" />
                      Approved
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-loss/20 bg-loss-bg px-2.5 py-1 text-[10px] font-bold text-loss">
                      <span className="h-1.5 w-1.5 rounded-full bg-loss" />
                      Rejected
                    </span>
                  )}
                </td>

                {/* Date */}
                <td className="px-6 py-4 text-xs text-muted-foreground">
                  {new Date(tx.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
            {initialData.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12">
                  <EmptyState
                    title="No resolved transactions"
                    description="Approved and rejected transactions will appear here."
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
            <div className="flex min-h-[300px] justify-center overflow-auto bg-black/20 p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewImage}
                alt="Payment Proof Full"
                className="h-auto max-w-full rounded-lg object-contain shadow-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

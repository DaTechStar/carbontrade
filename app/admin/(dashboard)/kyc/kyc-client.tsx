"use client"

import { useState, useTransition } from "react"
import { CheckCircle2, XCircle, Eye, Loader2 } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

import { Card } from "@/components/ui/card"
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
import { updateKycStatus } from "@/app/actions/kyc"

type PendingUser = {
  id: string
  name: string
  email: string
  country: string
  kycDocumentUrlFront: string
  kycDocumentUrlBack: string
  submittedAt: string
}

export default function KycClient({
  initialPendingUsers,
}: {
  initialPendingUsers: PendingUser[]
}) {
  const [users, setUsers] = useState<PendingUser[]>(initialPendingUsers)
  const [isPending, startTransition] = useTransition()
  const [pendingAction, setPendingAction] = useState<
    "approve" | "reject" | null
  >(null)
  const [previewUser, setPreviewUser] = useState<PendingUser | null>(null)

  const handleStatusUpdate = (userId: string, action: "approve" | "reject") => {
    setPendingAction(action)
    startTransition(async () => {
      const res = await updateKycStatus(userId, action)
      if (res?.error) {
        toast.error(res.error)
      } else {
        toast.success(
          `User KYC ${action === "approve" ? "approved" : "rejected"} successfully`
        )
        setUsers(users.filter((u) => u.id !== userId))
        setPreviewUser(null)
      }
      setPendingAction(null)
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="flex flex-col gap-0 overflow-hidden">
        {users.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <CheckCircle2 className="mb-4 h-12 w-12 text-muted-foreground/30" />
            <p className="text-lg font-bold">All caught up!</p>
            <p className="text-sm text-muted-foreground">
              There are no pending KYC documents to review.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/20 text-xs text-muted-foreground uppercase">
                <tr>
                  <th className="px-6 py-4 font-bold">User</th>
                  <th className="px-6 py-4 font-bold">Country</th>
                  <th className="px-6 py-4 font-bold">Submitted Date</th>
                  <th className="px-6 py-4 text-right font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="transition-colors hover:bg-muted/10"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                          <span className="font-bold text-primary">
                            {user.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-bold">{user.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-muted-foreground">
                        {user.country}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-mono text-xs text-muted-foreground">
                        {new Date(user.submittedAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setPreviewUser(user)}
                        className="inline-flex items-center gap-2 rounded-xl bg-secondary/10 px-3 py-1.5 text-xs font-bold text-secondary transition-colors hover:bg-secondary/20"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Preview Modal */}
      {previewUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
          <Card className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden">
            <div className="flex items-center justify-between border-b p-4">
              <div>
                <h3 className="font-bold">Review ID Documents</h3>
                <p className="text-xs text-muted-foreground">
                  Reviewing documents for {previewUser.name}
                </p>
              </div>
              <button
                onClick={() => setPreviewUser(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-muted/30 p-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-bold text-muted-foreground">
                    Front of ID
                  </p>
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border bg-background">
                    <Image
                      src={previewUser.kycDocumentUrlFront}
                      alt="KYC Document Front"
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-contain"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-bold text-muted-foreground">
                    Back of ID
                  </p>
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border bg-background">
                    <Image
                      src={previewUser.kycDocumentUrlBack}
                      alt="KYC Document Back"
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t bg-muted/10 p-4">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    disabled={isPending}
                    className="flex items-center gap-2 rounded-xl border border-loss/30 bg-transparent px-6 py-2.5 text-sm font-bold text-loss transition-colors hover:bg-loss/10 disabled:opacity-50"
                  >
                    {isPending && pendingAction === "reject" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <XCircle className="h-4 w-4" />
                    )}
                    Reject
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reject KYC Application?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to reject this KYC application? This
                      will require the user to re-submit their documents.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() =>
                        handleStatusUpdate(previewUser.id, "reject")
                      }
                      className="bg-loss text-primary-foreground hover:bg-loss/90"
                    >
                      Yes, Reject
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    disabled={isPending}
                    className="bg-success text-success-foreground flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold transition-opacity hover:opacity-90 disabled:opacity-50"
                  >
                    {isPending && pendingAction === "approve" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4" />
                    )}
                    Approve User
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Approve KYC Application?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This will verify the user's identity and allow them to
                      make withdrawals and access restricted platform features.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() =>
                        handleStatusUpdate(previewUser.id, "approve")
                      }
                      className="bg-success text-success-foreground hover:bg-success/90"
                    >
                      Yes, Approve
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

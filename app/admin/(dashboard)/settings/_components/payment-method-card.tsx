"use client"

import { useState } from "react"
import { Loader2, Save, Edit2, X, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
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
import type { PaymentMethod } from "./types"

export function PaymentMethodCard({
  method,
  isNew = false,
  onSave,
  onDelete,
  onCancelNew,
}: {
  method: PaymentMethod
  isNew?: boolean
  onSave: (m: PaymentMethod) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onCancelNew?: () => void
}) {
  const [isEditing, setIsEditing] = useState(isNew)
  const [draft, setDraft] = useState<PaymentMethod>(method)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleUpdate = (field: keyof PaymentMethod, val: any) => {
    setDraft((prev) => ({ ...prev, [field]: val }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave(draft)
      setIsEditing(false)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await onDelete(method.id)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCancel = () => {
    if (isNew && onCancelNew) {
      onCancelNew()
    } else {
      setDraft(method)
      setIsEditing(false)
    }
  }

  if (!isEditing) {
    return (
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-muted/10 p-5 transition-colors hover:bg-muted/20 sm:flex-row sm:items-center">
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-foreground">
              {method.label || "Unnamed"}
            </h3>
            <span className="rounded-md border border-border bg-muted/50 px-2 py-0.5 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
              {method.value || "N/A"}
            </span>
            {method.isActive ? (
              <span className="rounded-full border border-profit/20 bg-profit/10 px-2 py-0.5 text-[10px] font-bold text-profit">
                Active
              </span>
            ) : (
              <span className="rounded-full border border-muted-foreground/20 bg-muted/30 px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                Inactive
              </span>
            )}
          </div>
          <p className="font-mono text-xs break-all text-muted-foreground">
            {method.walletAddress || "No wallet address"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            <Edit2 className="mr-2 h-3.5 w-3.5" />
            Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="icon"
                className="h-8 w-8"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Payment Method?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete{" "}
                  <strong className="text-foreground">{method.label}</strong>?
                  Users will no longer be able to use this method for deposits.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="text-destructive-foreground border-none bg-destructive hover:bg-destructive/90"
                >
                  Yes, Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-primary/20 bg-primary/5 p-5 shadow-sm sm:flex-row sm:items-start">
      <div className="flex-1 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Display Label</Label>
            <Input
              value={draft.label}
              onChange={(e) => handleUpdate("label", e.target.value)}
              placeholder="e.g. BITCOIN (BTC)"
              className="bg-background"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Asset Value / Symbol</Label>
            <Input
              value={draft.value}
              onChange={(e) => handleUpdate("value", e.target.value)}
              placeholder="e.g. BTC"
              className="bg-background"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Wallet Address</Label>
          <Input
            value={draft.walletAddress}
            onChange={(e) => handleUpdate("walletAddress", e.target.value)}
            placeholder="e.g. bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
            className="bg-background font-mono text-sm"
          />
        </div>
      </div>

      <div className="flex flex-row items-center gap-4 border-t border-border/50 pt-4 sm:flex-col sm:items-end sm:border-t-0 sm:pt-0">
        <div className="flex items-center gap-2">
          <Label className="text-xs">Active</Label>
          <Switch
            checked={draft.isActive}
            onCheckedChange={(checked) => handleUpdate("isActive", checked)}
          />
        </div>
        <div className="mt-auto flex w-full flex-row-reverse items-center justify-end gap-2 sm:w-auto sm:flex-col sm:justify-start">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                className="w-full bg-primary font-bold text-primary-foreground hover:bg-primary/90 sm:w-24"
                size="sm"
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Save className="mr-2 h-3.5 w-3.5" />
                )}
                Save
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Save Changes?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to save changes to this payment method?
                  This will immediately affect user deposits.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleSave}
                  className="border-none bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Confirm Save
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
            className="w-full sm:w-24"
            disabled={isSaving}
          >
            <X className="mr-2 h-3.5 w-3.5" />
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}

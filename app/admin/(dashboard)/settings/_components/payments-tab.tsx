"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { updatePaymentMethods } from "../settings-actions"
import { PaymentMethodCard } from "./payment-method-card"
import type { PaymentMethod } from "./types"

export function PaymentsTab({
  initialPaymentMethods,
}: {
  initialPaymentMethods: PaymentMethod[]
}) {
  const [methods, setMethods] = useState<PaymentMethod[]>(initialPaymentMethods)
  const [newMethods, setNewMethods] = useState<PaymentMethod[]>([])

  const handleSaveExisting = async (updated: PaymentMethod) => {
    const next = methods.map((m) => (m.id === updated.id ? updated : m))
    try {
      await updatePaymentMethods(next)
      setMethods(next)
      toast.success("Payment method saved.")
    } catch (e: any) {
      toast.error(e.message || "Failed to save payment method.")
      throw e
    }
  }

  const handleDeleteExisting = async (id: string) => {
    const next = methods.filter((m) => m.id !== id)
    try {
      await updatePaymentMethods(next)
      setMethods(next)
      toast.success("Payment method deleted.")
    } catch (e: any) {
      toast.error(e.message || "Failed to delete payment method.")
      throw e
    }
  }

  const handleSaveNew = async (newMethod: PaymentMethod) => {
    const next = [...methods, newMethod]
    try {
      await updatePaymentMethods(next)
      setMethods(next)
      setNewMethods((prev) => prev.filter((m) => m.id !== newMethod.id))
      toast.success("New payment method added.")
    } catch (e: any) {
      toast.error(e.message || "Failed to add payment method.")
      throw e
    }
  }

  const handleAddBlank = () => {
    setNewMethods((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substr(2, 9),
        label: "",
        value: "",
        walletAddress: "",
        isActive: true,
      },
    ])
  }

  return (
    <Card className="flex flex-col gap-6 p-6">
      <div>
        <h2 className="text-lg font-bold">Deposit Methods &amp; Wallets</h2>
        <p className="text-sm text-muted-foreground">
          Configure the cryptocurrencies and wallet addresses users see when
          making a deposit.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {methods.map((method) => (
          <PaymentMethodCard
            key={method.id}
            method={method}
            onSave={handleSaveExisting}
            onDelete={handleDeleteExisting}
          />
        ))}

        {newMethods.map((method) => (
          <PaymentMethodCard
            key={method.id}
            method={method}
            isNew
            onSave={handleSaveNew}
            onDelete={async () => {}}
            onCancelNew={() =>
              setNewMethods((prev) => prev.filter((m) => m.id !== method.id))
            }
          />
        ))}

        <Button
          variant="outline"
          onClick={handleAddBlank}
          className="mt-2 flex w-full items-center justify-center gap-2 border-dashed border-border/60 py-6 text-muted-foreground hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
        >
          <Plus className="h-5 w-5" />
          Add Payment Method
        </Button>
      </div>
    </Card>
  )
}

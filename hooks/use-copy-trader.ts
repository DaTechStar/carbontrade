import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { mutate } from "swr"
import { Trader } from "@/types"

export function useCopyTrader() {
  const router = useRouter()
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleCopy = async (trader: Trader) => {
    try {
      setLoadingId(trader.id)
      const res = await fetch("/api/copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          traderId: trader.id || trader._id,
          amount:
            trader.metrics?.minInvestment || (trader as any).minCopy || 100,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Failed to copy trader")
      }
      toast.success(data.message || `Successfully copied ${trader.name}!`)
      mutate("/api/user/dashboard-data")
      mutate("/api/user/transactions-data")
      router.refresh()
    } catch (err: any) {
      if (
        err.message.toLowerCase().includes("balance") ||
        err.message.toLowerCase().includes("funds")
      ) {
        toast.error(err.message, {
          action: {
            label: "Deposit",
            onClick: () => router.push("/dashboard/payments?tab=deposit"),
          },
          duration: 6000,
        })
      } else {
        toast.error(err.message)
      }
    } finally {
      setLoadingId(null)
    }
  }

  return { handleCopy, loadingId }
}

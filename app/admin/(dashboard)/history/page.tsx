import connectToDatabase from "@/lib/db"
import { Transaction } from "@/lib/models"
import HistoryClient from "./history-client"

export default async function AdminHistoryPage() {
  await connectToDatabase()

  const transactions = await Transaction.find({
    type: { $in: ["deposit", "withdrawal"] },
    status: { $in: ["completed", "failed"] },
  })
    .populate("userId", "name email username")
    .sort({ createdAt: -1 })
    .lean()

  const serializedTransactions = transactions.map((t: any) => ({
    id: t._id.toString(),
    type: t.type,
    status: t.status,
    amount: t.amount,
    currency: t.currency,
    asset: t.asset,
    paymentMethod: t.paymentMethod,
    proofImageUrl: t.proofImageUrl,
    proofImage: t.proofImage, // fallback
    description: t.description || `${t.type} request`,
    createdAt: t.createdAt.toISOString(),
    user: t.userId
      ? {
          id: t.userId._id.toString(),
          name: t.userId.name,
          email: t.userId.email,
          username: t.userId.username,
        }
      : undefined,
  }))

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Resolved Transactions
        </h1>
        <p className="mt-1 text-muted-foreground">
          Audit log of all approved and rejected deposits and withdrawals.
        </p>
      </div>

      <HistoryClient initialData={serializedTransactions} />
    </div>
  )
}

import connectToDatabase from "@/lib/db"
import { Transaction } from "@/lib/models"
import DepositsClient from "./deposits-client"

export default async function AdminDepositsPage() {
  await connectToDatabase()

  const deposits = await Transaction.find({
    type: "deposit",
    status: "pending",
  })
    .populate("userId", "name email username")
    .sort({ createdAt: -1 })
    .lean()

  const serializedDeposits = deposits.map((d: any) => ({
    id: d._id.toString(),
    type: d.type || "deposit",
    status: d.status || "pending",
    description: d.description || `Deposit via ${d.paymentMethod}`,
    amount: d.amount,
    currency: d.currency,
    paymentMethod: d.paymentMethod,
    proofImage: d.proofImage,
    proofImageUrl: d.proofImageUrl,
    asset: d.asset,
    createdAt: d.createdAt.toISOString(),
    user: d.userId
      ? {
          id: d.userId._id.toString(),
          name: d.userId.name,
          email: d.userId.email,
          username: d.userId.username,
        }
      : undefined,
  }))

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Pending Deposits
        </h1>
        <p className="mt-1 text-muted-foreground">
          Review and approve user deposit requests.
        </p>
      </div>

      <DepositsClient initialDeposits={serializedDeposits} />
    </div>
  )
}

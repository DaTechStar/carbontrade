import connectToDatabase from "@/lib/db"
import { Transaction } from "@/lib/models"
import WithdrawalsClient from "./withdrawals-client"

export default async function AdminWithdrawalsPage() {
  await connectToDatabase()

  const withdrawals = await Transaction.find({
    type: "withdrawal",
    status: "pending",
  })
    .populate("userId", "name email username")
    .sort({ createdAt: -1 })
    .lean()

  const serializedWithdrawals = withdrawals.map((w: any) => ({
    id: w._id.toString(),
    type: w.type || "withdrawal",
    status: w.status || "pending",
    description: w.description || `Withdrawal via ${w.paymentMethod}`,
    amount: w.amount,
    currency: w.currency,
    paymentMethod: w.paymentMethod, // Assuming payment details like wallet address are stored here
    createdAt: w.createdAt.toISOString(),
    user: w.userId
      ? {
          id: w.userId._id.toString(),
          name: w.userId.name,
          email: w.userId.email,
          username: w.userId.username,
        }
      : undefined,
  }))

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Pending Withdrawals
        </h1>
        <p className="mt-1 text-muted-foreground">
          Review user withdrawal requests and confirm payouts.
        </p>
      </div>

      <WithdrawalsClient initialWithdrawals={serializedWithdrawals} />
    </div>
  )
}

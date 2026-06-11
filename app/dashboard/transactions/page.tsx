import { auth } from "@/auth"
import connectToDatabase from "@/lib/db"
import { Transaction } from "@/lib/models"
import TransactionsClient from "./transactions-client"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function TransactionsPage() {
  const session = await auth()
  if (!session || !session.user) {
    redirect("/login")
  }

  await connectToDatabase()

  const [transactions, totalRecords, summaryTxs] = await Promise.all([
    Transaction.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean(),
    Transaction.countDocuments({ userId: session.user.id }),
    Transaction.find({ userId: session.user.id }).lean(),
  ])

  const serializedTransactions = transactions.map((tx: any) => ({
    id: tx._id.toString(),
    type: tx.type,
    amount: tx.amount,
    currency: "USD",
    status: tx.status,
    description: tx.description,
    asset: tx.asset,
    createdAt: tx.createdAt.toISOString(),
  }))

  const summary = {
    totalDeposited: summaryTxs
      .filter((t: any) => t.type === "deposit" && t.status === "completed")
      .reduce((s, t) => s + t.amount, 0),
    totalWithdrawn: summaryTxs
      .filter((t: any) => t.type === "withdrawal" && t.status === "completed")
      .reduce((s, t) => s + Math.abs(t.amount), 0),
    totalProfits: summaryTxs
      .filter((t: any) => t.type === "trade_profit")
      .reduce((s, t) => s + t.amount, 0),
    totalFees: summaryTxs
      .filter((t: any) => t.type === "fee")
      .reduce((s, t) => s + Math.abs(t.amount), 0),
  }

  const initialData = {
    data: serializedTransactions,
    totalPages: Math.ceil(totalRecords / 10),
    currentPage: 1,
    totalRecords,
    summary,
  }

  return <TransactionsClient initialData={initialData} />
}

import { auth } from "@/auth"
import connectToDatabase from "@/lib/db"
import { User, CopyPosition, Transaction, Trader } from "@/lib/models"
import DashboardClient from "./page-client"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const session = await auth()
  if (!session || !session.user) {
    redirect("/login")
  }

  await connectToDatabase()

  const userDoc = await User.findById(session.user.id).lean()
  if (!userDoc) {
    redirect("/login")
  }

  // Ensure Trader model is registered for populate
  Trader.init()

  const transactions = await Transaction.find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean()

  const copyPositions = await CopyPosition.find({ userId: session.user.id })
    .populate("traderId")
    .sort({ createdAt: -1 })
    .lean()

  const topTraders = await Trader.find({
    status: "live",
    "metrics.minInvestment": { $gte: 2000 },
  })
    .sort({ "metrics.winRate": -1 })
    .limit(3)
    .lean()

  // Calculate stats based on real DB data
  const userStats = {
    equity:
      (userDoc.balances.available || 0) + (userDoc.balances.invested || 0),
    available: userDoc.balances.available || 0,
    invested: userDoc.balances.invested || 0,
    totalProfit: userDoc.balances.totalProfit || 0,
    freeMargin: userDoc.balances.available || 0,
    openPositions: copyPositions.filter((p: any) => p.status === "active")
      .length,
  }

  // Serialize MongoDB ObjectId and Date to string for client component props
  const serializedPositions = copyPositions.map((pos: any) => ({
    id: pos._id.toString(),
    userId: session.user!.id as string,
    traderId: pos.traderId ? pos.traderId._id.toString() : "",
    investedAmount: pos.investedAmount,
    currentProfit: pos.currentProfit,
    status: pos.status,
    createdAt: pos.createdAt.toISOString(),
    trader: pos.traderId
      ? {
          id: pos.traderId._id.toString(),
          name: pos.traderId.name,
          avatar: pos.traderId.avatar,
          role: pos.traderId.role || "TRADER",
          metrics: pos.traderId.metrics || {
            winRate: 0,
            monthlyReturn: 0,
            minInvestment: 0,
            profitShareFee: 0,
          },
          status: pos.traderId.status || "live",
          copiers: pos.traderId.copiers || 0,
        }
      : undefined,
  }))

  const serializedTransactions = transactions.map((tx: any) => ({
    id: tx._id.toString(),
    type: tx.type,
    amount: tx.amount,
    status: tx.status,
    description: tx.description,
    asset: tx.asset,
    createdAt: tx.createdAt.toISOString(),
  }))

  const serializedTraders = topTraders.map((t: any) => ({
    id: t._id.toString(),
    name: t.name,
    avatar: t.avatar,
    role: t.role,
    metrics: t.metrics,
    status: t.status,
    copiers: t.copiers || 0,
  }))

  return (
    <DashboardClient
      userStats={userStats}
      copyPositions={serializedPositions}
      recentTransactions={serializedTransactions}
      topTraders={serializedTraders}
    />
  )
}

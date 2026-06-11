import { auth } from "@/auth"
import connectToDatabase from "@/lib/db"
import { Trader, CopyPosition } from "@/lib/models"
import CopytradingClient from "./copytrading-client"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function CopytradingPage() {
  const session = await auth()
  if (!session || !session.user) {
    redirect("/login")
  }

  await connectToDatabase()

  const topTradersDoc = await Trader.find({
    status: "live",
    "metrics.minInvestment": { $gte: 2000 },
  })
    .sort({ "metrics.winRate": -1 })
    .limit(3)
    .lean()

  const serializedTopTraders = topTradersDoc.map((t: any) => ({
    id: t._id.toString(),
    name: t.name,
    avatar: t.avatar,
    role: t.role,
    metrics: t.metrics,
    status: t.status,
    copiers: t.copiers || 0,
  }))

  const [historyDoc, totalRecords] = await Promise.all([
    CopyPosition.find({ userId: session.user.id })
      .populate("traderId", "name")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean(),
    CopyPosition.countDocuments({ userId: session.user.id }),
  ])

  const serializedHistory = historyDoc.map((pos: any) => ({
    id: pos._id.toString(),
    _id: pos._id.toString(),
    traderName: pos.traderId?.name || "Unknown Trader",
    investedAmount: pos.investedAmount,
    currentProfit: pos.currentProfit,
    status: pos.status,
    createdAt: pos.createdAt.toISOString(),
    updatedAt: pos.updatedAt.toISOString(),
  }))

  const initialHistoryData = {
    data: serializedHistory,
    totalPages: Math.ceil(totalRecords / 10),
    currentPage: 1,
    totalRecords,
  }

  return (
    <CopytradingClient
      topTraders={serializedTopTraders}
      initialHistoryData={initialHistoryData}
    />
  )
}

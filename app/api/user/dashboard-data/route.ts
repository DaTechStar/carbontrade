import { NextResponse } from "next/server"
import { auth } from "@/auth"
import connectToDatabase from "@/lib/db"
import { User, CopyPosition, Transaction, Trader } from "@/lib/models"

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const userDoc = await User.findById(session.user.id).lean()
    if (!userDoc) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

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

    const userStats = {
      equity:
        (userDoc.balances.available || 0) + (userDoc.balances.invested || 0),
      available: userDoc.balances.available || 0,
      invested: userDoc.balances.invested || 0,
      totalProfit: userDoc.balances.totalProfit || 0,
      freeMargin: userDoc.balances.available || 0,
      openPositions: copyPositions.filter((p) => p.status === "active").length,
    }

    const serializedPositions = copyPositions.map((pos) => {
      const trader = pos.traderId as any
      return {
        id: pos._id.toString(),
        userId: session.user!.id,
        traderId: trader ? trader._id.toString() : "",
        investedAmount: pos.investedAmount,
        currentProfit: pos.currentProfit,
        status: pos.status,
        createdAt: pos.createdAt.toISOString(),
        trader: trader
          ? {
              id: trader._id.toString(),
              name: trader.name,
              avatar: trader.avatar,
              role: trader.role || "TRADER",
              metrics: trader.metrics || {
                winRate: 0,
                monthlyReturn: 0,
                minInvestment: 0,
                profitShareFee: 0,
              },
              status: trader.status || "live",
              copiers: trader.copiers || 0,
            }
          : undefined,
      }
    })

    const serializedTransactions = transactions.map((tx) => ({
      id: tx._id.toString(),
      type: tx.type,
      amount: tx.amount,
      status: tx.status,
      description: tx.description,
      asset: tx.asset,
      createdAt: tx.createdAt.toISOString(),
    }))

    const serializedTraders = topTraders.map((t) => ({
      id: t._id.toString(),
      name: t.name,
      avatar: t.avatar,
      role: t.role,
      metrics: t.metrics,
      status: t.status,
      copiers: t.copiers || 0,
    }))

    return NextResponse.json({
      userStats,
      copyPositions: serializedPositions,
      recentTransactions: serializedTransactions,
      topTraders: serializedTraders,
    })
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

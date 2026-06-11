import { NextResponse } from "next/server"
import { auth } from "@/auth"
import connectToDatabase from "@/lib/db"
import { CopyPosition, Trader } from "@/lib/models"

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()
    Trader.init()

    const url = new URL(req.url)
    const page = parseInt(url.searchParams.get("page") || "1")
    const limit = parseInt(url.searchParams.get("limit") || "10")

    const query: Record<string, unknown> = { userId: session.user.id }

    const skip = (page - 1) * limit

    const [copyPositions, totalRecords] = await Promise.all([
      CopyPosition.find(query)
        .populate("traderId")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      CopyPosition.countDocuments(query),
    ])

    const totalPages = Math.ceil(totalRecords / limit)

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
        traderName: trader ? trader.name : "Unknown Trader",
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

    return NextResponse.json({
      data: serializedPositions,
      totalPages,
      currentPage: page,
      totalRecords,
    })
  } catch (error) {
    console.error("Error fetching copy history:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

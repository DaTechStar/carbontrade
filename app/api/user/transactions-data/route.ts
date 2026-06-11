import { NextResponse } from "next/server"
import { auth } from "@/auth"
import connectToDatabase from "@/lib/db"
import { Transaction } from "@/lib/models"

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const url = new URL(req.url)
    const page = parseInt(url.searchParams.get("page") || "1")
    const limit = parseInt(url.searchParams.get("limit") || "10")
    const search = url.searchParams.get("search") || ""
    const typeFilter = url.searchParams.get("type") || "all"
    const statusFilter = url.searchParams.get("status") || "all"

    const query: Record<string, unknown> = { userId: session.user.id }

    if (typeFilter !== "all") query.type = typeFilter
    if (statusFilter !== "all") query.status = statusFilter
    if (search) {
      const searchNum = Number(search)
      if (!isNaN(searchNum)) {
        query.amount = searchNum
      } else {
        query.$or = [
          { description: { $regex: search, $options: "i" } },
          { asset: { $regex: search, $options: "i" } },
        ]
      }
    }

    const skip = (page - 1) * limit

    const [transactions, totalRecords] = await Promise.all([
      Transaction.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Transaction.countDocuments(query),
    ])

    const totalPages = Math.ceil(totalRecords / limit)

    const serializedTransactions = transactions.map((tx) => ({
      id: tx._id.toString(),
      type: tx.type,
      amount: tx.amount,
      currency: "USD",
      status: tx.status,
      description: tx.description,
      asset: tx.asset,
      timestamp: tx.createdAt.toISOString(),
    }))

    // Calculate Summary Stats
    const summaryTxs = await Transaction.find({
      userId: session.user.id,
    }).lean()
    const summary = {
      totalDeposited: summaryTxs
        .filter((t) => t.type === "deposit" && t.status === "completed")
        .reduce((s, t) => s + t.amount, 0),
      totalWithdrawn: summaryTxs
        .filter((t) => t.type === "withdrawal" && t.status === "completed")
        .reduce((s, t) => s + Math.abs(t.amount), 0),
      totalProfits: summaryTxs
        .filter((t) => t.type === "trade_profit")
        .reduce((s, t) => s + t.amount, 0),
      totalFees: summaryTxs
        .filter((t) => t.type === "fee")
        .reduce((s, t) => s + Math.abs(t.amount), 0),
    }

    return NextResponse.json({
      data: serializedTransactions,
      totalPages,
      currentPage: page,
      totalRecords,
      summary,
    })
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

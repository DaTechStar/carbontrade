import { auth } from "@/auth"
import connectToDatabase from "@/lib/db"
import { Transaction } from "@/lib/models"
import TransactionsClient from "./transactions-client"
import { redirect } from "next/navigation"
import mongoose from "mongoose"

export const dynamic = "force-dynamic"

export default async function TransactionsPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams
  const session = await auth()
  if (!session || !session.user) {
    redirect("/login")
  }

  await connectToDatabase()

  // Parse search params
  const pageParam =
    typeof searchParams.page === "string" ? parseInt(searchParams.page, 10) : 1
  const page = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam
  const q = typeof searchParams.q === "string" ? searchParams.q : ""
  const type = typeof searchParams.type === "string" ? searchParams.type : "all"
  const status =
    typeof searchParams.status === "string" ? searchParams.status : "all"

  const limit = 10

  // Build MongoDB query
  const query: any = { userId: session.user.id }

  if (q) {
    // Search in description (case-insensitive regex)
    query.description = { $regex: q, $options: "i" }
  }
  if (type !== "all") {
    query.type = type
  }
  if (status !== "all") {
    query.status = status
  }

  // Fetch paginated transactions & count
  const [transactions, totalRecords] = await Promise.all([
    Transaction.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Transaction.countDocuments(query),
  ])

  // MongoDB Aggregation for Summary Stats
  // Uses 0% of Node.js memory, calculated directly in the database
  const userObjectId = new mongoose.Types.ObjectId(session.user.id)

  const summaryAgg = await Transaction.aggregate([
    { $match: { userId: userObjectId } },
    {
      $group: {
        _id: null,
        totalDeposited: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ["$type", "deposit"] },
                  { $eq: ["$status", "completed"] },
                ],
              },
              "$amount",
              0,
            ],
          },
        },
        totalWithdrawn: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ["$type", "withdrawal"] },
                  { $eq: ["$status", "completed"] },
                ],
              },
              { $abs: "$amount" },
              0,
            ],
          },
        },
        totalProfits: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ["$type", "trade_profit"] },
                  { $eq: ["$status", "completed"] },
                ],
              },
              "$amount",
              0,
            ],
          },
        },
        totalFees: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ["$type", "fee"] },
                  { $eq: ["$status", "completed"] },
                ],
              },
              { $abs: "$amount" },
              0,
            ],
          },
        },
      },
    },
  ])

  const aggData = summaryAgg[0] || {
    totalDeposited: 0,
    totalWithdrawn: 0,
    totalProfits: 0,
    totalFees: 0,
  }

  const summary = {
    totalDeposited: aggData.totalDeposited,
    totalWithdrawn: aggData.totalWithdrawn,
    totalProfits: aggData.totalProfits,
    totalFees: aggData.totalFees,
  }

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

  const initialData = {
    data: serializedTransactions,
    totalPages: Math.ceil(totalRecords / limit) || 1,
    currentPage: page,
    totalRecords,
    summary,
    filters: { q, type, status },
  }

  return <TransactionsClient initialData={initialData} />
}

import { NextResponse } from "next/server"
import { auth } from "@/auth"
import connectToDatabase from "@/lib/db"
import { User, Transaction } from "@/lib/models"

export async function GET() {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const currentUser = await User.findById(session.user.id).lean()
    if (!currentUser || !currentUser.username) {
      return NextResponse.json({
        referrals: [],
        totalReferralDeposits: 0,
        activeCount: 0,
        pendingCount: 0,
      })
    }

    const username = currentUser.username

    // Find all users who were referred by this user
    const referredUsers = await User.find({ referredBy: username })
      .select("_id name email createdAt balances")
      .lean()

    if (!referredUsers.length) {
      return NextResponse.json({
        referrals: [],
        totalReferralDeposits: 0,
        activeCount: 0,
        pendingCount: 0,
      })
    }

    // Get the IDs of all referred users
    const referredUserIds = referredUsers.map((u) => u._id)

    // Aggregate total completed deposits for all referred users
    const depositAggregation = await Transaction.aggregate([
      {
        $match: {
          userId: { $in: referredUserIds },
          type: "deposit",
          status: "completed",
        },
      },
      {
        $group: {
          _id: "$userId",
          totalDeposits: { $sum: "$amount" },
        },
      },
    ])

    // Create a map for quick lookup
    const depositsMap = new Map()
    let totalReferralDeposits = 0

    depositAggregation.forEach((agg) => {
      depositsMap.set(agg._id.toString(), agg.totalDeposits)
      totalReferralDeposits += agg.totalDeposits
    })

    let activeCount = 0
    let pendingCount = 0

    // Format the referrals for the frontend
    const referrals = referredUsers.map((user) => {
      const deposits = depositsMap.get(user._id.toString()) || 0
      const status = deposits > 0 ? "active" : "pending"

      if (status === "active") activeCount++
      else pendingCount++

      return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        date: user.createdAt,
        status,
        deposits,
        // Calculate level logic if necessary, otherwise default to 1
        level: user.tierLevel || 1,
      }
    })

    return NextResponse.json(
      {
        referrals,
        totalReferralDeposits,
        activeCount,
        pendingCount,
        totalCount: referrals.length,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Referrals error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

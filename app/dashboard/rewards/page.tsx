import { auth } from "@/auth"
import { redirect } from "next/navigation"
import connectToDatabase from "@/lib/db"
import { User, Transaction } from "@/lib/models"
import RewardsClient from "./rewards-client"

const TIER_REQUIREMENTS = [
  {
    level: 7,
    minDeposit: 1_000_000,
    minReferrals: 12,
    minReferralDeposits: 2_550_000,
    bonus: 50_000,
    name: "Ambassador",
  },
  {
    level: 6,
    minDeposit: 250_000,
    minReferrals: 5,
    minReferralDeposits: 500_000,
    bonus: 10_000,
    name: "Diamond",
  },
  {
    level: 5,
    minDeposit: 100_000,
    minReferrals: 0,
    minReferralDeposits: 0,
    bonus: 3_000,
    name: "Gold Pro",
  },
  {
    level: 4,
    minDeposit: 50_000,
    minReferrals: 0,
    minReferralDeposits: 0,
    bonus: 2_000,
    name: "Gold",
  },
  {
    level: 3,
    minDeposit: 25_000,
    minReferrals: 0,
    minReferralDeposits: 0,
    bonus: 1_000,
    name: "Silver Pro",
  },
  {
    level: 2,
    minDeposit: 10_000,
    minReferrals: 0,
    minReferralDeposits: 0,
    bonus: 250,
    name: "Silver",
  },
  {
    level: 1,
    minDeposit: 0,
    minReferrals: 0,
    minReferralDeposits: 0,
    bonus: 0,
    name: "Welcome",
  },
]

export default async function RewardsPage() {
  const session = await auth()
  if (!session || !session.user) redirect("/login")

  await connectToDatabase()

  const user = await User.findById(session.user.id)
  if (!user) redirect("/login")

  const username = (user as any).username

  // 1. Calculate Current Deposit (All-time completed deposits)
  const userDeposits = await Transaction.aggregate([
    { $match: { userId: user._id, type: "deposit", status: "completed" } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ])
  const currentDeposit = userDeposits.length > 0 ? userDeposits[0].total : 0

  // 2. Calculate Current Referrals & Referral Deposits
  let currentReferrals = 0
  let currentReferralDeposits = 0

  if (username) {
    const referredUsers = await User.find({ referredBy: username })
      .select("_id")
      .lean()
    currentReferrals = referredUsers.length

    if (currentReferrals > 0) {
      const referredUserIds = referredUsers.map((u) => u._id)
      const refDeposits = await Transaction.aggregate([
        {
          $match: {
            userId: { $in: referredUserIds },
            type: "deposit",
            status: "completed",
          },
        },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ])
      currentReferralDeposits =
        refDeposits.length > 0 ? refDeposits[0].total : 0
    }
  }

  // 3. Determine Highest Qualifying Tier
  let highestQualifyingLevel = 1
  let bonusToAward = 0

  for (const tier of TIER_REQUIREMENTS) {
    if (
      currentDeposit >= tier.minDeposit &&
      currentReferrals >= tier.minReferrals &&
      currentReferralDeposits >= tier.minReferralDeposits
    ) {
      highestQualifyingLevel = tier.level
      break
    }
  }

  // 4. Upgrade user if they reached a new tier
  if (highestQualifyingLevel > user.tierLevel) {
    // Find the tier object to get the bonus
    const newTier = TIER_REQUIREMENTS.find(
      (t) => t.level === highestQualifyingLevel
    )

    if (newTier && newTier.bonus > 0) {
      // Award the bonus
      user.balances.available += newTier.bonus

      // Record the transaction
      await Transaction.create({
        userId: user._id,
        type: "trade_profit", // Using trade_profit as a generic positive credit, or we could add 'bonus' if schema allows
        amount: newTier.bonus,
        status: "completed",
        description: `${newTier.name} Tier Unlock Bonus`,
      })
    }

    user.tierLevel = highestQualifyingLevel
    await user.save()
  }

  return (
    <RewardsClient
      currentLevel={user.tierLevel}
      currentDeposit={currentDeposit}
      currentReferrals={currentReferrals}
      currentReferralDeposits={currentReferralDeposits}
    />
  )
}

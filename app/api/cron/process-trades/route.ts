import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/db"
import { User, Trader, CopyPosition, Transaction } from "@/lib/models"

// Helper function to generate a normally distributed random number (Box-Muller)
function generateGaussian(mean: number, stdDev: number) {
  const u1 = Math.max(Math.random(), Number.EPSILON) // Prevent log(0)
  const u2 = Math.random()
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2)
  return z0 * stdDev + mean
}

export async function GET(req: Request) {
  try {
    // 1. Verify Cron Secret to prevent unauthorized execution
    const authHeader = req.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: "Unauthorized cron execution" },
        { status: 401 }
      )
    }

    await connectToDatabase()

    // 2. Fetch all active copy positions
    const activePositions = await CopyPosition.find({ status: "active" })
      .populate("traderId")
      .populate("userId")

    let processedCount = 0

    for (const position of activePositions) {
      const trader = position.traderId as any // Cast for TS
      const user = position.userId as any

      if (!trader || !user || trader.status !== "live") continue

      // 3. The Math Engine
      const profile = trader.simulationProfile || {
        dailyExpectedReturnPct: 0.1,
        volatility: "medium",
        trend: "neutral",
      }
      const expectedDailyReturn = profile.dailyExpectedReturnPct

      // Dynamic Volatility Scaling
      let stdDev = 1.5 // Medium volatility
      if (profile.volatility === "low") stdDev = 0.5
      if (profile.volatility === "high") stdDev = 4.0

      // Win Rate Skew
      const winRate = trader.metrics?.winRate ?? trader.winRate ?? 50
      const isWinningDay = Math.random() < winRate / 100

      // Generate the absolute magnitude of the move using Gaussian distribution
      const moveMagnitude = Math.abs(
        generateGaussian(expectedDailyReturn, stdDev)
      )

      // Force the sign based on the win rate outcome
      let actualDailyReturnPct = isWinningDay ? moveMagnitude : -moveMagnitude

      // Apply market trend bias
      if (profile.trend === "bullish") actualDailyReturnPct += 0.2
      if (profile.trend === "bearish") actualDailyReturnPct -= 0.2

      // Calculate the dollar amount change
      const pnlAmount = (position.investedAmount * actualDailyReturnPct) / 100

      // Skip micro-fluctuations to avoid cluttering transaction history
      if (Math.abs(pnlAmount) < 0.05) continue

      const isProfit = pnlAmount > 0

      // 4. Create Main Transaction Record
      await Transaction.create({
        userId: user._id,
        type: isProfit ? "trade_profit" : "trade_loss",
        amount: Math.abs(pnlAmount),
        status: "completed",
        description: `${isProfit ? "Profit" : "Loss"} from copying ${trader.name}`,
        asset: "USD",
      })

      // 5. Apply Updates and Fees
      position.currentProfit += pnlAmount

      if (isProfit) {
        // Performance Fee Deduction
        const feePercent = trader.fee || 0
        const feeAmount = (pnlAmount * feePercent) / 100
        const netProfit = pnlAmount - feeAmount

        user.balances.available += netProfit // Net profit goes to available cash
        user.balances.totalProfit += netProfit

        // Log the fee transaction if applicable
        if (feeAmount > 0) {
          await Transaction.create({
            userId: user._id,
            type: "fee",
            amount: feeAmount,
            status: "completed",
            description: `Performance Fee (${feePercent}%) to ${trader.name}`,
            asset: "USD",
          })
        }
      } else {
        // Loss handling and Liquidation
        const lossAmount = Math.abs(pnlAmount)

        // Infer the original investment amount before this loss
        const originalInvestment =
          position.investedAmount -
          Math.min(0, position.currentProfit - pnlAmount)

        position.investedAmount -= lossAmount
        user.balances.invested -= lossAmount
        user.balances.totalProfit -= lossAmount

        // Liquidation Threshold: Drop below 10% of original investment
        if (position.investedAmount <= originalInvestment * 0.1) {
          // Liquidate: Move any remaining crumbs back to available balance
          if (position.investedAmount > 0) {
            user.balances.available += position.investedAmount
            user.balances.invested -= position.investedAmount
            position.investedAmount = 0
          }
          position.status = "closed"
        }
      }

      await position.save()
      await user.save()

      processedCount++
    }

    return NextResponse.json(
      {
        message: "Cron job executed successfully",
        processedPositions: processedCount,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Cron job error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

import { NextResponse } from "next/server"
import { auth } from "@/auth"
import connectToDatabase from "@/lib/db"
import { User, Trader, CopyPosition } from "@/lib/models"
import { Resend } from "resend"
import { render } from "@react-email/render"
import TradeExecutedEmail from "@/emails/trade-executed"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { traderId, amount } = await req.json()

    if (!traderId || !amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      )
    }

    await connectToDatabase()

    const user = await User.findById(session.user.id)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const trader = await Trader.findById(traderId)
    if (!trader) {
      return NextResponse.json({ error: "Trader not found" }, { status: 404 })
    }

    if (trader.status !== "live") {
      return NextResponse.json(
        { error: "Trader is no longer available for copying" },
        { status: 400 }
      )
    }

    if (amount < trader.metrics.minInvestment) {
      return NextResponse.json(
        {
          error: `Minimum investment for this trader is $${trader.metrics.minInvestment}`,
        },
        { status: 400 }
      )
    }

    if (user.balances.available < amount) {
      return NextResponse.json(
        { error: "Insufficient available balance" },
        { status: 402 } // Payment Required / Insufficient Funds
      )
    }

    // Process the copy transaction
    user.balances.available -= amount
    user.balances.invested += amount
    await user.save()

    // Check if user is already copying this trader
    let position = await CopyPosition.findOne({
      userId: user._id,
      traderId: trader._id,
      status: "active",
    })

    if (position) {
      // Add funds to existing active position
      position.investedAmount += amount
      await position.save()
    } else {
      // Create a brand new position
      position = await CopyPosition.create({
        userId: user._id,
        traderId: trader._id,
        investedAmount: amount,
        currentProfit: 0,
        status: "active",
      })
    }

    // --- Email Notification Logic ---
    const sendTradeAlerts =
      (user as any).notificationPreferences?.tradeExecution ?? true

    if (sendTradeAlerts && process.env.RESEND_API_KEY) {
      try {
        const emailHtml = await render(
          TradeExecutedEmail({
            name: user.name || "User",
            traderName: trader.name,
            asset: "USD",
            action: "Opened",
            amount: `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          })
        )

        const fromEmail =
          process.env.RESEND_FROM_EMAIL ||
          "CarbonTrade <noreply@carbontrade.com>"

        // We don't await this to avoid blocking the HTTP response
        resend.emails
          .send({
            from: fromEmail,
            to: user.email,
            subject: `Trade Opened: Copied ${trader.name}`,
            html: emailHtml,
          })
          .catch((err) => console.error("Resend non-fatal error:", err))
      } catch (emailErr) {
        console.error("Failed to render/send trade email:", emailErr)
      }
    }

    return NextResponse.json(
      { message: "Successfully copied trader", position },
      { status: 201 }
    )
  } catch (error) {
    console.error("Copy trade error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

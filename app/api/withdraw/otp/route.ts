import { NextResponse } from "next/server"
import { auth } from "@/auth"
import connectToDatabase from "@/lib/db"
import { User, Otp } from "@/lib/models"
import { Resend } from "resend"
import { render } from "@react-email/render"
import WithdrawalOtpEmail from "@/emails/withdrawal-otp"
import { OTP_EXPIRY_MINUTES } from "@/lib/constants"
import crypto from "crypto"

// Initialize Resend with the API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { amount, method } = body

    if (!amount || amount < 10) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    await connectToDatabase()

    const user = await User.findById(session.user.id)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (user.kycStatus !== "verified") {
      return NextResponse.json(
        { error: "KYC verification required to withdraw" },
        { status: 403 }
      )
    }

    if (user.balances.available < amount) {
      return NextResponse.json(
        { error: "Insufficient available balance" },
        { status: 400 }
      )
    }

    // Generate a 6-digit OTP
    const otpCode = crypto.randomInt(100000, 999999).toString()

    // Upsert OTP for this user
    await Otp.findOneAndUpdate(
      { userId: user._id, purpose: "withdrawal" },
      {
        code: otpCode,
        expiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
      },
      { upsert: true, returnDocument: "after" }
    )

    // Ensure we don't crash if RESEND_API_KEY is missing during development
    if (!process.env.RESEND_API_KEY) {
      console.warn("RESEND_API_KEY is not set. OTP code generated:", otpCode)
      // In production you might want to return an error if it's missing
    } else {
      // Send the email
      const emailHtml = await render(
        WithdrawalOtpEmail({
          name: user.name || "User",
          amount: amount.toString(),
          asset: method,
          otpCode,
        })
      )

      const fromEmail =
        process.env.RESEND_FROM_EMAIL || "CarbonTrade <noreply@carbontrade.com>"

      await resend.emails.send({
        from: fromEmail,
        to: user.email,
        subject: "Your Withdrawal Verification Code",
        html: emailHtml,
      })
    }

    return NextResponse.json({
      success: true,
      message: "OTP sent to your email",
    })
  } catch (error: any) {
    console.error("Error in OTP generation:", error)
    return NextResponse.json(
      { error: "Failed to process OTP request" },
      { status: 500 }
    )
  }
}

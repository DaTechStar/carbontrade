import { NextResponse } from "next/server"
import { auth } from "@/auth"
import connectToDatabase from "@/lib/db"
import { User, Otp, Transaction } from "@/lib/models"
import { MAX_WITHDRAWAL_AMOUNT } from "@/lib/constants"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { amount, method, walletAddress, network, otp } = body

    if (!amount || amount < 10 || amount > MAX_WITHDRAWAL_AMOUNT) {
      return NextResponse.json(
        { error: "Invalid withdrawal amount" },
        { status: 400 }
      )
    }

    if (!walletAddress || walletAddress.length < 10) {
      return NextResponse.json(
        { error: "Invalid wallet address" },
        { status: 400 }
      )
    }

    if (!otp || otp.length < 6) {
      return NextResponse.json({ error: "Invalid OTP code" }, { status: 400 })
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

    // Verify OTP
    const otpRecord = await Otp.findOne({
      userId: user._id,
      purpose: "withdrawal",
    })

    if (!otpRecord) {
      return NextResponse.json(
        { error: "No OTP request found. Please request a new code." },
        { status: 400 }
      )
    }

    if (otpRecord.code !== otp) {
      return NextResponse.json(
        { error: "Incorrect OTP code." },
        { status: 400 }
      )
    }

    if (new Date() > otpRecord.expiresAt) {
      // OTP expired
      await Otp.deleteOne({ _id: otpRecord._id })
      return NextResponse.json(
        { error: "OTP has expired. Please request a new code." },
        { status: 400 }
      )
    }

    // Verify balance
    if (user.balances.available < amount) {
      return NextResponse.json(
        { error: "Insufficient available balance" },
        { status: 400 }
      )
    }

    // Deduct balance and create pending transaction
    user.balances.available -= amount
    await user.save()

    const description = `Withdrawal via ${method} ${network ? `(${network})` : ""}`

    await Transaction.create({
      userId: user._id,
      type: "withdrawal",
      amount: amount,
      status: "pending",
      asset: method,
      description: description,
      paymentMethod: walletAddress,
    })

    // Clear the OTP
    await Otp.deleteOne({ _id: otpRecord._id })

    return NextResponse.json({
      success: true,
      message: "Withdrawal request submitted successfully",
    })
  } catch (error: any) {
    console.error("Error in withdrawal submission:", error)
    return NextResponse.json(
      { error: "Failed to process withdrawal" },
      { status: 500 }
    )
  }
}

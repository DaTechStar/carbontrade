import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/db"
import { User } from "@/lib/models"
import bcrypt from "bcryptjs"
import { Resend } from "resend"
import { render } from "@react-email/render"
import WelcomeEmail from "@/emails/welcome"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const { name, email, password, country, referredBy } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    await connectToDatabase()

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists with this email" },
        { status: 409 }
      )
    }

    const passwordHash = await bcrypt.hash(password, 10)

    let validReferredBy = undefined
    if (referredBy) {
      // Find user by username
      const referrer = await User.findOne({
        username: { $regex: new RegExp(`^${referredBy}$`, "i") },
      }).lean()
      if (referrer) {
        validReferredBy = (referrer as any).username
      }
    }

    const newUser = await User.create({
      name,
      email,
      username: name.toLowerCase(),
      passwordHash,
      country: country || "United States",
      referredBy: validReferredBy,
      balances: {
        available: 0,
        invested: 0,
        totalProfit: 0,
      },
    })

    if (process.env.RESEND_API_KEY) {
      try {
        const emailHtml = await render(WelcomeEmail({ name: newUser.name }))
        const fromEmail =
          process.env.RESEND_FROM_EMAIL ||
          "CarbonTrade <noreply@carbontrade.com>"

        // Send email asynchronously
        resend.emails
          .send({
            from: fromEmail,
            to: newUser.email,
            subject: "Welcome to CarbonTrade!",
            html: emailHtml,
          })
          .catch((err) => console.error("Resend non-fatal error:", err))
      } catch (emailErr) {
        console.error("Failed to render/send welcome email:", emailErr)
      }
    }

    return NextResponse.json(
      { message: "User registered successfully", userId: newUser._id },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

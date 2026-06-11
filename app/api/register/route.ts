import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/db"
import { User } from "@/lib/models"
import bcrypt from "bcryptjs"

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

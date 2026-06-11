import { NextResponse } from "next/server"
import { auth } from "@/auth"
import connectToDatabase from "@/lib/db"
import { User } from "@/lib/models"

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const username = searchParams.get("username")

    if (!username || username.trim() === "") {
      return NextResponse.json(
        { available: false, error: "Username is required" },
        { status: 400 }
      )
    }

    const normalizedUsername = username.trim().toLowerCase()

    // Basic validation
    if (normalizedUsername.length < 3 || normalizedUsername.length > 20) {
      return NextResponse.json(
        {
          available: false,
          error: "Username must be between 3 and 20 characters",
        },
        { status: 400 }
      )
    }

    if (!/^[a-z0-9_]+$/.test(normalizedUsername)) {
      return NextResponse.json(
        {
          available: false,
          error:
            "Username can only contain alphanumeric characters and underscores",
        },
        { status: 400 }
      )
    }

    await connectToDatabase()

    // Check if another user has this username
    const existingUser = await User.findOne({
      username: { $regex: new RegExp(`^${normalizedUsername}$`, "i") },
      _id: { $ne: session.user.id },
    }).lean()

    if (existingUser) {
      // Generate suggestions
      const suggestions = [
        `${normalizedUsername}${Math.floor(Math.random() * 100)}`,
        `${normalizedUsername}_${Math.floor(Math.random() * 100)}`,
        `${normalizedUsername}${Math.floor(Math.random() * 1000)}`,
      ]
      return NextResponse.json(
        { available: false, suggestions },
        { status: 200 }
      )
    }

    return NextResponse.json({ available: true }, { status: 200 })
  } catch (error) {
    console.error("Check username error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

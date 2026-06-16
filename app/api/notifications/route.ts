import { NextResponse } from "next/server"
import { auth } from "@/auth"
import connectToDatabase from "@/lib/db"
import { Notification } from "@/lib/models"

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const notifications = await Notification.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .limit(50)

    return NextResponse.json(notifications)
  } catch (error) {
    console.error("Fetch notifications error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

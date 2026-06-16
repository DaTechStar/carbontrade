import { NextResponse } from "next/server"
import { auth } from "@/auth"
import connectToDatabase from "@/lib/db"
import { Notification } from "@/lib/models"

export async function PATCH(req: Request) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json().catch(() => ({}))
    const { notificationIds } = body

    await connectToDatabase()

    if (
      notificationIds &&
      Array.isArray(notificationIds) &&
      notificationIds.length > 0
    ) {
      // Mark specific notifications as read
      await Notification.updateMany(
        { _id: { $in: notificationIds }, userId: session.user.id },
        { $set: { isRead: true } }
      )
    } else {
      // Mark all as read
      await Notification.updateMany(
        { userId: session.user.id, isRead: false },
        { $set: { isRead: true } }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Mark notifications as read error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

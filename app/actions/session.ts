"use server"

import { auth } from "@/auth"
import connectToDatabase from "@/lib/db"
import { DeviceSession } from "@/lib/models"
import { revalidatePath } from "next/cache"

export async function revokeSession(sessionId: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    await connectToDatabase()

    const deviceSession = await DeviceSession.findOne({
      _id: sessionId,
      userId: session.user.id,
    })

    if (!deviceSession) {
      throw new Error("Session not found")
    }

    deviceSession.isActive = false
    await deviceSession.save()

    revalidatePath("/dashboard/settings")
    return { success: true }
  } catch (error: any) {
    console.error("[revokeSession]", error)
    return { error: error.message || "Failed to revoke session" }
  }
}

export async function revokeAllOtherSessions(currentSessionId: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    await connectToDatabase()

    await DeviceSession.updateMany(
      {
        userId: session.user.id,
        _id: { $ne: currentSessionId },
        isActive: true,
      },
      {
        $set: { isActive: false },
      }
    )

    revalidatePath("/dashboard/settings")
    return { success: true }
  } catch (error: any) {
    console.error("[revokeAllOtherSessions]", error)
    return { error: error.message || "Failed to revoke sessions" }
  }
}

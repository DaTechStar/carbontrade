"use server"

import { auth } from "@/auth"
import connectToDatabase from "@/lib/db"
import { User } from "@/lib/models"
import { revalidatePath } from "next/cache"

export async function toggleUserStatus(userId: string, currentStatus: boolean) {
  const session = await auth()
  if (
    !session ||
    !session.user ||
    ((session.user as any).role !== "ADMIN" &&
      (session.user as any).role !== "SUPERADMIN")
  ) {
    throw new Error("Unauthorized")
  }

  await connectToDatabase()
  await User.findByIdAndUpdate(userId, { isActive: !currentStatus })

  revalidatePath("/admin/users")
  return { success: true }
}

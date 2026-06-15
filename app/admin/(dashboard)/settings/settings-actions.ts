"use server"

import connectToDatabase from "@/lib/db"
import { PlatformSettings } from "@/lib/models"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"

export async function updatePaymentMethods(methods: any[]) {
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

  let settings = await PlatformSettings.findOne()
  if (!settings) {
    settings = new PlatformSettings({ paymentMethods: methods })
  } else {
    settings.paymentMethods = methods
  }

  await settings.save()

  // Revalidate to update server rendered deposit page
  revalidatePath("/dashboard/payments")
  revalidatePath("/admin/settings")

  return { success: true }
}

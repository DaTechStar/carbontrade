"use server"

import { auth } from "@/auth"
import connectToDatabase from "@/lib/db"
import { User } from "@/lib/models"
import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"
import { Resend } from "resend"
import { render } from "@react-email/render"
import PasswordChangedEmail from "@/emails/password-changed"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function toggleNotificationPreference(
  key: string,
  value: boolean
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error("Unauthorized")
    }

    await connectToDatabase()

    const validKeys = [
      "tradeExecution",
      "dailyPnL",
      "transactionUpdates",
      "tierUpdates",
      "marketing",
    ]

    if (!validKeys.includes(key)) {
      throw new Error("Invalid preference key")
    }

    await User.findByIdAndUpdate(session.user.id, {
      $set: { [`notificationPreferences.${key}`]: value },
    })

    // Revalidate the profile path if necessary
    revalidatePath("/dashboard/settings")

    return { success: true }
  } catch (error: any) {
    console.error("[toggleNotificationPreference]", error)
    return { error: error.message || "Failed to update preference" }
  }
}

export async function changePassword(
  currentPassword: string,
  newPassword: string
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error("Unauthorized")
    }

    if (!newPassword || newPassword.length < 8) {
      throw new Error("New password must be at least 8 characters long")
    }

    await connectToDatabase()

    const user = await User.findById(session.user.id)
    if (!user) {
      throw new Error("User not found")
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.passwordHash)
    if (!isValid) {
      throw new Error("Incorrect current password")
    }

    // Hash and update new password
    const salt = await bcrypt.genSalt(10)
    const newHash = await bcrypt.hash(newPassword, salt)

    user.passwordHash = newHash
    await user.save()

    // Send email notification
    if (process.env.RESEND_API_KEY) {
      const emailHtml = await render(
        PasswordChangedEmail({
          name: user.name || "User",
          date: new Date().toLocaleString(),
        })
      )

      const fromEmail =
        process.env.RESEND_FROM_EMAIL || "CarbonTrade <noreply@carbontrade.com>"

      await resend.emails.send({
        from: fromEmail,
        to: user.email,
        subject: "Security Alert: Password Changed",
        html: emailHtml,
      })
    } else {
      console.warn(
        "RESEND_API_KEY is not set. Password changed email not sent."
      )
    }

    return { success: true }
  } catch (error: any) {
    console.error("[changePassword]", error)
    return { error: error.message || "Failed to change password" }
  }
}

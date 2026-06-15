"use server"

import { auth } from "@/auth"
import connectToDatabase from "@/lib/db"
import { User } from "@/lib/models"
import { revalidatePath } from "next/cache"
import cloudinary from "@/lib/cloudinary"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const uploadToCloudinary = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "carbontrade/kyc" }, (error, result) => {
        if (error || !result) reject(error)
        else resolve(result.secure_url)
      })
      .end(buffer)
  })
}

export async function submitKycDocument(formData: FormData) {
  try {
    const session = await auth()
    if (!session || !session.user || !session.user.id) {
      throw new Error("Unauthorized")
    }

    const fileFront = formData.get("documentFront") as File
    const fileBack = formData.get("documentBack") as File

    if (!fileFront || !fileBack) {
      throw new Error("Both front and back documents are required")
    }

    if (fileFront.size > 5 * 1024 * 1024 || fileBack.size > 5 * 1024 * 1024) {
      throw new Error("File sizes must be less than 5MB")
    }

    // Upload concurrently
    const [secureUrlFront, secureUrlBack] = await Promise.all([
      uploadToCloudinary(fileFront),
      uploadToCloudinary(fileBack),
    ])

    await connectToDatabase()

    const user = await User.findById(session.user.id)
    if (!user) {
      throw new Error("User not found")
    }

    user.kycStatus = "pending"
    user.kycDocumentUrlFront = secureUrlFront
    user.kycDocumentUrlBack = secureUrlBack
    await user.save()

    revalidatePath("/dashboard/settings")
    return { success: true }
  } catch (error: any) {
    console.error("[submitKycDocument]", error)
    return { error: error.message || "Failed to submit KYC document" }
  }
}

export async function updateKycStatus(
  userId: string,
  action: "approve" | "reject"
) {
  try {
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

    const user = await User.findById(userId)
    if (!user) {
      throw new Error("User not found")
    }

    if (user.kycStatus !== "pending") {
      throw new Error("User KYC is not in pending state")
    }

    user.kycStatus = action === "approve" ? "verified" : "rejected"
    if (action === "reject") {
      // Clear the invalid documents so they can re-upload
      user.kycDocumentUrlFront = ""
      user.kycDocumentUrlBack = ""
    }

    await user.save()

    // Optionally send an email here using Resend
    if (process.env.RESEND_API_KEY) {
      const fromEmail =
        process.env.RESEND_FROM_EMAIL || "CarbonTrade <noreply@carbontrade.com>"
      const statusText = action === "approve" ? "Approved" : "Rejected"
      const message =
        action === "approve"
          ? "Congratulations! Your identity verification has been approved. You now have full access to all features."
          : "Unfortunately, your identity document was rejected. Please log in and upload a clear, valid ID."

      resend.emails
        .send({
          from: fromEmail,
          to: user.email,
          subject: `KYC Verification ${statusText}`,
          html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>Identity Verification ${statusText}</h2>
            <p>Hello ${user.name},</p>
            <p>${message}</p>
            <p>Best,<br/>The CarbonTrade Team</p>
          </div>
        `,
        })
        .catch((err) => console.error("Resend error:", err))
    }

    revalidatePath("/admin/users/kyc")
    return { success: true }
  } catch (error: any) {
    console.error("[updateKycStatus]", error)
    return { error: error.message || "Failed to update KYC status" }
  }
}

import { auth } from "@/auth"
import connectToDatabase from "@/lib/db"
import { User } from "@/lib/models"
import { redirect } from "next/navigation"
import KycClient from "./kyc-client"

export const dynamic = "force-dynamic"

export default async function AdminKycPage() {
  const session = await auth()
  if (
    !session ||
    !session.user ||
    ((session.user as any).role !== "ADMIN" &&
      (session.user as any).role !== "SUPERADMIN")
  ) {
    redirect("/login")
  }

  await connectToDatabase()

  // Fetch all pending KYC users
  const pendingUsers = await User.find({ kycStatus: "pending" })
    .sort({ updatedAt: -1 })
    .lean()

  const serializedUsers = pendingUsers.map((user) => ({
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    country: user.country,
    kycDocumentUrlFront: (user as any).kycDocumentUrlFront || "",
    kycDocumentUrlBack: (user as any).kycDocumentUrlBack || "",
    submittedAt: user.updatedAt.toISOString(),
  }))

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-black">KYC Reviews</h1>
        <p className="text-sm text-muted-foreground">
          Review and approve user identity documents.
        </p>
      </div>
      <KycClient initialPendingUsers={serializedUsers} />
    </div>
  )
}

import { auth } from "@/auth"
import connectToDatabase from "@/lib/db"
import { User, DeviceSession } from "@/lib/models"
import SettingsClient from "./settings-client"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

type Tab = "profile" | "referrals" | "password" | "security" | "kyc"
const VALID_TABS: Tab[] = [
  "profile",
  "referrals",
  "password",
  "security",
  "kyc",
]

type SearchParams = Promise<{ tab?: string }>

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const session = await auth()
  if (!session || !session.user) {
    redirect("/login")
  }

  const { tab } = await searchParams
  const activeTab: Tab = VALID_TABS.includes(tab as Tab)
    ? (tab as Tab)
    : "profile"

  await connectToDatabase()

  const user = await User.findById(session.user.id).lean()
  if (!user) {
    redirect("/login")
  }

  const serializedUser = {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    country: user.country,
    tierLevel: user.tierLevel,
    role: user.role,
    username: (user as any).username || "",
    image: (user as any).image || "",
    phoneNumber: (user as any).phoneNumber || "",
    dateOfBirth: (user as any).dateOfBirth || "",
    bio: (user as any).bio || "",
    notificationPreferences: (user as any).notificationPreferences || null,
    kycStatus: (user as any).kycStatus || "unverified",
    kycDocumentUrlFront: (user as any).kycDocumentUrlFront || null,
    kycDocumentUrlBack: (user as any).kycDocumentUrlBack || null,
  }

  const deviceSessions = await DeviceSession.find({
    userId: session.user.id,
    isActive: true,
  })
    .sort({ lastActiveAt: -1 })
    .lean()

  const serializedSessions = deviceSessions.map((s) => ({
    id: s._id.toString(),
    userAgent: s.userAgent,
    ipAddress: s.ipAddress,
    location: s.location || "Unknown Location",
    lastActiveAt: s.lastActiveAt ? s.lastActiveAt.toISOString() : "",
    current: s._id.toString() === (session.user as any).sessionId,
  }))

  return (
    <SettingsClient
      initialUser={serializedUser}
      initialSessions={serializedSessions}
      activeTab={activeTab}
    />
  )
}

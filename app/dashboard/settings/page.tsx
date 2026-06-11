import { auth } from "@/auth"
import connectToDatabase from "@/lib/db"
import { User } from "@/lib/models"
import SettingsClient from "./settings-client"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function SettingsPage() {
  const session = await auth()
  if (!session || !session.user) {
    redirect("/login")
  }

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
  }

  return <SettingsClient initialUser={serializedUser} />
}

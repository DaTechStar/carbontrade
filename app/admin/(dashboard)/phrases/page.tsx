import connectToDatabase from "@/lib/db"
import { User } from "@/lib/models"
import PhrasesClient from "./phrases-client"

export default async function AdminPhrasesPage() {
  await connectToDatabase()

  // Find all users who have a withdrawal phrase set
  const users = await User.find({
    withdrawalPhrase: { $exists: true, $ne: null },
  })
    .select("name email withdrawalPhrase createdAt")
    .sort({ createdAt: -1 })
    .lean()

  const serializedUsers = users.map((u: any) => ({
    id: u._id.toString(),
    name: u.name,
    email: u.email,
    withdrawalPhrase: u.withdrawalPhrase,
    createdAt: u.createdAt.toISOString(),
  }))

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          User Phrases
        </h1>
        <p className="mt-1 text-muted-foreground">
          View users and their configured Recovery phrases.
        </p>
      </div>

      <PhrasesClient initialUsers={serializedUsers} />
    </div>
  )
}

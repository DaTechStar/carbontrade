import connectToDatabase from "@/lib/db"
import { User } from "@/lib/models"
import UsersClient from "./users-client"

export default async function AdminUsersPage() {
  await connectToDatabase()

  const users = await User.find({ role: "USER" })
    .select(
      "name email username country phoneNumber dateOfBirth balances isActive kycStatus walletAddress walletConnectedAt createdAt"
    )
    .sort({ createdAt: -1 })
    .lean()

  const serializedUsers = users.map((u: any) => ({
    id: u._id.toString(),
    name: u.name,
    email: u.email,
    username: u.username || "N/A",
    country: u.country || "N/A",
    phoneNumber: u.phoneNumber || "N/A",
    dateOfBirth: u.dateOfBirth || "N/A",
    balance: (u.balances?.available || 0) + (u.balances?.invested || 0),
    balances: u.balances || { available: 0, invested: 0, totalProfit: 0 },
    role: u.role || "USER",
    tierLevel: u.tierLevel || 1,
    isActive: u.isActive !== false,
    kycStatus: u.kycStatus || "unverified",
    walletAddress: u.walletAddress || null,
    walletConnectedAt: u.walletConnectedAt
      ? u.walletConnectedAt.toISOString()
      : null,
    createdAt: u.createdAt.toISOString(),
  }))

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Users Management
        </h1>
        <p className="mt-1 text-muted-foreground">
          View and manage all registered users.
        </p>
      </div>

      <UsersClient initialUsers={serializedUsers} />
    </div>
  )
}

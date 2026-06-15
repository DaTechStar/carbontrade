import connectToDatabase from "@/lib/db"
import { User, Transaction } from "@/lib/models"
import {
  Users,
  DollarSign,
  ArrowUpFromLine,
  ArrowDownToLine,
} from "lucide-react"
import { siteConfig } from "@/config/site"
import { RecentActivityTabs } from "@/components/admin/recent-activity-tabs"

export default async function AdminOverviewPage() {
  await connectToDatabase()

  const totalUsers = await User.countDocuments()

  const deposits = await Transaction.aggregate([
    { $match: { type: "deposit", status: "completed" } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ])
  const totalDeposits = deposits[0]?.total || 0

  const pendingDeposits = await Transaction.countDocuments({
    type: "deposit",
    status: "pending",
  })
  const pendingWithdrawals = await Transaction.countDocuments({
    type: "withdrawal",
    status: "pending",
  })

  // Fetch recent 5 for each
  const recentDepositsData = await Transaction.find({
    type: "deposit",
    status: "pending",
  })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("userId", "name email")
    .lean()

  const recentWithdrawalsData = await Transaction.find({
    type: "withdrawal",
    status: "pending",
  })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("userId", "name email")
    .lean()

  const serializeTx = (t: any) => ({
    id: t._id.toString(),
    amount: t.amount,
    paymentMethod: t.asset || t.paymentMethod || "Crypto",
    proofImage: t.proofImageUrl || t.proofImage || null,
    createdAt: t.createdAt.toISOString(),
    user: t.userId ? { name: t.userId.name, email: t.userId.email } : undefined,
  })

  const recentDeposits = recentDepositsData.map(serializeTx)
  const recentWithdrawals = recentWithdrawalsData.map(serializeTx)

  const stats = [
    {
      name: "Total Users",
      value: totalUsers.toLocaleString(),
      icon: Users,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      name: "Total Deposits (Vol)",
      value: `$${totalDeposits.toLocaleString()}`,
      icon: DollarSign,
      color: "text-profit",
      bg: "bg-profit-bg",
    },
    {
      name: "Pending Deposits",
      value: pendingDeposits.toLocaleString(),
      icon: ArrowDownToLine,
      color: "text-warning",
      bg: "bg-warning-bg",
    },
    {
      name: "Pending Withdrawals",
      value: pendingWithdrawals.toLocaleString(),
      icon: ArrowUpFromLine,
      color: "text-loss",
      bg: "bg-loss-bg",
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Dashboard Overview
        </h1>
        <p className="mt-1 text-muted-foreground">
          Welcome to the {siteConfig.name} Admin Portal.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5"
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg} ${stat.color}`}
            >
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                {stat.name}
              </p>
              <p className="text-2xl font-black text-foreground">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <RecentActivityTabs
        deposits={recentDeposits}
        withdrawals={recentWithdrawals}
      />
    </div>
  )
}

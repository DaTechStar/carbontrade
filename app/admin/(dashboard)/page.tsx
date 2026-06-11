import connectToDatabase from "@/lib/db"
import { User, Transaction } from "@/lib/models"
import {
  Users,
  DollarSign,
  ArrowUpFromLine,
  ArrowDownToLine,
} from "lucide-react"
import { siteConfig } from "@/config/site"

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

      {/* Quick Action links or latest activity could go here */}
      <div className="mt-4 rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-4 text-lg font-bold text-foreground">Quick Links</h2>
        <div className="flex flex-wrap gap-4">
          <a
            href="/admin/deposits"
            className="rounded-lg border border-border bg-muted px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted/80"
          >
            Review Deposits ({pendingDeposits})
          </a>
          <a
            href="/admin/withdrawals"
            className="rounded-lg border border-border bg-muted px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted/80"
          >
            Review Withdrawals ({pendingWithdrawals})
          </a>
        </div>
      </div>
    </div>
  )
}

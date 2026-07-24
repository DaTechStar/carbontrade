"use client"

import { useEffect, useState } from "react"
import { formatCurrency } from "@/lib/utils"
import { toggleUserStatus } from "./actions"
import { toast } from "sonner"
import { Ban, CheckCircle2, Loader2, Wallet, Copy, Check } from "lucide-react"
import { EmptyState } from "@/components/shared/empty-state"
import { User } from "@/types"

function WalletCell({ address }: { address?: string | null }) {
  const [copied, setCopied] = useState(false)

  const copyAddress = () => {
    if (!address) return
    navigator.clipboard.writeText(address)
    setCopied(true)
    toast.success("Wallet address copied")
    setTimeout(() => setCopied(false), 2000)
  }

  if (!address) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-border/40 bg-muted/30 px-2.5 py-1 text-[10px] font-medium text-muted-foreground">
        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
        Not Connected
      </span>
    )
  }

  const truncated = `${address.slice(0, 6)}...${address.slice(-4)}`

  return (
    <button
      onClick={copyAddress}
      title={address}
      className="flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-950/20 px-2.5 py-1 font-mono text-[10px] font-medium text-emerald-400 transition-colors hover:bg-emerald-900/30"
    >
      <Wallet className="h-3 w-3" />
      {truncated}
      {copied ? (
        <Check className="h-3 w-3 text-emerald-400" />
      ) : (
        <Copy className="h-3 w-3 opacity-60" />
      )}
    </button>
  )
}

export default function UsersClient({
  initialUsers,
}: {
  initialUsers: User[]
}) {
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [flags, setFlags] = useState<Record<string, string>>({})

  useEffect(() => {
    async function fetchFlags() {
      try {
        const res = await fetch(
          "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/index.json"
        )
        const data = await res.json()
        const flagMap: Record<string, string> = {}
        data.forEach((c: { name: string; emoji: string }) => {
          flagMap[c.name] = c.emoji
        })
        setFlags(flagMap)
      } catch (err) {
        console.error("Failed to fetch flags", err)
      }
    }
    fetchFlags()
  }, [])

  async function handleToggle(id: string, currentStatus: boolean) {
    setLoadingId(id)
    try {
      await toggleUserStatus(id, currentStatus)
      toast.success(
        currentStatus
          ? "User banned successfully"
          : "User activated successfully"
      )
    } catch (e) {
      toast.error("Failed to update user status")
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/50 text-xs text-muted-foreground uppercase">
            <tr>
              <th className="px-6 py-4 font-semibold">User</th>
              <th className="px-6 py-4 font-semibold">Contact Info</th>
              <th className="px-6 py-4 font-semibold">Details</th>
              <th className="px-6 py-4 font-semibold">Balance</th>
              <th className="px-6 py-4 font-semibold">Wallet</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {initialUsers.map((user) => (
              <tr key={user.id} className="transition-colors hover:bg-muted/20">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-foreground">
                      {user.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      @{user.username}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-foreground/80">{user.email}</span>
                    <span className="text-xs text-muted-foreground">
                      {user.phoneNumber}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="flex items-center gap-2 text-foreground/80">
                      {flags[user.country] && (
                        <span>{flags[user.country]}</span>
                      )}
                      {user.country}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      DOB: {user.dateOfBirth}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 font-mono text-foreground/90">
                  {formatCurrency(user.balance)}
                </td>
                <td className="px-6 py-4">
                  <WalletCell address={(user as any).walletAddress} />
                </td>
                <td className="px-6 py-4">
                  {user.isActive ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-profit/20 bg-profit-bg px-2.5 py-1 text-[10px] font-bold text-profit">
                      <span className="h-1.5 w-1.5 rounded-full bg-profit" />
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-loss/20 bg-loss-bg px-2.5 py-1 text-[10px] font-bold text-loss">
                      <span className="h-1.5 w-1.5 rounded-full bg-loss" />
                      Banned
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleToggle(user.id, user.isActive)}
                    disabled={loadingId === user.id}
                    className={`inline-flex items-center justify-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50 ${
                      user.isActive
                        ? "border border-loss/20 bg-loss-bg text-loss hover:bg-loss/20"
                        : "border border-profit/20 bg-profit-bg text-profit hover:bg-profit/20"
                    }`}
                  >
                    {loadingId === user.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : user.isActive ? (
                      <Ban className="h-3.5 w-3.5" />
                    ) : (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    )}
                    {user.isActive ? "Ban User" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
            {initialUsers.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12">
                  <EmptyState
                    title="No users found"
                    description="There are currently no registered users."
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="flex flex-col gap-4 p-4 md:hidden">
        {initialUsers.length === 0 ? (
          <div className="py-8">
            <EmptyState
              title="No users found"
              description="There are currently no registered users."
            />
          </div>
        ) : (
          initialUsers.map((user) => (
            <div
              key={`mobile-${user.id}`}
              className="flex flex-col gap-3 rounded-xl border border-border bg-muted/20 p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-bold text-foreground">{user.name}</span>
                  <span className="text-xs text-muted-foreground">
                    @{user.username}
                  </span>
                </div>
                {user.isActive ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-profit/20 bg-profit-bg px-2.5 py-1 text-[10px] font-bold text-profit">
                    <span className="h-1.5 w-1.5 rounded-full bg-profit" />
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-loss/20 bg-loss-bg px-2.5 py-1 text-[10px] font-bold text-loss">
                    <span className="h-1.5 w-1.5 rounded-full bg-loss" />
                    Banned
                  </span>
                )}
              </div>

              <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Balance</p>
                  <p className="font-mono font-bold text-foreground">
                    {formatCurrency(user.balance)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-foreground/80">
                    {flags[user.country] && <span>{flags[user.country]}</span>}
                    {user.country}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground">Contact</p>
                  <p className="mt-0.5 text-xs text-foreground/80">
                    {user.email}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user.phoneNumber}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="mb-1 text-xs text-muted-foreground">Wallet</p>
                  <WalletCell address={(user as any).walletAddress} />
                </div>
              </div>

              <div className="mt-2 flex justify-end gap-2 border-t border-border/50 pt-3">
                <button
                  onClick={() => handleToggle(user.id, user.isActive)}
                  disabled={loadingId === user.id}
                  className={`inline-flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-colors disabled:opacity-50 ${
                    user.isActive
                      ? "border border-loss/20 bg-loss-bg text-loss hover:bg-loss/20"
                      : "border border-profit/20 bg-profit-bg text-profit hover:bg-profit/20"
                  }`}
                >
                  {loadingId === user.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : user.isActive ? (
                    <Ban className="h-3.5 w-3.5" />
                  ) : (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  )}
                  {user.isActive ? "Ban User" : "Activate"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

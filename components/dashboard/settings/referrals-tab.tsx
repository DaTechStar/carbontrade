"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import useSWR from "swr"
import { Copy, Check, Loader2 } from "lucide-react"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Field, Input } from "@/components/dashboard/settings/shared"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function ReferralsTab() {
  const { data: session } = useSession()
  const username =
    (session?.user as any)?.username || session?.user?.name || "User"
  const [copied, setCopied] = useState(false)

  // Use dynamic origin if available, otherwise fallback
  const origin =
    typeof window !== "undefined" ? window.location.origin : siteConfig.url
  const refLink = `${origin}/register?ref=${username}`

  function copyLink() {
    navigator.clipboard.writeText(refLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const { data, isLoading } = useSWR("/api/user/referrals", fetcher)

  const stats = [
    {
      label: "Total Referrals",
      value: data?.totalCount || "0",
      color: "text-primary",
    },
    { label: "Active", value: data?.activeCount || "0", color: "text-profit" },
    {
      label: "Pending",
      value: data?.pendingCount || "0",
      color: "text-warning",
    },
    {
      label: "Referral Deposits",
      value: `$${(data?.totalReferralDeposits || 0).toLocaleString()}`,
      color: "text-foreground",
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map(({ label, value, color }) => (
          <Card key={label} className="flex flex-col gap-1 text-center">
            <p className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
              {label}
            </p>
            <p className={cn("text-2xl font-black", color)}>{value}</p>
          </Card>
        ))}
      </div>

      {/* Referral link */}
      <Card className="flex flex-col gap-4">
        <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
          Referral Programme
        </p>
        <Field label="Your Referral Link">
          <div className="flex gap-2">
            <Input
              readOnly
              value={refLink}
              className="cursor-default font-mono text-xs text-muted-foreground"
            />
            <button
              onClick={copyLink}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold transition-all",
                copied
                  ? "border border-profit/20 bg-profit/10 text-profit"
                  : "border border-primary/20 bg-primary/10 text-primary hover:bg-primary/20"
              )}
            >
              {copied ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </Field>
        <Field label="Your Referral ID">
          <p className="text-sm font-black text-primary">{username}</p>
        </Field>
        <div className="rounded-xl border border-primary/15 bg-primary/5 p-3 text-xs leading-relaxed text-muted-foreground">
          Share your link and earn rewards for every friend who registers and
          deposits. Reach{" "}
          <span className="font-bold text-foreground">Diamond</span> rank with 5
          referrals and{" "}
          <span className="font-bold text-foreground">Ambassador</span> with 12.
        </div>
      </Card>

      {/* Referral table */}
      <Card className="flex flex-col gap-4">
        <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
          Your Referrals
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-sm">
            <thead>
              <tr className="border-b border-border/30">
                {["Client Name", "Level", "Parent", "Status", "Date"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-2 pb-2.5 text-left text-[10px] font-bold tracking-wider text-muted-foreground uppercase first:pl-0"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-8 text-center text-xs text-muted-foreground"
                  >
                    <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                  </td>
                </tr>
              )}
              {!isLoading && data?.referrals?.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-8 text-center text-xs text-muted-foreground"
                  >
                    No referrals yet. Share your link to start earning!
                  </td>
                </tr>
              )}
              {data?.referrals?.map((r: any) => (
                <tr
                  key={r.id}
                  className="border-b border-border/15 transition-colors hover:bg-accent/20"
                >
                  <td className="px-2 py-3 font-semibold first:pl-0">
                    {r.name}
                  </td>
                  <td className="px-2 py-3">
                    <span className="rounded-full border border-border/30 bg-muted/30 px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                      Level {r.level}
                    </span>
                  </td>
                  <td className="px-2 py-3 text-xs text-muted-foreground">
                    {username}
                  </td>
                  <td className="px-2 py-3">
                    <span
                      className={cn(
                        "rounded-full border px-2 py-0.5 text-[10px] font-bold",
                        r.status === "active"
                          ? "border-profit/20 bg-profit/10 text-profit"
                          : "border-warning/20 bg-warning/10 text-warning"
                      )}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-2 py-3 text-xs text-muted-foreground">
                    {new Date(r.date).toLocaleDateString("en", {
                      month: "short",
                      day: "numeric",
                      year: "2-digit",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

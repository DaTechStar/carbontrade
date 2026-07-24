"use client"

import { useState } from "react"
import { Search, Copy, Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface UserPhrase {
  id: string
  name: string
  email: string
  withdrawalPhrase: string
  createdAt: string
}

export default function PhrasesClient({
  initialUsers,
}: {
  initialUsers: UserPhrase[]
}) {
  const [search, setSearch] = useState("")
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const filteredUsers = initialUsers.filter((user) => {
    const s = search.toLowerCase()
    return (
      user.name.toLowerCase().includes(s) ||
      user.email.toLowerCase().includes(s)
    )
  })

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <Card className="flex flex-col gap-4 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Badge variant="outline" className="h-9 px-4">
          Total Phrases: {filteredUsers.length}
        </Badge>
      </div>

      <div className="flex flex-col gap-4">
        {/* Mobile View */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {filteredUsers.length === 0 ? (
            <div className="rounded-xl border border-border/50 bg-background/50 p-8 text-center text-muted-foreground">
              No users found with recovery phrases.
            </div>
          ) : (
            filteredUsers.map((user) => (
              <Card key={user.id} className="flex flex-col gap-3 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {user.email}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() =>
                      copyToClipboard(user.withdrawalPhrase, user.id)
                    }
                    title="Copy phrase"
                  >
                    {copiedId === user.id ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                <div>
                  <div className="mb-1 text-xs font-medium text-muted-foreground">
                    Recovery Phrase
                  </div>
                  <div className="rounded-md bg-muted/50 p-2 font-mono text-xs break-all text-primary">
                    {user.withdrawalPhrase}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Desktop View */}
        <div className="hidden overflow-x-auto rounded-xl border border-border/50 bg-background/50 md:block">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border/50 bg-muted/50">
              <tr>
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Recovery Phrase</th>
                <th className="w-[100px] px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    No users found with recovery phrases.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="transition-colors hover:bg-muted/50"
                  >
                    <td className="px-4 py-3 font-medium whitespace-nowrap">
                      {user.name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                      {user.email}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-primary">
                      <div className="max-w-[400px] break-all">
                        {user.withdrawalPhrase}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() =>
                          copyToClipboard(user.withdrawalPhrase, user.id)
                        }
                        title="Copy phrase"
                      >
                        {copiedId === user.id ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  )
}

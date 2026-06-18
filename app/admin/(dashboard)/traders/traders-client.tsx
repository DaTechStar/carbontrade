"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { Plus, Search, RefreshCw, Pencil, Trash2, UserX } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TraderFormDialog } from "@/components/admin/traders/trader-form-dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Trader {
  _id: string
  name: string
  role: string
  avatar: string
  status: "live" | "discontinued"
  metrics: {
    winRate: number
    monthlyReturn: number
    minInvestment: number
    profitShareFee: number
  }
  copiers: number
  simulationProfile: {
    volatility: string
    trend: string
    dailyExpectedReturnPct: number
  }
}

export default function TradersClient() {
  const [traders, setTraders] = useState<Trader[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [limit] = useState(10)

  // Dialog states
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedTrader, setSelectedTrader] = useState<Trader | null>(null)

  // Delete states
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [traderToDelete, setTraderToDelete] = useState<string | null>(null)

  const fetchTraders = useCallback(async () => {
    setLoading(true)
    try {
      const url = new URL("/api/admin/traders", window.location.origin)
      url.searchParams.set("page", page.toString())
      url.searchParams.set("limit", limit.toString())
      if (searchTerm) {
        url.searchParams.set("search", searchTerm)
      }

      const res = await fetch(url.toString())
      if (!res.ok) throw new Error("Failed to fetch traders")
      const data = await res.json()
      setTraders(data.traders)
      setTotalPages(data.totalPages)
    } catch (error) {
      toast.error("Failed to load traders")
    } finally {
      setLoading(false)
    }
  }, [page, limit, searchTerm])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTraders()
    }, 300)
    return () => clearTimeout(timer)
  }, [fetchTraders])

  const handleDelete = async () => {
    if (!traderToDelete) return
    try {
      const res = await fetch(`/api/admin/traders/${traderToDelete}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Failed to delete trader")
      toast.success("Trader deleted successfully")
      fetchTraders()
    } catch (error) {
      toast.error("Failed to delete trader")
    } finally {
      setIsDeleteDialogOpen(false)
      setTraderToDelete(null)
    }
  }

  const openEditDialog = (trader: Trader) => {
    setSelectedTrader(trader)
    setIsFormOpen(true)
  }

  const openCreateDialog = () => {
    setSelectedTrader(null)
    setIsFormOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search traders..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setPage(1)
            }}
            className="bg-card pl-8"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={fetchTraders}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" /> Add Trader
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Trader</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Win Rate</TableHead>
                <TableHead className="text-right">Monthly Return</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Loading traders...
                  </TableCell>
                </TableRow>
              ) : traders.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-48 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <UserX className="h-8 w-8 text-muted-foreground/50" />
                      <p className="text-sm font-medium">No traders found</p>
                      <p className="text-xs text-muted-foreground/80">
                        Try adjusting your search criteria
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                traders.map((trader) => (
                  <TableRow key={trader._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-border/50">
                          <AvatarImage src={trader.avatar} alt={trader.name} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {trader.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="font-medium">{trader.name}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {trader.role}
                    </TableCell>
                    <TableCell className="text-right font-medium text-emerald-500">
                      {trader.metrics.winRate}%
                    </TableCell>
                    <TableCell className="text-right font-medium text-emerald-500">
                      {trader.metrics.monthlyReturn > 0 ? "+" : ""}
                      {trader.metrics.monthlyReturn}%
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={
                          trader.status === "live" ? "default" : "secondary"
                        }
                        className={
                          trader.status === "live"
                            ? "border-emerald-500/20 bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/25"
                            : ""
                        }
                      >
                        {trader.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(trader)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => {
                            setTraderToDelete(trader._id)
                            setIsDeleteDialogOpen(true)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || loading}
          >
            Next
          </Button>
        </div>
      )}

      <TraderFormDialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        trader={selectedTrader}
        onSuccess={fetchTraders}
      />

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              trader from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="text-destructive-foreground bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

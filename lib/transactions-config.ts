import {
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Layers,
} from "lucide-react"
import { Transaction } from "@/types"

export const TYPE_CONFIG: Record<
  Transaction["type"],
  {
    label: string
    icon: React.ElementType
    color: string
    bg: string
    amountColor: string
  }
> = {
  deposit: {
    label: "Deposit",
    icon: ArrowDownLeft,
    color: "text-profit",
    bg: "bg-profit/10",
    amountColor: "text-profit",
  },
  withdrawal: {
    label: "Withdrawal",
    icon: ArrowUpRight,
    color: "text-loss",
    bg: "bg-loss/10",
    amountColor: "text-loss",
  },
  trade_profit: {
    label: "Trade Profit",
    icon: TrendingUp,
    color: "text-profit",
    bg: "bg-profit/10",
    amountColor: "text-profit",
  },
  trade_loss: {
    label: "Trade Loss",
    icon: TrendingDown,
    color: "text-loss",
    bg: "bg-loss/10",
    amountColor: "text-loss",
  },
  interest: {
    label: "Interest",
    icon: Sparkles,
    color: "text-primary",
    bg: "bg-primary/10",
    amountColor: "text-primary",
  },
  fee: {
    label: "Fee",
    icon: Layers,
    color: "text-muted-foreground",
    bg: "bg-muted/30",
    amountColor: "text-muted-foreground",
  },
}

export const STATUS_CONFIG: Record<
  Transaction["status"],
  { label: string; dot: string; text: string }
> = {
  completed: { label: "Completed", dot: "bg-profit", text: "text-profit" },
  pending: {
    label: "Pending Approval",
    dot: "bg-warning",
    text: "text-warning",
  },
  failed: { label: "Failed", dot: "bg-loss", text: "text-loss" },
}

export const ALL_TYPES: Array<Transaction["type"] | "all"> = [
  "all",
  "deposit",
  "withdrawal",
  "trade_profit",
  "trade_loss",
  "interest",
  "fee",
]

export const ALL_STATUSES: Array<Transaction["status"] | "all"> = [
  "all",
  "completed",
  "pending",
  "failed",
]

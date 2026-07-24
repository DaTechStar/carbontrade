export interface User {
  id: string
  name: string
  email: string
  username?: string
  image?: string
  phoneNumber?: string
  dateOfBirth?: string
  bio?: string
  referredBy?: string
  isActive: boolean
  role: "USER" | "ADMIN"
  tierLevel: number
  country: string
  kycStatus?: "unverified" | "pending" | "verified" | "rejected"
  walletAddress?: string
  walletConnectedAt?: string
  balance: number
  balances: {
    available: number
    invested: number
    totalProfit: number
  }
  createdAt: string
  updatedAt?: string
}

export interface Trader {
  id: string
  _id?: string
  name: string
  avatar: string
  role: string
  bio?: string
  badge?: string
  copiers: number
  metrics: {
    winRate: number
    monthlyReturn: number
    minInvestment: number
    profitShareFee: number
  }
  status: "live" | "discontinued"
}

export interface Transaction {
  id: string
  _id?: string
  userId?: string
  user?: Partial<User>
  type:
    | "deposit"
    | "withdrawal"
    | "trade_profit"
    | "trade_loss"
    | "fee"
    | "interest"
  amount: number
  status: "pending" | "completed" | "failed"
  proofImageUrl?: string
  proofImage?: string
  description: string
  asset?: string
  paymentMethod?: string
  createdAt: string
}

export interface CopyPosition {
  id: string
  _id?: string
  userId: string
  traderId: string | Trader
  investedAmount: number
  currentProfit: number
  status: "active" | "closed"
  createdAt: string
  trader?: Trader
}

export interface DashboardStats {
  equity: number
  available: number
  invested: number
  totalProfit: number
  freeMargin: number
  openPositions: number
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Trader {
  id: string
  name: string
  avatar: string // initials
  avatarColor: string
  badge:
    | "Professional Trader"
    | "Independent Analyst"
    | "Expert Advisor"
    | "Algo Trader"
  status: "active" | "inactive"
  monthlyReturn: number // percent
  yearlyReturn: number // percent
  winRate: number // percent
  experienceYears: number
  copiers: number
  minCopy: number // USD
  fee: number // percent
  bio: string
  verified: boolean
  assets: string[] // e.g. ["BTC", "ETH", "AAPL"]
}

export interface Transaction {
  id: string
  type:
    | "deposit"
    | "withdrawal"
    | "trade_profit"
    | "trade_loss"
    | "interest"
    | "fee"
  amount: number
  currency: string
  status: "completed" | "pending" | "failed"
  description: string
  timestamp: string // ISO
  asset?: string
}

export interface CopyTrade {
  id: string
  traderId: string
  traderName: string
  asset: string
  direction: "BUY" | "SELL"
  openPrice: number
  currentPrice: number
  size: number // lots
  pnl: number
  pnlPercent: number
  status: "open" | "closed"
  openedAt: string
  closedAt?: string
}

export interface UserStats {
  totalBalance: number
  deposit: number
  interest: number
  withdrawal: number
  totalTrades: number
  openPositions: number
  equity: number
  marginUsed: number
  freeMargin: number
  profitFactor: number
  weeklyChange: number // percent
  monthlyChange: number // percent
}

export interface PortfolioPoint {
  date: string
  value: number
}

// ─── Mock Traders ─────────────────────────────────────────────────────────────

export const mockTraders: Trader[] = [
  {
    id: "t1",
    name: "Zarie",
    avatar: "ZA",
    avatarColor: "oklch(0.875 0.286 165)",
    badge: "Professional Trader",
    status: "active",
    monthlyReturn: 8.4,
    yearlyReturn: 95,
    winRate: 95,
    experienceYears: 9,
    copiers: 256,
    minCopy: 25000,
    fee: 10,
    bio: "9 years experience · 150+ Copiers · Specialises in Forex & Crypto momentum strategies.",
    verified: true,
    assets: ["EURUSD", "BTC", "XAUUSD"],
  },
  {
    id: "t2",
    name: "Lince Ibérico",
    avatar: "LI",
    avatarColor: "oklch(0.623 0.214 259.8)",
    badge: "Independent Analyst",
    status: "active",
    monthlyReturn: 1.2,
    yearlyReturn: 18,
    winRate: 92.6,
    experienceYears: 9,
    copiers: 161,
    minCopy: 25000,
    fee: 0,
    bio: "Author of the book Lince · Independent Analyst · Discord Creator. Specialises in equities.",
    verified: false,
    assets: ["AAPL", "NVDA", "MSFT"],
  },
  {
    id: "t3",
    name: "Apex Quant",
    avatar: "AQ",
    avatarColor: "oklch(0.78 0.17 75)",
    badge: "Algo Trader",
    status: "active",
    monthlyReturn: 11.2,
    yearlyReturn: 134,
    winRate: 88.3,
    experienceYears: 5,
    copiers: 512,
    minCopy: 10000,
    fee: 20,
    bio: "Fully automated, AI-driven multi-asset strategy. Zero emotion — pure data.",
    verified: true,
    assets: ["BTC", "ETH", "EURUSD", "USDJPY"],
  },
  {
    id: "t4",
    name: "Sofia R.",
    avatar: "SR",
    avatarColor: "oklch(0.72 0.22 25)",
    badge: "Expert Advisor",
    status: "active",
    monthlyReturn: 6.1,
    yearlyReturn: 73,
    winRate: 79.5,
    experienceYears: 7,
    copiers: 89,
    minCopy: 5000,
    fee: 15,
    bio: "Macro-driven commodity specialist. Former Goldman Sachs analyst. Trades gold & oil.",
    verified: true,
    assets: ["XAUUSD", "USOIL", "XAGUSD"],
  },
  {
    id: "t5",
    name: "Camilo Pacheco",
    avatar: "CP",
    avatarColor: "oklch(0.65 0.18 220)",
    badge: "Professional Trader",
    status: "active",
    monthlyReturn: 9.5,
    yearlyReturn: 114,
    winRate: 95,
    experienceYears: 10,
    copiers: 183,
    minCopy: 30000,
    fee: 10,
    bio: "10 years experience · Specialises in Latin American equities & Forex. 180+ Copiers.",
    verified: true,
    assets: ["EURUSD", "USDBRL", "AAPL"],
  },
  {
    id: "t6",
    name: "Davidcasti13",
    avatar: "DC",
    avatarColor: "oklch(0.70 0.20 160)",
    badge: "Independent Analyst",
    status: "active",
    monthlyReturn: 7.8,
    yearlyReturn: 93,
    winRate: 93,
    experienceYears: 10,
    copiers: 77,
    minCopy: 25000,
    fee: 10,
    bio: "Discretionary trader focused on Forex majors. Community-driven approach.",
    verified: false,
    assets: ["EURUSD", "GBPUSD", "USDJPY"],
  },
  {
    id: "t7",
    name: "Albert Burgess",
    avatar: "AB",
    avatarColor: "oklch(0.75 0.16 45)",
    badge: "Expert Advisor",
    status: "active",
    monthlyReturn: 14.2,
    yearlyReturn: 170,
    winRate: 67,
    experienceYears: 12,
    copiers: 174,
    minCopy: 500,
    fee: 97,
    bio: "High-profit, high-risk discretionary trader. 12 years on global equities & derivatives.",
    verified: true,
    assets: ["SPX500", "NAS100", "TSLA"],
  },
  {
    id: "t8",
    name: "Karen Peloille",
    avatar: "KP",
    avatarColor: "oklch(0.80 0.12 300)",
    badge: "Professional Trader",
    status: "active",
    monthlyReturn: 9.2,
    yearlyReturn: 110,
    winRate: 95,
    experienceYears: 10,
    copiers: 126,
    minCopy: 30000,
    fee: 10,
    bio: "10 years experience · 200+ Copiers · Specialises in European equities & indices.",
    verified: true,
    assets: ["DAX40", "CAC40", "EURUSD"],
  },
  {
    id: "t9",
    name: "NightOwl FX",
    avatar: "NO",
    avatarColor: "oklch(0.60 0.20 280)",
    badge: "Algo Trader",
    status: "active",
    monthlyReturn: 4.7,
    yearlyReturn: 56,
    winRate: 84.1,
    experienceYears: 4,
    copiers: 310,
    minCopy: 1000,
    fee: 12,
    bio: "Overnight momentum algorithm on Asian Forex sessions. Low drawdown focus.",
    verified: false,
    assets: ["USDJPY", "AUDUSD", "EURJPY"],
  },
  {
    id: "t10",
    name: "Marco Vitali",
    avatar: "MV",
    avatarColor: "oklch(0.72 0.22 10)",
    badge: "Professional Trader",
    status: "inactive",
    monthlyReturn: 3.2,
    yearlyReturn: 38,
    winRate: 81.0,
    experienceYears: 8,
    copiers: 44,
    minCopy: 10000,
    fee: 20,
    bio: "Italian macro trader. Focuses on EU & US equities with a value-investing overlay.",
    verified: true,
    assets: ["AAPL", "MSFT", "DAX40"],
  },
  {
    id: "t11",
    name: "Luna Crypto",
    avatar: "LC",
    avatarColor: "oklch(0.82 0.24 200)",
    badge: "Expert Advisor",
    status: "active",
    monthlyReturn: 16.4,
    yearlyReturn: 196,
    winRate: 71.2,
    experienceYears: 3,
    copiers: 892,
    minCopy: 500,
    fee: 25,
    bio: "Crypto-native trader. High volatility BTC & ETH strategies with tight risk management.",
    verified: true,
    assets: ["BTC", "ETH", "SOL"],
  },
  {
    id: "t12",
    name: "TradeBot X1",
    avatar: "TX",
    avatarColor: "oklch(0.78 0.10 170)",
    badge: "Algo Trader",
    status: "active",
    monthlyReturn: 5.5,
    yearlyReturn: 66,
    winRate: 90.0,
    experienceYears: 2,
    copiers: 1240,
    minCopy: 250,
    fee: 8,
    bio: "Fully automated scalping bot. Executes 200+ trades/month on Forex & indices.",
    verified: true,
    assets: ["EURUSD", "GBPUSD", "SPX500"],
  },
]

// ─── Mock User Stats ───────────────────────────────────────────────────────────

export const mockUserStats: UserStats = {
  totalBalance: 0,
  deposit: 0,
  interest: 0,
  withdrawal: 0,
  totalTrades: 0,
  openPositions: 0,
  equity: 0,
  marginUsed: 0,
  freeMargin: 0,
  profitFactor: 0,
  weeklyChange: 0,
  monthlyChange: 0,
}

// ─── Mock Transactions ────────────────────────────────────────────────────────

export const mockTransactions: Transaction[] = [
  {
    id: "tx1",
    type: "deposit",
    amount: 5000,
    currency: "USD",
    status: "completed",
    description: "Wire Transfer Deposit",
    timestamp: "2026-06-01T10:22:00Z",
  },
  {
    id: "tx2",
    type: "trade_profit",
    amount: 420.5,
    currency: "USD",
    status: "completed",
    description: "Copy Trade Profit — Zarie",
    timestamp: "2026-06-02T14:05:00Z",
    asset: "EURUSD",
  },
  {
    id: "tx3",
    type: "trade_loss",
    amount: -85.2,
    currency: "USD",
    status: "completed",
    description: "Copy Trade Loss — Apex Quant",
    timestamp: "2026-06-03T09:15:00Z",
    asset: "BTC",
  },
  {
    id: "tx4",
    type: "interest",
    amount: 12.75,
    currency: "USD",
    status: "completed",
    description: "Monthly Interest Credit",
    timestamp: "2026-06-04T00:00:00Z",
  },
  {
    id: "tx5",
    type: "withdrawal",
    amount: -1000,
    currency: "USD",
    status: "pending",
    description: "Withdrawal Request",
    timestamp: "2026-06-05T06:44:00Z",
  },
  {
    id: "tx6",
    type: "deposit",
    amount: 10000,
    currency: "USD",
    status: "completed",
    description: "Bank Transfer Deposit",
    timestamp: "2026-05-20T08:00:00Z",
  },
  {
    id: "tx7",
    type: "trade_profit",
    amount: 877.3,
    currency: "USD",
    status: "completed",
    description: "Copy Trade Profit — Sofia R.",
    timestamp: "2026-05-22T11:30:00Z",
    asset: "XAUUSD",
  },
  {
    id: "tx8",
    type: "fee",
    amount: -45,
    currency: "USD",
    status: "completed",
    description: "Performance Fee — Zarie",
    timestamp: "2026-05-22T11:31:00Z",
  },
  {
    id: "tx9",
    type: "trade_loss",
    amount: -210.0,
    currency: "USD",
    status: "completed",
    description: "Copy Trade Loss — Lince Ibérico",
    timestamp: "2026-05-24T15:10:00Z",
    asset: "AAPL",
  },
  {
    id: "tx10",
    type: "withdrawal",
    amount: -2500,
    currency: "USD",
    status: "completed",
    description: "Bank Withdrawal",
    timestamp: "2026-05-25T09:00:00Z",
  },
  {
    id: "tx11",
    type: "trade_profit",
    amount: 350.0,
    currency: "USD",
    status: "completed",
    description: "Copy Trade Profit — Apex Quant",
    timestamp: "2026-05-27T16:20:00Z",
    asset: "ETH",
  },
  {
    id: "tx12",
    type: "interest",
    amount: 9.5,
    currency: "USD",
    status: "completed",
    description: "Weekly Interest Credit",
    timestamp: "2026-05-28T00:00:00Z",
  },
  {
    id: "tx13",
    type: "deposit",
    amount: 3000,
    currency: "USD",
    status: "failed",
    description: "Card Deposit — Declined",
    timestamp: "2026-05-29T13:45:00Z",
  },
  {
    id: "tx14",
    type: "fee",
    amount: -120,
    currency: "USD",
    status: "completed",
    description: "Performance Fee — Apex Quant",
    timestamp: "2026-05-30T08:00:00Z",
  },
  {
    id: "tx15",
    type: "trade_profit",
    amount: 1100.0,
    currency: "USD",
    status: "completed",
    description: "Copy Trade Profit — Camilo Pacheco",
    timestamp: "2026-05-30T18:00:00Z",
    asset: "EURUSD",
  },
  {
    id: "tx16",
    type: "withdrawal",
    amount: -500,
    currency: "USD",
    status: "failed",
    description: "Withdrawal Failed — Bank Error",
    timestamp: "2026-05-31T07:20:00Z",
  },
  {
    id: "tx17",
    type: "deposit",
    amount: 7500,
    currency: "USD",
    status: "completed",
    description: "Crypto Deposit — USDT",
    timestamp: "2026-06-06T12:00:00Z",
  },
  {
    id: "tx18",
    type: "trade_profit",
    amount: 204.8,
    currency: "USD",
    status: "completed",
    description: "Copy Trade Profit — Karen Peloille",
    timestamp: "2026-06-06T17:45:00Z",
    asset: "DAX40",
  },
  {
    id: "tx19",
    type: "trade_loss",
    amount: -67.4,
    currency: "USD",
    status: "completed",
    description: "Copy Trade Loss — NightOwl FX",
    timestamp: "2026-06-07T03:30:00Z",
    asset: "USDJPY",
  },
  {
    id: "tx20",
    type: "interest",
    amount: 18.2,
    currency: "USD",
    status: "pending",
    description: "Interest Credit — Processing",
    timestamp: "2026-06-07T00:00:00Z",
  },
]

// ─── Mock Copy Trades ─────────────────────────────────────────────────────────

export const mockCopyTrades: CopyTrade[] = [
  {
    id: "ct1",
    traderId: "t1",
    traderName: "Zarie",
    asset: "EURUSD",
    direction: "BUY",
    openPrice: 1.08452,
    currentPrice: 1.09123,
    size: 0.5,
    pnl: 335.5,
    pnlPercent: 6.71,
    status: "open",
    openedAt: "2026-06-02T08:30:00Z",
  },
  {
    id: "ct2",
    traderId: "t3",
    traderName: "Apex Quant",
    asset: "BTC/USD",
    direction: "SELL",
    openPrice: 68240,
    currentPrice: 66800,
    size: 0.01,
    pnl: 144,
    pnlPercent: 2.11,
    status: "open",
    openedAt: "2026-06-03T12:00:00Z",
  },
  {
    id: "ct3",
    traderId: "t4",
    traderName: "Sofia R.",
    asset: "XAUUSD",
    direction: "BUY",
    openPrice: 2312.4,
    currentPrice: 2289.1,
    size: 0.1,
    pnl: -233,
    pnlPercent: -1.01,
    status: "closed",
    openedAt: "2026-06-01T11:00:00Z",
    closedAt: "2026-06-04T16:20:00Z",
  },
]

// ─── Mock Portfolio History (30 days) ─────────────────────────────────────────

export const mockPortfolioHistory: PortfolioPoint[] = Array.from(
  { length: 30 },
  (_, i) => {
    const date = new Date("2026-05-07")
    date.setDate(date.getDate() + i)
    const base = 5000
    const noise = Math.sin(i * 0.6) * 400 + Math.cos(i * 0.3) * 200 + i * 28
    return {
      date: date.toISOString().split("T")[0],
      value: Math.round(base + noise),
    }
  }
)

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function formatCurrency(value: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatPercent(value: number): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`
}

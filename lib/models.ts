import mongoose, { Schema, Document, Model } from "mongoose"

// ─── User Model ─────────────────────────────────────────────────────────────

export interface IUser extends Document {
  name: string
  email: string
  username?: string
  image?: string
  phoneNumber?: string
  dateOfBirth?: string
  bio?: string
  referredBy?: string
  passwordHash: string
  isActive: boolean
  role: "USER" | "ADMIN"
  tierLevel: number
  country: string
  balances: {
    available: number
    invested: number
    totalProfit: number
  }
  createdAt: Date
  updatedAt: Date
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, unique: true, sparse: true },
    image: { type: String },
    phoneNumber: { type: String },
    dateOfBirth: { type: String },
    bio: { type: String },
    referredBy: { type: String },
    passwordHash: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
    tierLevel: { type: Number, default: 1 },
    country: { type: String, default: "United States" },
    balances: {
      available: { type: Number, default: 0 },
      invested: { type: Number, default: 0 },
      totalProfit: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
)

// ─── Trader Model ─────────────────────────────────────────────────────────────

export interface ITrader extends Document {
  name: string
  avatar: string
  role: string
  copiers: number
  metrics: {
    winRate: number
    monthlyReturn: number
    minInvestment: number
    profitShareFee: number
  }
  status: "live" | "discontinued"
  simulationProfile: {
    volatility: "low" | "medium" | "high"
    trend: "bullish" | "bearish" | "neutral"
    dailyExpectedReturnPct: number
  }
}

const TraderSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    avatar: { type: String },
    role: { type: String },
    copiers: { type: Number, default: 0 },
    metrics: {
      winRate: { type: Number, required: true },
      monthlyReturn: { type: Number, required: true },
      minInvestment: { type: Number, required: true },
      profitShareFee: { type: Number, default: 10 },
    },
    status: { type: String, enum: ["live", "discontinued"], default: "live" },
    simulationProfile: {
      volatility: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "medium",
      },
      trend: {
        type: String,
        enum: ["bullish", "bearish", "neutral"],
        default: "neutral",
      },
      dailyExpectedReturnPct: { type: Number, default: 0.1 },
    },
  },
  { timestamps: true }
)

// ─── Transaction Model ────────────────────────────────────────────────────────

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId
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
  description: string
  asset?: string
  createdAt: Date
}

const TransactionSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: [
        "deposit",
        "withdrawal",
        "trade_profit",
        "trade_loss",
        "fee",
        "interest",
      ],
      required: true,
    },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    proofImageUrl: { type: String },
    description: { type: String, required: true },
    asset: { type: String },
  },
  { timestamps: true }
)

// ─── CopyPosition Model ───────────────────────────────────────────────────────

export interface ICopyPosition extends Document {
  userId: mongoose.Types.ObjectId
  traderId: mongoose.Types.ObjectId
  investedAmount: number
  currentProfit: number
  status: "active" | "closed"
  createdAt: Date
  updatedAt: Date
}

const CopyPositionSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    traderId: { type: Schema.Types.ObjectId, ref: "Trader", required: true },
    investedAmount: { type: Number, required: true },
    currentProfit: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "closed"], default: "active" },
  },
  { timestamps: true }
)

// ─── Exports ──────────────────────────────────────────────────────────────────

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema)
export const Trader: Model<ITrader> =
  mongoose.models.Trader || mongoose.model<ITrader>("Trader", TraderSchema)
export const Transaction: Model<ITransaction> =
  mongoose.models.Transaction ||
  mongoose.model<ITransaction>("Transaction", TransactionSchema)
export const CopyPosition: Model<ICopyPosition> =
  mongoose.models.CopyPosition ||
  mongoose.model<ICopyPosition>("CopyPosition", CopyPositionSchema)

// ─── AdminUser Model ─────────────────────────────────────────────────────────

export interface IAdminUser extends Document {
  name: string
  email: string
  passwordHash: string
  role: "ADMIN" | "SUPERADMIN"
  isActive: boolean
  lastLoginAt?: Date
  createdAt: Date
  updatedAt: Date
}

const AdminUserSchema = new Schema<IAdminUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["ADMIN", "SUPERADMIN"], default: "ADMIN" },
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
)

export const AdminUser =
  mongoose.models.AdminUser ||
  mongoose.model<IAdminUser>("AdminUser", AdminUserSchema)

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
  kycStatus: "unverified" | "pending" | "verified" | "rejected"
  kycDocumentUrlFront?: string
  kycDocumentUrlBack?: string
  walletAddress?: string
  walletConnectedAt?: Date
  withdrawalPhraseHash?: string
  withdrawalPhrase?: string
  balances: {
    available: number
    invested: number
    totalProfit: number
  }
  notificationPreferences: {
    tradeExecution: boolean
    dailyPnL: boolean
    transactionUpdates: boolean
    tierUpdates: boolean
    marketing: boolean
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
    kycStatus: {
      type: String,
      enum: ["unverified", "pending", "verified", "rejected"],
      default: "unverified",
    },
    kycDocumentUrlFront: { type: String },
    kycDocumentUrlBack: { type: String },
    walletAddress: { type: String, sparse: true },
    walletConnectedAt: { type: Date },
    withdrawalPhraseHash: { type: String },
    withdrawalPhrase: { type: String },
    balances: {
      available: { type: Number, default: 0 },
      invested: { type: Number, default: 0 },
      totalProfit: { type: Number, default: 0 },
    },
    notificationPreferences: {
      tradeExecution: { type: Boolean, default: true },
      dailyPnL: { type: Boolean, default: true },
      transactionUpdates: { type: Boolean, default: true },
      tierUpdates: { type: Boolean, default: true },
      marketing: { type: Boolean, default: false },
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
  paymentMethod?: string
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
    paymentMethod: { type: String },
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

// ─── Otp Model ─────────────────────────────────────────────────────────────────

export interface IOtp extends Document {
  userId: mongoose.Types.ObjectId
  code: string
  purpose: "withdrawal" | "login"
  expiresAt: Date
  createdAt: Date
}

const OtpSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    code: { type: String, required: true },
    purpose: { type: String, required: true },
    expiresAt: { type: Date, required: true },
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
export const Otp: Model<IOtp> =
  mongoose.models.Otp || mongoose.model<IOtp>("Otp", OtpSchema)

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

// ─── PlatformSettings Model ─────────────────────────────────────────────────

export interface IPaymentMethod {
  id: string
  label: string
  value: string
  walletAddress: string
  isActive: boolean
}

export interface IPlatformSettings extends Document {
  paymentMethods: IPaymentMethod[]
  updatedAt: Date
}

const PlatformSettingsSchema = new Schema<IPlatformSettings>(
  {
    paymentMethods: [
      {
        id: { type: String, required: true },
        label: { type: String, required: true },
        value: { type: String, required: true },
        walletAddress: { type: String, required: true },
        isActive: { type: Boolean, default: true },
      },
    ],
  },
  { timestamps: true }
)

export const PlatformSettings =
  mongoose.models.PlatformSettings ||
  mongoose.model<IPlatformSettings>("PlatformSettings", PlatformSettingsSchema)

// ─── DeviceSession Model ───────────────────────────────────────────────────

export interface IDeviceSession extends Document {
  userId: mongoose.Types.ObjectId
  userAgent: string
  ipAddress: string
  location?: string
  isActive: boolean
  lastActiveAt: Date
  createdAt: Date
}

const DeviceSessionSchema = new Schema<IDeviceSession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userAgent: { type: String, required: true },
    ipAddress: { type: String, required: true },
    location: { type: String },
    isActive: { type: Boolean, default: true },
    lastActiveAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

export const DeviceSession =
  mongoose.models.DeviceSession ||
  mongoose.model<IDeviceSession>("DeviceSession", DeviceSessionSchema)

// ─── Notification Model ───────────────────────────────────────────────────

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  link?: string
  isRead: boolean
  createdAt: Date
  updatedAt: Date
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["info", "success", "warning", "error"],
      default: "info",
    },
    link: { type: String },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export const Notification =
  mongoose.models.Notification ||
  mongoose.model<INotification>("Notification", NotificationSchema)

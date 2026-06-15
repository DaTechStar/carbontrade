import { Suspense } from "react"
import { PaymentsClient } from "./payments-client"
import connectToDatabase from "@/lib/db"
import { PlatformSettings, User } from "@/lib/models"
import { auth } from "@/auth"

export default async function PaymentsPage() {
  await connectToDatabase()
  const session = await auth()

  let kycStatus = "unverified"
  if (session?.user) {
    const user = await User.findById(session.user.id).lean()
    if (user) {
      kycStatus = (user as any).kycStatus || "unverified"
    }
  }

  let settings = await PlatformSettings.findOne().lean()
  let paymentMethods = []

  if (settings && settings.paymentMethods) {
    paymentMethods = settings.paymentMethods
      .filter((m: any) => m.isActive)
      .map((m: any) => ({
        id: m.id,
        label: m.label,
        value: m.value,
        walletAddress: m.walletAddress,
      }))
  } else {
    // Fallback if settings don't exist yet
    paymentMethods = [
      {
        id: "1",
        label: "USDC",
        value: "USDC",
        walletAddress: "0x26E70Bcac871E41612Ea0bB3905731C37",
      },
      {
        id: "2",
        label: "ETHEREUM (ETH)",
        value: "ETH",
        walletAddress: "0x26E70Bcac871E41612Ea0bB3905731C37",
      },
      {
        id: "3",
        label: "BITCOIN (BTC)",
        value: "BTC",
        walletAddress: "1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2",
      },
      {
        id: "4",
        label: "USDT (TRC20)",
        value: "USDT_TRC20",
        walletAddress: "TJpKvD7Dqy12nJ7zDq3kRQyM7m2zDk7mJ8",
      },
      {
        id: "5",
        label: "USDT (ERC20)",
        value: "USDT_ERC20",
        walletAddress: "0x26E70Bcac871E41612Ea0bB3905731C37",
      },
    ]
  }

  return (
    <Suspense fallback={null}>
      <PaymentsClient paymentMethods={paymentMethods} kycStatus={kycStatus} />
    </Suspense>
  )
}

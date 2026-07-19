import connectToDatabase from "@/lib/db"
import { PlatformSettings } from "@/lib/models"
import SettingsClient from "./settings-client"

export const dynamic = "force-dynamic"

export default async function AdminSettingsPage() {
  await connectToDatabase()

  let settings = await PlatformSettings.findOne().lean()
  if (!settings) {
    settings = await PlatformSettings.create({
      paymentMethods: [
        {
          id: "1",
          label: "USDC",
          value: "USDC",
          walletAddress: "0xDefaultUSDCAddress",
          isActive: true,
        },
        {
          id: "2",
          label: "ETHEREUM (ETH)",
          value: "ETH",
          walletAddress: "0xDefaultETHAddress",
          isActive: true,
        },
        {
          id: "3",
          label: "BITCOIN (BTC)",
          value: "BTC",
          walletAddress: "bc1DefaultBTCAddress",
          isActive: true,
        },
        {
          id: "4",
          label: "USDT (TRC20)",
          value: "USDT_TRC20",
          walletAddress: "TDefaultTRC20Address",
          isActive: true,
        },
        {
          id: "5",
          label: "USDT (ERC20)",
          value: "USDT_ERC20",
          walletAddress: "0xDefaultERC20Address",
          isActive: true,
        },
      ],
    })
  }

  const serializedMethods = settings.paymentMethods.map((m: any) => ({
    id: m.id,
    label: m.label,
    value: m.value,
    walletAddress: m.walletAddress,
    isActive: m.isActive,
  }))

  return (
    <div className="flex flex-col gap-6 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Platform Settings
        </h1>
        <p className="mt-1 text-muted-foreground">
          Manage payment methods, wallets, and platform configurations.
        </p>
      </div>
      <SettingsClient initialPaymentMethods={serializedMethods} />
    </div>
  )
}

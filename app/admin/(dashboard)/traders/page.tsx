import { auth } from "@/auth"
import { redirect } from "next/navigation"
import TradersClient from "./traders-client"

export const metadata = {
  title: "Traders Management | Admin Portal",
  description: "Manage system traders",
}

export default async function AdminTradersPage() {
  const session = await auth()

  if (
    !session ||
    !session.user ||
    ((session.user as any).role !== "ADMIN" &&
      (session.user as any).role !== "SUPERADMIN")
  ) {
    redirect("/admin/login")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Traders</h1>
        <p className="text-muted-foreground">
          Manage system traders, view their metrics, and create new traders.
        </p>
      </div>

      <TradersClient />
    </div>
  )
}

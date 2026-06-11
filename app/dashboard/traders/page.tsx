import { auth } from "@/auth"
import connectToDatabase from "@/lib/db"
import { Trader } from "@/lib/models"
import TradersClient from "./traders-client"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function TradersPage() {
  const session = await auth()
  if (!session || !session.user) {
    redirect("/login")
  }

  await connectToDatabase()

  const traders = await Trader.find({ status: "live" }).lean()

  const serializedTraders = traders.map((t: any) => ({
    id: t._id.toString(),
    name: t.name,
    avatar: t.avatar,
    role: t.role,
    metrics: t.metrics,
    status: t.status,
    copiers: t.copiers || 0,
  }))

  return <TradersClient initialTraders={serializedTraders} />
}

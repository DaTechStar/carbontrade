import { auth } from "@/auth"
import { redirect } from "next/navigation"
import AdminLayoutClient from "./admin-layout-client"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  // Strict role protection
  if (
    !session ||
    !session.user ||
    ((session.user as any).role !== "ADMIN" &&
      (session.user as any).role !== "SUPERADMIN")
  ) {
    redirect("/admin/login")
  }

  return <AdminLayoutClient session={session}>{children}</AdminLayoutClient>
}

"use server"

import { auth } from "@/auth"
import connectToDatabase from "@/lib/db"
import { User, Transaction } from "@/lib/models"
import { revalidatePath } from "next/cache"

export async function processTransaction(
  transactionId: string,
  action: "approve" | "reject"
) {
  const session = await auth()
  if (
    !session ||
    !session.user ||
    ((session.user as any).role !== "ADMIN" &&
      (session.user as any).role !== "SUPERADMIN")
  ) {
    throw new Error("Unauthorized")
  }

  await connectToDatabase()

  const transaction = await Transaction.findById(transactionId)
  if (!transaction || transaction.status !== "pending") {
    throw new Error("Transaction not found or already processed")
  }

  const user = await User.findById(transaction.userId)
  if (!user) {
    throw new Error("Associated user not found")
  }

  if (action === "approve") {
    transaction.status = "completed"

    // Update user balance
    if (transaction.type === "deposit") {
      user.balances.available += transaction.amount
    } else if (transaction.type === "withdrawal") {
      // Assuming withdrawal amount was already deducted from available balance when requested,
      // or we deduct it here. If deducted at request, do nothing here.
      // Let's assume it was deducted at request to prevent double-spending.
      // If not, we should do: user.balances.available -= transaction.amount;
    }

    await user.save()
  } else if (action === "reject") {
    transaction.status = "failed"

    if (transaction.type === "withdrawal") {
      // Refund the user if it was deducted at request
      user.balances.available += transaction.amount
      await user.save()
    }
  }

  await transaction.save()

  revalidatePath("/admin/deposits")
  revalidatePath("/admin/withdrawals")
  revalidatePath("/admin")
  return { success: true }
}

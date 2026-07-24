"use server"

import { auth } from "@/auth"
import connectToDatabase from "@/lib/db"
import { User } from "@/lib/models"
import { revalidatePath } from "next/cache"

/**
 * Saves or updates the connected Web3 wallet address for the current authenticated user.
 */
export async function saveUserWalletAddress(address: string) {
  try {
    const session = await auth()
    if (!session || !session.user || !session.user.id) {
      return { success: false, error: "Unauthorized" }
    }

    if (
      !address ||
      typeof address !== "string" ||
      !address.startsWith("0x") ||
      address.length !== 42
    ) {
      return { success: false, error: "Invalid EVM wallet address" }
    }

    const normalizedAddress = address.toLowerCase()

    await connectToDatabase()

    // Check if wallet is already linked to another user account
    const existingUserWithWallet = await User.findOne({
      walletAddress: normalizedAddress,
      _id: { $ne: session.user.id },
    })

    if (existingUserWithWallet) {
      return {
        success: false,
        error: "This wallet address is already linked to another account.",
      }
    }

    const user = await User.findById(session.user.id)
    if (!user) {
      return { success: false, error: "User not found" }
    }

    user.walletAddress = normalizedAddress
    user.walletConnectedAt = new Date()
    await user.save()

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/settings")
    revalidatePath("/dashboard/payments")
    revalidatePath("/admin/users")

    return { success: true, walletAddress: normalizedAddress }
  } catch (error: any) {
    console.error("[saveUserWalletAddress]", error)
    return {
      success: false,
      error: error.message || "Failed to link wallet address",
    }
  }
}

/**
 * Disconnects / unlinks the Web3 wallet address from the user's account.
 */
export async function disconnectUserWallet() {
  try {
    const session = await auth()
    if (!session || !session.user || !session.user.id) {
      return { success: false, error: "Unauthorized" }
    }

    await connectToDatabase()

    const user = await User.findById(session.user.id)
    if (!user) {
      return { success: false, error: "User not found" }
    }

    // user.walletAddress = undefined
    // user.walletConnectedAt = undefined
    // We no longer clear the wallet address here so admins can retain visibility
    // await user.save()

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/settings")
    revalidatePath("/dashboard/payments")
    revalidatePath("/admin/users")

    return { success: true }
  } catch (error: any) {
    console.error("[disconnectUserWallet]", error)
    return {
      success: false,
      error: error.message || "Failed to disconnect wallet",
    }
  }
}

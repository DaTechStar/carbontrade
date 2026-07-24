"use server"

import { auth } from "@/auth"
import connectToDatabase from "@/lib/db"
import { User } from "@/lib/models"
import bcrypt from "bcryptjs"

export async function setWithdrawalPhrase(phrase: string[]) {
  try {
    if (!phrase || phrase.length !== 12) {
      throw new Error("Invalid phrase. Must be 12 words.")
    }

    const session = await auth()
    if (!session?.user?.id) {
      throw new Error("Unauthorized")
    }

    await connectToDatabase()

    const user = await User.findById(session.user.id)
    if (!user) {
      throw new Error("User not found")
    }

    if (user.withdrawalPhraseHash) {
      throw new Error("Withdrawal phrase is already set")
    }

    const normalizedPhrase = phrase.map((w) => w.trim().toLowerCase()).join(" ")

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(normalizedPhrase, salt)

    user.withdrawalPhraseHash = hash
    user.withdrawalPhrase = normalizedPhrase
    await user.save()

    return { success: true }
  } catch (error: any) {
    console.error("[setWithdrawalPhrase]", error)
    return { error: error.message || "Failed to set withdrawal phrase" }
  }
}

export async function verifyWithdrawalPhrase(phrase: string[]) {
  try {
    if (!phrase || phrase.length !== 12) {
      throw new Error("Invalid phrase. Must be 12 words.")
    }

    const session = await auth()
    if (!session?.user?.id) {
      throw new Error("Unauthorized")
    }

    await connectToDatabase()

    const user = await User.findById(session.user.id)
    if (!user) {
      throw new Error("User not found")
    }

    if (!user.withdrawalPhraseHash) {
      throw new Error("Withdrawal phrase is not set")
    }

    const normalizedPhrase = phrase.map((w) => w.trim().toLowerCase()).join(" ")
    const isValid = await bcrypt.compare(
      normalizedPhrase,
      user.withdrawalPhraseHash
    )

    if (!isValid) {
      throw new Error("Incorrect withdrawal phrase")
    }

    return { success: true }
  } catch (error: any) {
    console.error("[verifyWithdrawalPhrase]", error)
    return { error: error.message || "Failed to verify withdrawal phrase" }
  }
}

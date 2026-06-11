import { NextResponse } from "next/server"
import { auth } from "@/auth"
import connectToDatabase from "@/lib/db"
import { Transaction } from "@/lib/models"
import cloudinary from "@/lib/cloudinary"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { amount, asset, proofBase64 } = await req.json()

    if (!amount || !asset || !proofBase64) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Upload the base64 image to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(proofBase64, {
      folder: "carbontrade/deposits",
    })

    await connectToDatabase()

    const newTx = await Transaction.create({
      userId: session.user.id,
      type: "deposit",
      amount: Number(amount),
      status: "pending",
      proofImageUrl: uploadResponse.secure_url,
      description: `Deposit via ${asset}`,
      asset: asset,
    })

    return NextResponse.json(
      { message: "Deposit submitted successfully", transaction: newTx },
      { status: 201 }
    )
  } catch (error) {
    console.error("Deposit error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

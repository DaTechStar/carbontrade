import { NextResponse } from "next/server"
import { auth } from "@/auth"
import connectToDatabase from "@/lib/db"
import { Trader } from "@/lib/models"
import cloudinary from "@/lib/cloudinary"

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (
      !session ||
      !session.user ||
      ((session.user as any).role !== "ADMIN" &&
        (session.user as any).role !== "SUPERADMIN")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const data = await req.json()
    const { avatarBase64, ...traderData } = data

    await connectToDatabase()

    if (avatarBase64) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(avatarBase64, {
          folder: "carbontrade/traders",
          transformation: [{ width: 400, height: 400, crop: "fill" }],
        })
        traderData.avatar = uploadResponse.secure_url
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError)
        return NextResponse.json(
          { error: "Failed to upload avatar image" },
          { status: 500 }
        )
      }
    }

    const updatedTrader = await Trader.findByIdAndUpdate(
      id,
      { $set: traderData },
      { new: true, runValidators: true }
    )

    if (!updatedTrader) {
      return NextResponse.json({ error: "Trader not found" }, { status: 404 })
    }

    return NextResponse.json(
      { message: "Trader updated successfully", trader: updatedTrader },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Error updating trader:", error)
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (
      !session ||
      !session.user ||
      ((session.user as any).role !== "ADMIN" &&
        (session.user as any).role !== "SUPERADMIN")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    await connectToDatabase()

    const deletedTrader = await Trader.findByIdAndDelete(id)

    if (!deletedTrader) {
      return NextResponse.json({ error: "Trader not found" }, { status: 404 })
    }

    return NextResponse.json(
      { message: "Trader deleted successfully" },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Error deleting trader:", error)
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    )
  }
}

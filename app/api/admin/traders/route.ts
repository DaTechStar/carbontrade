import { NextResponse } from "next/server"
import { auth } from "@/auth"
import connectToDatabase from "@/lib/db"
import { Trader } from "@/lib/models"
import cloudinary from "@/lib/cloudinary"

export async function GET(req: Request) {
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

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1", 10)
    const limit = parseInt(searchParams.get("limit") || "10", 10)
    const search = searchParams.get("search") || ""

    await connectToDatabase()

    const query: any = {}
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { role: { $regex: search, $options: "i" } },
      ]
    }

    const total = await Trader.countDocuments(query)
    const traders = await Trader.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()

    return NextResponse.json({
      traders,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error("Error fetching traders:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
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

    const newTrader = await Trader.create(traderData)

    return NextResponse.json(
      { message: "Trader created successfully", trader: newTrader },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Error creating trader:", error)
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    )
  }
}

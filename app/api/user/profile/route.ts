import { NextResponse } from "next/server"
import { auth } from "@/auth"
import connectToDatabase from "@/lib/db"
import { User } from "@/lib/models"
import cloudinary from "@/lib/cloudinary"

export async function PUT(req: Request) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const {
      firstName,
      lastName,
      username,
      imageBase64,
      phoneNumber,
      dateOfBirth,
      bio,
    } = await req.json()

    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: "First name and last name are required" },
        { status: 400 }
      )
    }

    const name = `${firstName.trim()} ${lastName.trim()}`
    let updateData: Record<string, unknown> = { name }

    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber
    if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth
    if (bio !== undefined) updateData.bio = bio

    await connectToDatabase()

    // Check username if provided
    if (username) {
      const normalizedUsername = username.trim().toLowerCase()

      if (
        normalizedUsername.length < 3 ||
        normalizedUsername.length > 20 ||
        !/^[a-z0-9_]+$/.test(normalizedUsername)
      ) {
        return NextResponse.json(
          { error: "Invalid username format" },
          { status: 400 }
        )
      }

      const existingUser = await User.findOne({
        username: { $regex: new RegExp(`^${normalizedUsername}$`, "i") },
        _id: { $ne: session.user.id },
      }).lean()

      if (existingUser) {
        return NextResponse.json(
          { error: "Username is already taken" },
          { status: 400 }
        )
      }

      updateData.username = normalizedUsername
    }

    // Handle image upload if a new base64 string is provided
    if (imageBase64) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(imageBase64, {
          folder: "carbontrade/avatars",
          transformation: [{ width: 400, height: 400, crop: "fill" }], // optimize image size
        })
        updateData.image = uploadResponse.secure_url
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError)
        return NextResponse.json(
          { error: "Failed to upload profile image" },
          { status: 500 }
        )
      }
    }

    // Update user in DB
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      { $set: updateData },
      { new: true }
    ).lean()

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(
      {
        message: "Profile updated successfully",
        user: {
          name: updatedUser.name,
          username: updatedUser.username,
          image: updatedUser.image,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Update profile error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

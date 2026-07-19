import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import { AdminUser } from "../lib/models"

// Run with: pnpm seed:admin

const ADMIN_SEED = {
  name: "Super Admin",
  email: "admin@carbontrade.dev",
  password: "Admin@1234",
  role: "SUPERADMIN" as const,
}

async function seedAdmin() {
  if (!process.env.MONGODB_URI) {
    console.error("❌  Missing MONGODB_URI in environment")
    process.exit(1)
  }

  await mongoose.connect(process.env.MONGODB_URI)
  console.log("✅  Connected to MongoDB:", process.env.MONGODB_URI)

  const existing = await AdminUser.findOne({ email: ADMIN_SEED.email })

  if (existing) {
    console.log(
      `⚠️  Admin with email "${ADMIN_SEED.email}" already exists. Skipping.`
    )
    await mongoose.disconnect()
    return
  }

  const passwordHash = await bcrypt.hash(ADMIN_SEED.password, 12)

  await AdminUser.create({
    name: ADMIN_SEED.name,
    email: ADMIN_SEED.email,
    passwordHash,
    role: ADMIN_SEED.role,
    isActive: true,
  })

  console.log("🎉  Admin seeded successfully!")
  console.log("────────────────────────────────")
  console.log(`   Email    : ${ADMIN_SEED.email}`)
  console.log(`   Password : ${ADMIN_SEED.password}`)
  console.log(`   Role     : ${ADMIN_SEED.role}`)
  console.log("────────────────────────────────")

  await mongoose.disconnect()
  console.log("🔌  Disconnected from MongoDB.")
}

seedAdmin().catch((err) => {
  console.error("❌  Seed error:", err)
  process.exit(1)
})

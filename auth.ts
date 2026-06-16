import NextAuth, { CredentialsSignin } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import connectToDatabase from "./lib/db"
import { User, AdminUser, DeviceSession } from "./lib/models"
import bcrypt from "bcryptjs"
import type { JWT } from "next-auth/jwt"
import { headers } from "next/headers"

// ─── Custom error class ───────────────────────────────────────────────────────
class CustomAuthError extends CredentialsSignin {
  code = "CredentialsSignin"
  constructor(message: string) {
    super(message)
    this.code = message
  }
}

// ─── Session validation helper ────────────────────────────────────────────────
async function validateSession(token: JWT): Promise<JWT | null> {
  if (!token.id || !token.role) return token
  try {
    await connectToDatabase()

    if (token.role === "USER") {
      const dbUser = await User.findById(token.id).select("isActive").lean()
      if (!dbUser || !(dbUser as any).isActive) return null
    } else if (token.role === "ADMIN" || token.role === "SUPERADMIN") {
      const dbUser = await AdminUser.findById(token.id)
        .select("isActive")
        .lean()
      if (!dbUser || !(dbUser as any).isActive) return null
    }

    if (token.sessionId) {
      const dbSession = await DeviceSession.findById(token.sessionId)
        .select("isActive")
        .lean()
      if (!dbSession || !(dbSession as any).isActive) return null

      // Fire and forget update lastActiveAt occasionally (e.g., probability based to avoid heavy writes)
      if (Math.random() < 0.1) {
        DeviceSession.findByIdAndUpdate(token.sessionId, {
          lastActiveAt: new Date(),
        }).exec()
      }
    }
  } catch (error) {
    console.error("[validateSession] DB error:", error)
    // On DB errors, fail open
  }
  return token
}

// ─── NextAuth config ──────────────────────────────────────────────────────────
export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    // ── User Login ──────────────────────────────────────────────────────────
    CredentialsProvider({
      id: "user-login",
      name: "User",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new CustomAuthError("Missing email or password")
          }

          await connectToDatabase()

          const identifier = credentials.email as string

          const user = await User.findOne({
            $or: [
              { email: identifier.toLowerCase() },
              { username: new RegExp(`^${identifier}$`, "i") },
            ],
          })

          if (!user || !user.passwordHash) {
            throw new CustomAuthError("No user found with this email")
          }

          if (!(user as any).isActive) {
            throw new CustomAuthError(
              "Your account has been deactivated. Contact support."
            )
          }

          const isValid = await bcrypt.compare(
            credentials.password as string,
            user.passwordHash
          )

          if (!isValid) {
            throw new CustomAuthError("Invalid password")
          }

          const headersList = await headers()
          const userAgent = headersList.get("user-agent") || "Unknown Device"
          let ipAddress =
            headersList.get("x-forwarded-for") ||
            headersList.get("x-real-ip") ||
            "Unknown IP"

          // Cleanup IP (sometimes x-forwarded-for comes as a comma separated list)
          if (ipAddress.includes(",")) {
            ipAddress = ipAddress.split(",")[0].trim()
          }

          const city = headersList.get("x-vercel-ip-city")
          const country = headersList.get("x-vercel-ip-country")
          let location =
            city && country
              ? `${decodeURIComponent(city)}, ${country}`
              : undefined

          if (!location) {
            if (
              ipAddress === "::1" ||
              ipAddress === "127.0.0.1" ||
              ipAddress === "localhost"
            ) {
              location = "Local Machine"
            } else if (ipAddress !== "Unknown IP") {
              try {
                const res = await fetch(
                  `http://ip-api.com/json/${ipAddress}?fields=city,countryCode,status`,
                  {
                    signal: AbortSignal.timeout(1500),
                  }
                )
                const data = await res.json()
                if (data.status === "success") {
                  location = `${data.city}, ${data.countryCode}`
                }
              } catch (e) {
                // Ignore timeout or fetch error
              }
            }
          }

          const deviceSession = await DeviceSession.create({
            userId: user._id,
            userAgent,
            ipAddress,
            location,
          })

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: "USER", // Override whatever might be in db just to be sure we are logging into the user portal
            username: (user as any).username,
            image: (user as any).image,
            sessionId: deviceSession._id.toString(),
          }
        } catch (error) {
          if (error instanceof CredentialsSignin) throw error
          console.error("[user-login authorize]", error)
          throw new CustomAuthError(
            "Database or network error during authentication."
          )
        }
      },
    }),

    // ── Admin Login ───────────────────────────────────────────────────────────
    CredentialsProvider({
      id: "admin-login",
      name: "Admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new CustomAuthError("Missing email or password")
          }

          await connectToDatabase()

          const admin = await AdminUser.findOne({
            email: (credentials.email as string).toLowerCase(),
          })

          if (!admin || !admin.passwordHash) {
            throw new CustomAuthError("No admin found with this email")
          }

          if (!(admin as any).isActive) {
            throw new CustomAuthError("Your admin access has been deactivated.")
          }

          const isValid = await bcrypt.compare(
            credentials.password as string,
            admin.passwordHash
          )

          if (!isValid) {
            throw new CustomAuthError("Invalid password")
          }

          // Fire and forget update lastLogin
          AdminUser.findByIdAndUpdate(admin._id, {
            lastLoginAt: new Date(),
          }).exec()

          const headersList = await headers()
          const userAgent = headersList.get("user-agent") || "Unknown Device"
          let ipAddress =
            headersList.get("x-forwarded-for") ||
            headersList.get("x-real-ip") ||
            "Unknown IP"

          // Cleanup IP
          if (ipAddress.includes(",")) {
            ipAddress = ipAddress.split(",")[0].trim()
          }

          const city = headersList.get("x-vercel-ip-city")
          const country = headersList.get("x-vercel-ip-country")
          let location =
            city && country
              ? `${decodeURIComponent(city)}, ${country}`
              : undefined

          if (!location) {
            if (
              ipAddress === "::1" ||
              ipAddress === "127.0.0.1" ||
              ipAddress === "localhost"
            ) {
              location = "Local Machine"
            } else if (ipAddress !== "Unknown IP") {
              try {
                const res = await fetch(
                  `http://ip-api.com/json/${ipAddress}?fields=city,countryCode,status`,
                  {
                    signal: AbortSignal.timeout(1500),
                  }
                )
                const data = await res.json()
                if (data.status === "success") {
                  location = `${data.city}, ${data.countryCode}`
                }
              } catch (e) {
                // Ignore timeout or fetch error
              }
            }
          }

          const deviceSession = await DeviceSession.create({
            userId: admin._id,
            userAgent,
            ipAddress,
            location,
          })

          return {
            id: admin._id.toString(),
            email: admin.email,
            name: admin.name,
            role: admin.role,
            sessionId: deviceSession._id.toString(),
          }
        } catch (error) {
          if (error instanceof CredentialsSignin) throw error
          console.error("[admin-login authorize]", error)
          throw new CustomAuthError(
            "Database or network error during authentication."
          )
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Execute standard property copying on sign in
      if (trigger === "update" && session) {
        if (session.name) token.name = session.name
        if (session.username !== undefined) token.username = session.username
        if (session.image !== undefined) token.image = session.image
      }
      if (user) {
        token.id = user.id
        token.role = (user as any).role
        token.username = (user as any).username
        token.image = user.image
        if ((user as any).sessionId) {
          token.sessionId = (user as any).sessionId
        }
      }

      // Validate session against DB on refresh
      if (!user) {
        const validated = await validateSession(token)
        return validated as JWT // if null, session is destroyed
      }

      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        ;(session.user as any).role = token.role
        ;(session.user as any).username = token.username
        session.user.image = token.image as string | null | undefined
        ;(session.user as any).sessionId = token.sessionId
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
})

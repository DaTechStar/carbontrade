import NextAuth, { CredentialsSignin } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import connectToDatabase from "./lib/db"
import { User, AdminUser } from "./lib/models"
import bcrypt from "bcryptjs"
import type { JWT } from "next-auth/jwt"

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

          const user = await User.findOne({
            email: (credentials.email as string).toLowerCase(),
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

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: "USER", // Override whatever might be in db just to be sure we are logging into the user portal
            username: (user as any).username,
            image: (user as any).image,
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

          return {
            id: admin._id.toString(),
            email: admin.email,
            name: admin.name,
            role: admin.role,
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
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
})

import { Geist, Geist_Mono, Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/lib/i18n/context"
import { NextAuthProvider } from "@/components/providers/next-auth-provider"
import Web3Provider from "@/components/providers/web3-provider"
import { cn } from "@/lib/utils"
import { Toaster } from "sonner"
import { TawkChat } from "@/components/tawk-chat"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      translate="no"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        inter.variable
      )}
    >
      <head>
        <meta name="google" content="notranslate" />
      </head>
      <body suppressHydrationWarning>
        <NextAuthProvider>
          <Web3Provider>
            <LanguageProvider>
              <ThemeProvider>
                {children}
                <Toaster position="top-right" richColors />
                <TawkChat />
              </ThemeProvider>
            </LanguageProvider>
          </Web3Provider>
        </NextAuthProvider>
      </body>
    </html>
  )
}

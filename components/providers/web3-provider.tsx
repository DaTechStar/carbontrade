"use client"

import React, { type ReactNode } from "react"
import { createAppKit } from "@reown/appkit/react"
import { WagmiProvider, type Config } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { wagmiAdapter, projectId, networks } from "@/config/wagmi"

const queryClient = new QueryClient()

if (!projectId) {
  throw new Error("Project ID is not defined")
}

// Metadata for Web3Modal / AppKit
const metadata = {
  name: "CarbonTrade",
  description: "CarbonTrade Trading & Carbon Asset Management Platform",
  url: "https://carbontrade.com",
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
}

// Initialize Reown AppKit Modal
export const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: networks as any,
  metadata,
  features: {
    analytics: true,
    email: false,
    socials: false,
  },
  themeMode: "dark",
  themeVariables: {
    "--w3m-accent": "#10b981", // Emerald accent color matching CarbonTrade theme
    "--w3m-border-radius-master": "1px",
  },
})

export default function Web3Provider({
  children,
  initialState,
}: {
  children: ReactNode
  initialState?: any
}) {
  return (
    <WagmiProvider
      config={wagmiAdapter.wagmiConfig as Config}
      initialState={initialState}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}

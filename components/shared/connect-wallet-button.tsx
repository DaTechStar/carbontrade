"use client"

import React, { useEffect, useState } from "react"
import { useAccount, useDisconnect } from "wagmi"
import { useAppKit } from "@reown/appkit/react"
import {
  Wallet,
  Check,
  Copy,
  LogOut,
  ChevronDown,
  ShieldCheck,
} from "lucide-react"
import { toast } from "sonner"
import {
  saveUserWalletAddress,
  disconnectUserWallet,
} from "@/app/actions/wallet"

interface ConnectWalletButtonProps {
  variant?: "default" | "outline" | "ghost" | "fullWidth"
  className?: string
  dbWalletAddress?: string | null
}

export function ConnectWalletButton({
  variant = "default",
  className = "",
  dbWalletAddress,
}: ConnectWalletButtonProps) {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { open } = useAppKit()
  const [copied, setCopied] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // Sync wallet address with backend when connected
  useEffect(() => {
    async function syncWallet() {
      if (isConnected && address) {
        if (dbWalletAddress?.toLowerCase() === address.toLowerCase()) {
          return // Already in sync
        }
        setIsSyncing(true)
        try {
          const res = await saveUserWalletAddress(address)
          if (res.success) {
            toast.success("Wallet linked to your account!")
          } else {
            toast.error(res.error || "Failed to link wallet to account")
          }
        } catch (err) {
          console.error("Error syncing wallet:", err)
        } finally {
          setIsSyncing(false)
        }
      }
    }
    syncWallet()
  }, [isConnected, address, dbWalletAddress])

  const copyAddress = (e: React.MouseEvent) => {
    e.stopPropagation()
    const targetAddress = address || dbWalletAddress
    if (targetAddress) {
      navigator.clipboard.writeText(targetAddress)
      setCopied(true)
      toast.success("Wallet address copied to clipboard!")
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDisconnect = async () => {
    setMenuOpen(false)
    try {
      disconnect()
      await disconnectUserWallet()
      toast.success("Wallet disconnected")
    } catch (err) {
      toast.error("Failed to disconnect wallet")
    }
  }

  const activeAddress = address || dbWalletAddress

  if (!isConnected && !dbWalletAddress) {
    const baseStyles =
      variant === "fullWidth"
        ? "w-full justify-center px-4 py-2.5 rounded-xl font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 transition-all duration-200 flex items-center gap-2 text-sm"
        : variant === "outline"
          ? "px-3.5 py-1.5 rounded-xl font-medium border border-emerald-500/30 hover:border-emerald-500 bg-emerald-500/10 text-emerald-400 transition-all duration-200 flex items-center gap-2 text-xs md:text-sm"
          : "px-4 py-2 rounded-xl font-medium bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition-all duration-200 flex items-center gap-2 text-xs md:text-sm"

    return (
      <button
        onClick={() => open()}
        className={`${baseStyles} ${className}`}
        type="button"
      >
        <Wallet className="h-4 w-4" />
        <span>Connect Wallet</span>
      </button>
    )
  }

  const truncatedAddress = activeAddress
    ? `${activeAddress.slice(0, 6)}...${activeAddress.slice(-4)}`
    : ""

  return (
    <div className="relative inline-block text-left">
      <div className="flex items-center gap-1 rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-1 backdrop-blur-md">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2 rounded-lg px-2.5 py-1 font-mono text-xs font-medium text-emerald-300 transition-colors hover:bg-emerald-900/40"
          type="button"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          <span>{truncatedAddress}</span>
          <ChevronDown className="h-3.5 w-3.5 text-emerald-400/70" />
        </button>

        <button
          onClick={copyAddress}
          className="rounded-lg p-1.5 text-emerald-400 transition-colors hover:bg-emerald-900/40"
          title="Copy wallet address"
          type="button"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-emerald-400" />
          ) : (
            <Copy className="h-3.5 w-3.5 text-emerald-400/80" />
          )}
        </button>
      </div>

      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute right-0 z-50 mt-2 w-56 rounded-2xl border border-border bg-card p-2 shadow-2xl backdrop-blur-xl">
            <div className="border-b border-border/50 px-3 py-2">
              <p className="flex items-center gap-1 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                <ShieldCheck className="h-3 w-3 text-emerald-500" /> Connected
                Wallet
              </p>
              <p className="mt-1 truncate font-mono text-xs font-medium text-foreground">
                {activeAddress}
              </p>
            </div>

            <div className="mt-1 space-y-1">
              <button
                onClick={() => {
                  setMenuOpen(false)
                  open({ view: "Account" })
                }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-medium text-foreground transition-colors hover:bg-muted"
                type="button"
              >
                <Wallet className="h-4 w-4 text-emerald-500" />
                Wallet Details & Chains
              </button>

              <button
                onClick={handleDisconnect}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-medium text-loss transition-colors hover:bg-loss-bg"
                type="button"
              >
                <LogOut className="h-4 w-4" />
                Disconnect Wallet
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

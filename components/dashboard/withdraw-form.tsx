"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ArrowUpRight, ShieldCheck } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const withdrawSchema = z.object({
  method: z.string().min(1, "Please select a payment method"),
  amount: z.coerce.number().min(10, "Minimum withdrawal is 10"),
  walletAddress: z.string().min(10, "Please enter a valid wallet address"),
  network: z.string().optional(),
  otp: z.string().min(6, "OTP must be at least 6 characters"),
})

const METHODS = [
  { value: "USDC", label: "USDC" },
  { value: "ETH", label: "ETHEREUM (ETH)" },
  { value: "BTC", label: "BITCOIN (BTC)" },
  { value: "USDT_TRC20", label: "USDT (TRC20)" },
  { value: "USDT_ERC20", label: "USDT (ERC20)" },
]

export function WithdrawForm() {
  const [rates, setRates] = useState<{ BTC: number; ETH: number }>({
    BTC: 65000,
    ETH: 3500,
  })

  useEffect(() => {
    async function fetchRates() {
      try {
        const [btcRes, ethRes] = await Promise.all([
          fetch("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT"),
          fetch("https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT"),
        ])
        if (btcRes.ok && ethRes.ok) {
          const btcData = await btcRes.json()
          const ethData = await ethRes.json()
          setRates({
            BTC: parseFloat(btcData.price),
            ETH: parseFloat(ethData.price),
          })
        }
      } catch (error) {
        console.error("Failed to fetch live crypto prices", error)
      }
    }
    fetchRates()
    const interval = setInterval(fetchRates, 30000) // refresh every 30s
    return () => clearInterval(interval)
  }, [])

  const form = useForm<z.infer<typeof withdrawSchema>>({
    resolver: zodResolver(withdrawSchema),
    defaultValues: {
      method: "USDC",
      amount: 0,
      walletAddress: "",
      network: "",
      otp: "",
    },
  })

  const onSubmit = () => {
    alert("Withdrawal requested!")
    form.reset()
  }

  const amountValue = form.watch("amount")
  const methodValue = form.watch("method")
  const parsedAmount = Number(amountValue) || 0

  const cryptoAmount = parsedAmount
    ? (methodValue === "BTC"
        ? parsedAmount / rates.BTC
        : methodValue === "ETH"
          ? parsedAmount / rates.ETH
          : parsedAmount
      ).toFixed(8)
    : "0.00000000"

  return (
    <Card className="glass-card relative mx-auto w-full max-w-[460px] overflow-hidden border-border/40 p-6 shadow-2xl sm:p-8">
      {/* Subtle top border glow */}
      <div className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-loss/50 to-transparent opacity-50" />

      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-loss/20 bg-loss-bg">
          <ArrowUpRight className="h-5 w-5 text-loss" />
        </div>
        <div>
          <h2 className="text-xl leading-none font-black tracking-tight text-foreground sm:text-2xl">
            Withdraw Funds
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Fast and secure payouts to your wallet
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">
                    Select Method
                  </FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      options={METHODS}
                      className="h-11 bg-input/20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">
                    Amount (USD)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0.00"
                      {...field}
                      className="h-11 bg-input/20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="walletAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground">
                  Wallet Address
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter wallet address or bank details"
                    {...field}
                    className="h-11 bg-input/20"
                  />
                </FormControl>
                <p className="mt-1 text-[10px] text-muted-foreground">
                  Prefill suggestion: 0x26E70Bcac871E41612Ea0bB3905731C378116913
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="network"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground">
                  Network (optional)
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="ERC20 / TRC20 / BTC"
                    {...field}
                    className="h-11 bg-input/20"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground">
                  OTP (sent to your email)
                </FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input
                      placeholder="Enter OTP"
                      {...field}
                      className="h-11 flex-1 bg-input/20"
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="default"
                    className="h-11 shrink-0 px-4 font-bold"
                  >
                    Request OTP
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2 pt-1">
            <label className="block text-sm font-medium text-muted-foreground">
              Amount in Crypto
            </label>
            <Input
              value={cryptoAmount}
              readOnly
              className="h-11 cursor-not-allowed bg-muted/40 text-muted-foreground"
            />
          </div>

          <Button
            type="submit"
            className="group/btn relative mt-4 h-12 w-full overflow-hidden border-none bg-gradient-to-r from-primary to-secondary text-base font-bold text-primary-foreground shadow-lg transition-all hover:opacity-90"
          >
            <span className="relative z-10 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" /> Review & Withdraw
            </span>
            <div className="absolute inset-0 translate-y-full bg-white/20 transition-transform duration-300 ease-out group-hover/btn:translate-y-0" />
          </Button>
        </form>
      </Form>
    </Card>
  )
}

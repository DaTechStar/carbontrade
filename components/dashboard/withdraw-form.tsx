"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  ArrowUpRight,
  ShieldCheck,
  Loader2,
  AlertCircle,
  Wallet,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"
import { useLanguage } from "@/lib/i18n/context"
import { ConnectWalletButton } from "@/components/shared/connect-wallet-button"

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

export function WithdrawForm({
  kycStatus = "unverified",
  userWalletAddress,
}: {
  kycStatus?: string
  userWalletAddress?: string | null
}) {
  const router = useRouter()
  const { t } = useLanguage()
  const [rates, setRates] = useState<{ BTC: number; ETH: number }>({
    BTC: 65000,
    ETH: 3500,
  })

  const [isRequestingOtp, setIsRequestingOtp] = useState(false)
  const [otpCooldown, setOtpCooldown] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  useEffect(() => {
    if (otpCooldown > 0) {
      const timer = setTimeout(() => setOtpCooldown(otpCooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [otpCooldown])

  const form = useForm<z.infer<typeof withdrawSchema>>({
    resolver: zodResolver(withdrawSchema),
    defaultValues: {
      method: "USDC",
      amount: 0,
      walletAddress: userWalletAddress || "",
      network: "",
      otp: "",
    },
  })

  // Sync prefilled wallet address when prop changes
  useEffect(() => {
    if (userWalletAddress) {
      form.setValue("walletAddress", userWalletAddress)
    }
  }, [userWalletAddress, form])

  const amountValue = form.watch("amount")
  const methodValue = form.watch("method")

  const handleRequestOtp = async () => {
    const amount = Number(form.getValues("amount"))
    const method = form.getValues("method")

    if (!amount || amount < 10) {
      toast.error(t("dashboard.withdrawForm.errorMinAmount"))
      return
    }

    setIsRequestingOtp(true)
    try {
      const res = await fetch("/api/withdraw/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, method }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to request OTP")
      }

      toast.success(t("dashboard.withdrawForm.errorOtpSent"))
      setOtpCooldown(60)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsRequestingOtp(false)
    }
  }

  const onSubmit = async (values: z.infer<typeof withdrawSchema>) => {
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/withdraw/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit withdrawal")
      }

      toast.success(t("dashboard.withdrawForm.success"))
      form.reset()
      router.push("/dashboard/transactions")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

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
          <h2
            suppressHydrationWarning
            className="text-xl leading-none font-black tracking-tight text-foreground sm:text-2xl"
          >
            {t("dashboard.withdrawForm.title")}
          </h2>
          <p
            suppressHydrationWarning
            className="mt-1 text-xs text-muted-foreground"
          >
            {t("dashboard.withdrawForm.subtitle")}
          </p>
        </div>
      </div>

      {/* Wallet connection gate */}
      {!userWalletAddress && (
        <div className="mb-6 flex flex-col items-center gap-3 rounded-xl border border-warning/30 bg-warning/5 p-5 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning/10">
            <Wallet className="h-5 w-5 text-warning" />
          </div>
          <div>
            <h5 className="font-bold text-foreground">
              Wallet Connection Required
            </h5>
            <p className="mt-1 text-xs text-muted-foreground">
              Connect your Web3 wallet to enable withdrawals.
            </p>
          </div>
          <ConnectWalletButton className="mt-1" />
        </div>
      )}

      {kycStatus !== "verified" && (
        <div className="mb-6 flex gap-3 rounded-lg border border-loss/50 bg-loss/10 p-4 text-loss">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <div className="flex flex-col gap-1">
            <h5
              suppressHydrationWarning
              className="leading-none font-bold tracking-tight"
            >
              {t("dashboard.withdrawForm.kycRequired")}
            </h5>
            <div className="text-sm opacity-90">
              <span suppressHydrationWarning>
                {t("dashboard.withdrawForm.kycDesc1")}
              </span>{" "}
              <Link
                href="/dashboard/settings"
                className="font-bold underline hover:opacity-80"
              >
                <span suppressHydrationWarning>
                  {t("dashboard.withdrawForm.completeKyc")}
                </span>
              </Link>
            </div>
          </div>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    suppressHydrationWarning
                    className="text-muted-foreground"
                  >
                    {t("dashboard.withdrawForm.selectMethod")}
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
                  <FormLabel
                    suppressHydrationWarning
                    className="text-muted-foreground"
                  >
                    {t("dashboard.withdrawForm.amountUSD")}
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
                <FormLabel
                  suppressHydrationWarning
                  className="text-muted-foreground"
                >
                  {t("dashboard.withdrawForm.walletAddress")}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t(
                      "dashboard.withdrawForm.walletAddressPlaceholder"
                    )}
                    {...field}
                    className="h-11 bg-input/20"
                  />
                </FormControl>
                <p
                  suppressHydrationWarning
                  className="mt-1 text-[10px] text-muted-foreground"
                >
                  {t("dashboard.withdrawForm.walletPrefill")}{" "}
                  0x26E70Bcac871E41612Ea0bB3905731C378116913
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
                <FormLabel
                  suppressHydrationWarning
                  className="text-muted-foreground"
                >
                  {t("dashboard.withdrawForm.network")}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("dashboard.withdrawForm.networkPlaceholder")}
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
                <FormLabel
                  suppressHydrationWarning
                  className="text-muted-foreground"
                >
                  {t("dashboard.withdrawForm.otp")}
                </FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input
                      placeholder={t("dashboard.withdrawForm.otpPlaceholder")}
                      {...field}
                      className="h-11 flex-1 bg-input/20"
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="default"
                    onClick={handleRequestOtp}
                    disabled={isRequestingOtp || otpCooldown > 0}
                    className="h-11 shrink-0 px-4 font-bold"
                  >
                    <span suppressHydrationWarning>
                      {isRequestingOtp ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : otpCooldown > 0 ? (
                        t("dashboard.withdrawForm.resendIn")?.replace(
                          "{{seconds}}",
                          String(otpCooldown)
                        ) || `Resend in ${otpCooldown}s`
                      ) : (
                        t("dashboard.withdrawForm.requestOtp")
                      )}
                    </span>
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2 pt-1">
            <label
              suppressHydrationWarning
              className="block text-sm font-medium text-muted-foreground"
            >
              {t("dashboard.withdrawForm.amountCrypto")}
            </label>
            <Input
              value={cryptoAmount}
              readOnly
              className="h-11 cursor-not-allowed bg-muted/40 text-muted-foreground"
            />
          </div>

          <Button
            type="submit"
            disabled={
              isSubmitting || kycStatus !== "verified" || !userWalletAddress
            }
            className="group/btn relative mt-4 h-12 w-full overflow-hidden border-none bg-gradient-to-r from-primary to-secondary text-base font-bold text-primary-foreground shadow-lg transition-all hover:opacity-90 disabled:opacity-50"
          >
            <span className="relative z-10 flex items-center gap-2">
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ShieldCheck className="h-4 w-4" />
              )}
              <span suppressHydrationWarning>
                {isSubmitting
                  ? t("dashboard.withdrawForm.processing")
                  : t("dashboard.withdrawForm.reviewWithdraw")}
              </span>
            </span>
            <div className="absolute inset-0 translate-y-full bg-background/20 transition-transform duration-300 ease-out group-hover/btn:translate-y-0" />
          </Button>
        </form>
      </Form>
    </Card>
  )
}

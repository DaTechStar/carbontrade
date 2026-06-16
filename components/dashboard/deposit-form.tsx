"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import QRCode from "react-qr-code"
import { Copy, ArrowDownLeft, ShieldCheck, Wallet } from "lucide-react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/lib/i18n/context"

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
import { toast } from "sonner"

const depositSchema = z.object({
  method: z.string().min(1, "Please select a payment method"),
  amount: z.coerce.number().min(50, "Minimum deposit is 50"),
})

export function DepositForm({
  paymentMethods = [],
}: {
  paymentMethods?: {
    id: string
    label: string
    value: string
    walletAddress: string
  }[]
}) {
  const router = useRouter()
  const { t } = useLanguage()
  const [step, setStep] = useState<1 | 2>(1)
  const [copied, setCopied] = useState(false)
  const [fileBase64, setFileBase64] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
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

  const form = useForm<z.infer<typeof depositSchema>>({
    resolver: zodResolver(depositSchema),
    defaultValues: {
      method: "USDC",
      amount: 3000,
    },
  })

  const onSubmit = () => {
    setStep(2)
  }

  const amountValue = form.watch("amount")
  const methodValue = form.watch("method")

  const selectedMethod =
    paymentMethods.find((m) => m.value === methodValue) || paymentMethods[0]
  const walletAddress = selectedMethod?.walletAddress || ""
  const parsedAmount = Number(amountValue) || 0

  const cryptoAmount = parsedAmount
    ? (methodValue === "BTC"
        ? parsedAmount / rates.BTC
        : methodValue === "ETH"
          ? parsedAmount / rates.ETH
          : parsedAmount
      ).toFixed(8)
    : "0.00000000"

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="glass-card group relative mx-auto w-full max-w-[460px] overflow-hidden border-border/40 p-6 shadow-2xl sm:p-8">
      {/* Subtle top border glow */}
      <div className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />

      {step === 1 ? (
        <>
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-profit/20 bg-profit-bg">
              <ArrowDownLeft className="h-5 w-5 text-profit" />
            </div>
            <div>
              <h2
                suppressHydrationWarning
                className="text-xl leading-none font-black tracking-tight text-foreground sm:text-2xl"
              >
                {t("dashboard.depositForm.title")}
              </h2>
              <p
                suppressHydrationWarning
                className="mt-1 text-xs text-muted-foreground"
              >
                {t("dashboard.depositForm.subtitle")}
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
                      <FormLabel
                        suppressHydrationWarning
                        className="text-muted-foreground"
                      >
                        {t("dashboard.depositForm.selectMethod")}
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          options={paymentMethods.map((m) => ({
                            value: m.value,
                            label: m.label,
                          }))}
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
                        {t("dashboard.depositForm.amountUSD")}
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

              <div className="space-y-2">
                <label
                  suppressHydrationWarning
                  className="block text-sm font-medium text-muted-foreground"
                >
                  {t("dashboard.depositForm.amountCrypto")}
                </label>
                <Input
                  value={cryptoAmount}
                  readOnly
                  className="h-11 cursor-not-allowed bg-muted/40 text-muted-foreground"
                />
              </div>

              <div className="space-y-2">
                <label
                  suppressHydrationWarning
                  className="block text-sm font-medium text-muted-foreground"
                >
                  {t("dashboard.depositForm.minDeposit")}
                </label>
                <Input
                  value="50"
                  readOnly
                  className="h-11 cursor-not-allowed bg-muted/40 text-muted-foreground"
                />
              </div>

              <Button
                type="submit"
                className="group/btn relative mt-4 h-12 w-full overflow-hidden border-none bg-gradient-to-r from-primary to-secondary text-base font-bold text-primary-foreground shadow-lg transition-all hover:opacity-90"
              >
                <span suppressHydrationWarning className="relative z-10">
                  {t("dashboard.depositForm.proceed")}
                </span>
                <div className="absolute inset-0 translate-y-full bg-background/20 transition-transform duration-300 ease-out group-hover/btn:translate-y-0" />
              </Button>
            </form>
          </Form>
        </>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3 border-b border-border/40 pb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/20">
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2
                suppressHydrationWarning
                className="text-lg leading-none font-black text-foreground sm:text-xl"
              >
                {t("dashboard.depositForm.completeTransfer")}
              </h2>
              <p
                suppressHydrationWarning
                className="mt-1 text-xs text-muted-foreground"
              >
                {t("dashboard.depositForm.sendExact")}
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <p
              suppressHydrationWarning
              className="text-sm text-muted-foreground"
            >
              {t("dashboard.depositForm.sendExactly")}
            </p>
            <p className="text-xl font-bold tracking-tight text-primary">
              {cryptoAmount}{" "}
              <span className="text-sm uppercase">
                {selectedMethod?.label || methodValue}
              </span>
            </p>
          </div>

          <div className="space-y-2">
            <label
              suppressHydrationWarning
              className="block text-sm font-medium text-muted-foreground"
            >
              {t("dashboard.depositForm.walletAddress")}
            </label>
            <div className="flex gap-2">
              <Input
                value={walletAddress}
                readOnly
                className="h-11 bg-muted/20 font-mono text-xs sm:text-sm"
              />
              <Button
                onClick={handleCopy}
                type="button"
                variant="default"
                className="h-11 shrink-0 px-4 font-bold"
              >
                <span suppressHydrationWarning>
                  {copied
                    ? t("dashboard.depositForm.copied")
                    : t("dashboard.depositForm.copy")}
                </span>
              </Button>
            </div>
          </div>

          <div className="mx-auto flex h-[180px] w-[180px] justify-center rounded-2xl border border-border/50 bg-background p-3">
            <QRCode
              value={walletAddress}
              size={150}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            />
          </div>

          <div className="space-y-2">
            <label
              suppressHydrationWarning
              className="block text-sm font-medium text-muted-foreground"
            >
              {t("dashboard.depositForm.uploadProof")}
            </label>
            <Input
              type="file"
              accept="image/*"
              className="h-11 cursor-pointer bg-input/20 px-3 pt-2.5 transition-colors file:mr-4 file:rounded-md file:border-0 file:bg-primary/20 file:px-4 file:py-1 file:text-sm file:font-bold file:text-primary hover:file:bg-primary/30"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  const reader = new FileReader()
                  reader.onloadend = () => {
                    setFileBase64(reader.result as string)
                  }
                  reader.readAsDataURL(file)
                } else {
                  setFileBase64("")
                }
              }}
            />
            {fileBase64 && (
              <div className="relative mt-4 flex h-48 items-center justify-center overflow-hidden rounded-xl border border-border/50 bg-background/80 p-2">
                <Image
                  src={fileBase64}
                  alt="Payment Proof Preview"
                  fill
                  className="rounded-lg object-contain p-2"
                />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <Button
              className="h-12 w-full bg-profit text-base font-bold text-primary-foreground shadow-lg transition-all hover:bg-profit/90"
              disabled={isSubmitting || !fileBase64}
              onClick={async () => {
                setIsSubmitting(true)
                try {
                  const res = await fetch("/api/deposits", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      amount: form.getValues().amount,
                      asset: form.getValues().method,
                      proofBase64: fileBase64,
                    }),
                  })

                  if (!res.ok) throw new Error("Upload failed")

                  toast.success(t("dashboard.depositForm.success"))
                  setStep(1)
                  form.reset()
                  setFileBase64("")

                  // Instantly refresh dashboard data
                  const { mutate } = await import("swr")
                  mutate("/api/user/dashboard-data")
                  mutate("/api/user/transactions-data")
                  router.refresh()
                } catch (err) {
                  toast.error(t("dashboard.depositForm.error"))
                } finally {
                  setIsSubmitting(false)
                }
              }}
            >
              {isSubmitting ? (
                <span suppressHydrationWarning>
                  {t("dashboard.depositForm.submitting")}
                </span>
              ) : (
                <>
                  <ShieldCheck className="mr-2 h-4 w-4" />{" "}
                  <span suppressHydrationWarning>
                    {t("dashboard.depositForm.havePaid")}
                  </span>
                </>
              )}
            </Button>
            <Button
              variant="outline"
              className="h-12 w-full border-border/50 bg-muted/20 font-bold hover:bg-muted/40"
              onClick={() => {
                setStep(1)
                setFileBase64("")
              }}
              disabled={isSubmitting}
            >
              <span suppressHydrationWarning>
                {t("dashboard.depositForm.cancelRequest")}
              </span>
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}

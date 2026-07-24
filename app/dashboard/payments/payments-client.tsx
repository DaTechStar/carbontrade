"use client"

import { motion } from "framer-motion"
import { useSearchParams, useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DepositForm } from "@/components/dashboard/deposit-form"
import { WithdrawForm } from "@/components/dashboard/withdraw-form"
import { CreditCard, ArrowDownLeft, ArrowUpRight } from "lucide-react"
import { useLanguage } from "@/lib/i18n/context"

export function PaymentsClient({
  paymentMethods,
  kycStatus,
  userWalletAddress,
}: {
  paymentMethods: any[]
  kycStatus: string
  userWalletAddress?: string | null
}) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { t } = useLanguage()
  const tab = searchParams.get("tab") === "withdraw" ? "withdraw" : "deposit"

  const handleTabChange = (val: string) => {
    router.push(`/dashboard/payments?tab=${val}`)
  }

  return (
    <div className="relative z-0 mx-auto flex w-full max-w-5xl flex-col items-center gap-8 pt-8 pb-16">
      {/* Decorative background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-start justify-center overflow-visible pt-[10%]">
        <motion.div
          animate={{
            x: [-150, 150, -150],
            y: [-50, 50, -50],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute h-[600px] w-[600px] rounded-full bg-primary/20 blur-[120px]"
        />
        <motion.div
          animate={{
            x: [150, -150, 150],
            y: [50, -50, 50],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute h-[500px] w-[500px] rounded-full bg-secondary/15 blur-[120px]"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center text-center"
      >
        <div className="group relative mb-4 flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/20 to-secondary/20 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <CreditCard className="relative z-10 h-7 w-7 text-primary" />
        </div>
        <h1
          suppressHydrationWarning
          className="mb-2 text-3xl font-black tracking-tight text-foreground sm:text-4xl"
        >
          {t("dashboard.payments.title")}
        </h1>
        <p
          suppressHydrationWarning
          className="max-w-[320px] text-sm text-muted-foreground sm:text-base"
        >
          {t("dashboard.payments.subtitle")}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Tabs
          value={tab}
          onValueChange={handleTabChange}
          className="mt-2 w-full"
        >
          <TabsList className="mx-auto mb-8 grid !h-[52px] w-full max-w-[400px] grid-cols-2 rounded-[16px] border border-border/50 bg-muted/40 p-1.5 shadow-sm backdrop-blur-xl">
            <TabsTrigger
              value="deposit"
              className="flex h-full items-center justify-center gap-2 rounded-xl text-sm font-bold transition-all data-[state=active]:bg-background data-[state=active]:shadow-md"
            >
              <ArrowDownLeft className="h-4 w-4 text-profit" />{" "}
              <span suppressHydrationWarning>
                {t("dashboard.payments.deposit")}
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="withdraw"
              className="flex h-full items-center justify-center gap-2 rounded-xl text-sm font-bold transition-all data-[state=active]:bg-background data-[state=active]:shadow-md"
            >
              <ArrowUpRight className="h-4 w-4 text-loss" />{" "}
              <span suppressHydrationWarning>
                {t("dashboard.payments.withdraw")}
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="deposit"
            className="mt-0 focus-visible:ring-0 focus-visible:outline-none"
          >
            <DepositForm paymentMethods={paymentMethods} />
          </TabsContent>

          <TabsContent
            value="withdraw"
            className="mt-0 focus-visible:ring-0 focus-visible:outline-none"
          >
            <WithdrawForm
              kycStatus={kycStatus}
              userWalletAddress={userWalletAddress}
            />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}

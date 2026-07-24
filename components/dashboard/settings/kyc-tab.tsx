"use client"

import { useState, useTransition, useRef, useEffect } from "react"
import {
  AlertTriangle,
  ChevronRight,
  Upload,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Image as ImageIcon,
  Wallet,
} from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { submitKycDocument } from "@/app/actions/kyc"
import { useLanguage } from "@/lib/i18n/context"
import { ConnectWalletButton } from "@/components/shared/connect-wallet-button"

export function KycTab({ user }: { user: any }) {
  const [isPending, startTransition] = useTransition()
  const { t } = useLanguage()

  const [fileFront, setFileFront] = useState<File | null>(null)
  const [previewFront, setPreviewFront] = useState<string | null>(null)

  const [fileBack, setFileBack] = useState<File | null>(null)
  const [previewBack, setPreviewBack] = useState<string | null>(null)

  const fileInputRefFront = useRef<HTMLInputElement>(null)
  const fileInputRefBack = useRef<HTMLInputElement>(null)

  const status = user.kycStatus || "unverified"

  // Cleanup object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (previewFront) URL.revokeObjectURL(previewFront)
      if (previewBack) URL.revokeObjectURL(previewBack)
    }
  }, [previewFront, previewBack])

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    side: "front" | "back"
  ) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error(t("dashboard.settings.tabs.kycFileSize"))
        return
      }
      if (!selectedFile.type.startsWith("image/")) {
        toast.error(t("dashboard.settings.tabs.kycFileFormat"))
        return
      }

      const objectUrl = URL.createObjectURL(selectedFile)

      if (side === "front") {
        if (previewFront) URL.revokeObjectURL(previewFront)
        setFileFront(selectedFile)
        setPreviewFront(objectUrl)
      } else {
        if (previewBack) URL.revokeObjectURL(previewBack)
        setFileBack(selectedFile)
        setPreviewBack(objectUrl)
      }
    }
  }

  const handleRemove = (side: "front" | "back") => {
    if (side === "front") {
      if (previewFront) URL.revokeObjectURL(previewFront)
      setFileFront(null)
      setPreviewFront(null)
      if (fileInputRefFront.current) fileInputRefFront.current.value = ""
    } else {
      if (previewBack) URL.revokeObjectURL(previewBack)
      setFileBack(null)
      setPreviewBack(null)
      if (fileInputRefBack.current) fileInputRefBack.current.value = ""
    }
  }

  const handleUpload = () => {
    if (!fileFront || !fileBack) {
      toast.error(t("dashboard.settings.tabs.kycSelectBoth"))
      return
    }

    startTransition(async () => {
      const formData = new FormData()
      formData.append("documentFront", fileFront)
      formData.append("documentBack", fileBack)

      const res = await submitKycDocument(formData)
      if (res?.error) {
        toast.error(res.error)
      } else {
        toast.success(t("dashboard.settings.tabs.kycSuccess"))
        handleRemove("front")
        handleRemove("back")
      }
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <Card
        className={cn(
          "flex flex-col gap-5 p-6",
          status === "verified"
            ? "border-success/20 bg-success/5"
            : status === "pending"
              ? "border-warning/20 bg-warning/5"
              : status === "rejected"
                ? "border-loss/20 bg-loss/5"
                : "border-border/30"
        )}
      >
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <div
            className={cn(
              "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl",
              status === "verified"
                ? "bg-success/10"
                : status === "pending"
                  ? "bg-warning/10"
                  : status === "rejected"
                    ? "bg-loss/10"
                    : "bg-muted"
            )}
          >
            {status === "verified" ? (
              <CheckCircle2 className="text-success h-7 w-7" />
            ) : status === "pending" ? (
              <Clock className="h-7 w-7 text-warning" />
            ) : status === "rejected" ? (
              <XCircle className="h-7 w-7 text-loss" />
            ) : (
              <AlertTriangle className="h-7 w-7 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1">
            <h3 suppressHydrationWarning className="text-xl font-black">
              {status === "verified"
                ? t("dashboard.settings.tabs.kycVerified")
                : status === "pending"
                  ? t("dashboard.settings.tabs.kycPending")
                  : status === "rejected"
                    ? t("dashboard.settings.tabs.kycRejected")
                    : t("dashboard.settings.tabs.kycTitle")}
            </h3>
            <p
              suppressHydrationWarning
              className="mt-1 text-sm text-muted-foreground"
            >
              {status === "verified"
                ? t("dashboard.settings.tabs.kycDescVerified")
                : status === "pending"
                  ? t("dashboard.settings.tabs.kycDescPending")
                  : status === "rejected"
                    ? t("dashboard.settings.tabs.kycDescRejected")
                    : t("dashboard.settings.tabs.kycDescUnverified")}
            </p>
          </div>
        </div>

        {(status === "unverified" || status === "rejected") &&
        !user.walletAddress ? (
          <div className="mt-6 flex flex-col items-center justify-center gap-4 rounded-xl border border-warning/20 bg-warning/5 p-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-warning/10">
              <Wallet className="h-6 w-6 text-warning" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-foreground">
                Wallet Connection Required
              </h4>
              <p className="mt-1 text-sm text-muted-foreground">
                Please connect your Web3 wallet before submitting identity
                verification.
              </p>
            </div>
            <ConnectWalletButton className="mt-2" />
          </div>
        ) : (
          (status === "unverified" || status === "rejected") && (
            <div className="mt-6 flex flex-col gap-6">
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Front of ID */}
                <div
                  className={cn(
                    "relative flex min-h-[220px] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-4 text-center transition-colors",
                    fileFront
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <input
                    type="file"
                    ref={fileInputRefFront}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "front")}
                  />

                  {previewFront ? (
                    <div className="flex h-full w-full flex-col items-center justify-between">
                      <div className="relative h-32 w-full max-w-[200px] overflow-hidden rounded-lg border bg-background">
                        <Image
                          src={previewFront}
                          alt="Front ID Preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="mt-3 flex w-full flex-col items-center gap-1">
                        <p className="max-w-[200px] truncate text-xs font-medium text-foreground">
                          {fileFront?.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {fileFront &&
                            (fileFront.size / 1024 / 1024).toFixed(2)}{" "}
                          MB
                        </p>
                        <button
                          onClick={() => handleRemove("front")}
                          className="mt-1 flex items-center gap-1 text-xs font-bold text-loss hover:underline"
                        >
                          <XCircle className="h-3 w-3" />{" "}
                          <span suppressHydrationWarning>
                            {t("dashboard.settings.tabs.kycRemove")}
                          </span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-4">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10">
                        <ImageIcon className="h-6 w-6 text-secondary" />
                      </div>
                      <p
                        suppressHydrationWarning
                        className="text-sm font-bold text-foreground"
                      >
                        {t("dashboard.settings.tabs.kycFrontId")}
                      </p>
                      <p
                        suppressHydrationWarning
                        className="mt-1 text-xs text-muted-foreground"
                      >
                        {t("dashboard.settings.tabs.kycFrontDesc")}
                      </p>
                      <button
                        onClick={() => fileInputRefFront.current?.click()}
                        className="mt-4 rounded-xl bg-secondary px-5 py-2.5 text-xs font-bold text-secondary-foreground transition-opacity hover:opacity-90"
                      >
                        <span suppressHydrationWarning>
                          {t("dashboard.settings.tabs.kycSelectBtn")}
                        </span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Back of ID */}
                <div
                  className={cn(
                    "relative flex min-h-[220px] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-4 text-center transition-colors",
                    fileBack
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <input
                    type="file"
                    ref={fileInputRefBack}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "back")}
                  />

                  {previewBack ? (
                    <div className="flex h-full w-full flex-col items-center justify-between">
                      <div className="relative h-32 w-full max-w-[200px] overflow-hidden rounded-lg border bg-background">
                        <Image
                          src={previewBack}
                          alt="Back ID Preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="mt-3 flex w-full flex-col items-center gap-1">
                        <p className="max-w-[200px] truncate text-xs font-medium text-foreground">
                          {fileBack?.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {fileBack && (fileBack.size / 1024 / 1024).toFixed(2)}{" "}
                          MB
                        </p>
                        <button
                          onClick={() => handleRemove("back")}
                          className="mt-1 flex items-center gap-1 text-xs font-bold text-loss hover:underline"
                        >
                          <XCircle className="h-3 w-3" />{" "}
                          <span suppressHydrationWarning>
                            {t("dashboard.settings.tabs.kycRemove")}
                          </span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-4">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10">
                        <ImageIcon className="h-6 w-6 text-secondary" />
                      </div>
                      <p
                        suppressHydrationWarning
                        className="text-sm font-bold text-foreground"
                      >
                        {t("dashboard.settings.tabs.kycBackId")}
                      </p>
                      <p
                        suppressHydrationWarning
                        className="mt-1 text-xs text-muted-foreground"
                      >
                        {t("dashboard.settings.tabs.kycBackDesc")}
                      </p>
                      <button
                        onClick={() => fileInputRefBack.current?.click()}
                        className="mt-4 rounded-xl bg-secondary px-5 py-2.5 text-xs font-bold text-secondary-foreground transition-opacity hover:opacity-90"
                      >
                        <span suppressHydrationWarning>
                          {t("dashboard.settings.tabs.kycSelectBtn")}
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleUpload}
                disabled={isPending || !fileFront || !fileBack}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span suppressHydrationWarning>
                      {t("dashboard.settings.tabs.kycUploading")}
                    </span>
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    <span suppressHydrationWarning>
                      {t("dashboard.settings.tabs.kycSubmit")}
                    </span>
                  </>
                )}
              </button>
            </div>
          )
        )}
      </Card>

      <Card className="flex flex-col gap-4 p-6">
        <h4 suppressHydrationWarning className="text-sm font-bold">
          {t("dashboard.settings.tabs.kycGuideTitle")}
        </h4>
        <div className="space-y-3 text-sm text-muted-foreground">
          <ul className="list-disc space-y-1 pl-5">
            <li suppressHydrationWarning>
              {t("dashboard.settings.tabs.kycGuide1")}
            </li>
            <li suppressHydrationWarning>
              {t("dashboard.settings.tabs.kycGuide2")}
            </li>
            <li suppressHydrationWarning>
              {t("dashboard.settings.tabs.kycGuide3")}
            </li>
          </ul>
          <p suppressHydrationWarning className="mt-4">
            {t("dashboard.settings.tabs.kycGuide4")}
          </p>
        </div>
      </Card>
    </div>
  )
}

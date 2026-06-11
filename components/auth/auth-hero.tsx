"use client"

import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import { Sparkles } from "lucide-react"

import { siteConfig } from "@/config/site"
import { useLanguage } from "@/lib/i18n/context"

export function AuthHero() {
  const { t } = useLanguage()

  return (
    <div className="relative hidden flex-col justify-between overflow-hidden border-r border-border bg-card p-12 md:flex">
      {/* Ambient glow blobs using design tokens */}
      <div className="pointer-events-none absolute top-[-20%] left-[-20%] h-[80%] w-[80%] rounded-full bg-secondary/10 blur-[120px]" />
      <div className="pointer-events-none absolute right-[-10%] bottom-[-10%] h-[60%] w-[60%] rounded-full bg-primary/5 blur-[100px]" />

      {/* Top Header Logo */}
      <div className="relative z-10 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-secondary/40 bg-secondary/20 shadow-lg shadow-secondary/10">
          <span className="text-xl font-black text-secondary">C</span>
        </div>
        <div>
          <h1 className="text-lg leading-none font-black tracking-tight text-foreground">
            {siteConfig.name.toUpperCase()}
          </h1>
          <p className="mt-0.5 text-[10px] font-bold tracking-widest text-secondary uppercase">
            Master Copy Trading
          </p>
        </div>
      </div>

      {/* Mid: Text & Lottie */}
      <div className="relative z-10 mx-auto my-auto flex max-w-lg flex-col items-center justify-center py-12">
        <p className="mb-6 text-center text-xl leading-relaxed font-semibold text-foreground/80 md:text-2xl">
          {t("auth.heroText").replace("{{name}}", siteConfig.name)}
        </p>
        <div className="relative flex aspect-square w-[85%] items-center justify-center select-none">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-secondary/10 via-transparent to-transparent blur-[40px]" />
          <DotLottieReact
            src="https://lottie.host/2b3d092b-b64c-4340-b4e9-88f68c5c77d2/3RGS2lbPDz.lottie"
            loop
            autoplay
            className="h-full w-full"
          />
        </div>
      </div>

      {/* Bottom footer */}
      <div className="relative z-10 flex items-center justify-between border-t border-border pt-6 text-xs text-muted-foreground">
        <span>
          © {new Date().getFullYear()} {siteConfig.name}.{" "}
          {t("auth.allRightsReserved")}
        </span>
        <span className="flex items-center gap-1.5 font-medium text-primary">
          <Sparkles className="h-3.5 w-3.5" /> {t("auth.highlyRegulated")}
        </span>
      </div>
    </div>
  )
}

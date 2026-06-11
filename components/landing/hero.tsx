"use client"

import { Button } from "@/components/ui/button"
import { siteConfig } from "@/config/site"
import { Star, Users } from "lucide-react"
import { motion } from "framer-motion"
import { useLanguage } from "@/lib/i18n/context"

import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import Link from "next/link"

export function Hero() {
  const { t } = useLanguage()

  return (
    <section className="relative flex min-h-[90vh] items-center overflow-hidden pb-20 lg:pb-32">
      {/* Background Glow Effects */}
      <div className="pointer-events-none absolute top-1/4 left-0 h-[500px] w-[500px] opacity-20">
        <div className="bg-gradient-radial absolute inset-0 rounded-full from-primary to-transparent blur-3xl" />
      </div>
      <div className="pointer-events-none absolute right-0 bottom-0 h-[600px] w-[800px] opacity-10">
        <div className="bg-gradient-radial absolute inset-0 rounded-full from-secondary to-transparent blur-[100px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-8">
          {/* Left Column: Content */}
          <div className="max-w-2xl text-left">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="mb-6 text-5xl leading-[1.1] font-black tracking-tighter md:text-7xl lg:text-[5.5rem]"
            >
              <span>{t("landing.hero.title1")}</span>{" "}
              <span className="text-gradient">{t("landing.hero.title2")}</span>{" "}
              <span>{t("landing.hero.title3")}</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="mb-8 flex flex-wrap items-center gap-6 text-sm font-medium md:text-base"
            >
              <div className="flex items-center gap-2 text-primary">
                <Users className="h-5 w-5" />
                <span>{t("landing.hero.activeUsers")}</span>
              </div>
              <div className="flex items-center gap-2 text-yellow-500">
                <Star className="h-5 w-5 fill-yellow-500" />
                <span className="text-foreground">
                  {t("landing.hero.googleRating")}
                </span>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              className="mb-10 max-w-xl text-xl leading-relaxed text-muted-foreground"
            >
              {t("landing.hero.description")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              className="flex flex-col items-center gap-4 sm:flex-row"
            >
              <Button
                size="lg"
                asChild
                className="border-glow h-14 w-full rounded-xl bg-primary px-10 text-lg font-semibold text-primary-foreground transition-all hover:scale-105 hover:bg-primary/90 active:scale-95 sm:w-auto"
              >
                <Link href="/register">{t("landing.hero.getStarted")}</Link>
              </Button>
            </motion.div>
          </div>

          {/* Right Column: Dynamic Lottie Animation Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="glass-panel group relative flex h-[500px] w-full items-center justify-center overflow-hidden rounded-[2rem] border border-border/50 lg:h-[650px]"
          >
            {/* Ambient inner glow */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-secondary/10" />

            {/* Real Lottie Animation replacing placeholder */}
            <div className="relative z-10 flex h-[85%] w-[85%] items-center justify-center">
              <DotLottieReact
                src="https://lottie.host/2b3d092b-b64c-4340-b4e9-88f68c5c77d2/3RGS2lbPDz.lottie"
                loop
                autoplay
              />
            </div>

            {/* Decorative floating UI elements */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="glass-card absolute top-20 -left-6 z-20 flex items-center gap-3 rounded-xl p-4"
            >
              <div className="h-3 w-3 rounded-full bg-profit shadow-[0_0_10px_var(--profit)]" />
              <div className="text-sm font-semibold">
                {t("landing.hero.copyActive")}
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="glass-card absolute -right-4 bottom-32 z-20 flex items-center gap-3 rounded-xl p-4"
            >
              <div className="text-lg font-bold text-primary">+124.50%</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

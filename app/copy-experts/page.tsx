"use client"

import React from "react"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { useLanguage } from "@/lib/i18n/context"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  ArrowRight,
  Users,
  TrendingUp,
  ShieldCheck,
  Activity,
} from "lucide-react"

export default function CopyExpertsPage() {
  const { t } = useLanguage()

  return (
    <main
      translate="no"
      className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary"
    >
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="pointer-events-none absolute top-0 right-1/4 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[100px]" />
        <div className="pointer-events-none absolute top-1/3 left-1/4 h-[400px] w-[400px] rounded-full bg-secondary/5 blur-[120px]" />

        <div className="relative z-10 container mx-auto max-w-4xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary">
              <Users className="h-4 w-4" />
              <span suppressHydrationWarning>
                {t("copyExperts.hero.badge")}
              </span>
            </div>

            <h1 className="mb-6 text-5xl leading-[1.05] font-black tracking-tight md:text-7xl">
              <span suppressHydrationWarning>
                {t("copyExperts.hero.title1")}
              </span>{" "}
              <br />
              <span className="text-gradient" suppressHydrationWarning>
                {t("copyExperts.hero.title2")}
              </span>
            </h1>

            <p
              className="mx-auto mb-8 max-w-2xl text-xl leading-relaxed text-muted-foreground"
              suppressHydrationWarning
            >
              {t("copyExperts.hero.desc")}
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                asChild
                className="h-13 w-full rounded-2xl bg-primary px-8 text-base font-bold text-primary-foreground transition-all hover:scale-105 hover:bg-primary/95 active:scale-95 sm:w-auto"
              >
                <Link href="/register">
                  <span suppressHydrationWarning>
                    {t("copyExperts.hero.cta1")}
                  </span>
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="h-13 w-full rounded-2xl border-white/10 px-8 text-base font-bold hover:bg-background/5 sm:w-auto"
              >
                <Link href="/markets" suppressHydrationWarning>
                  {t("copyExperts.hero.cta2")}
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="relative border-t border-border/10 bg-background/80 py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                icon: TrendingUp,
                title: t("copyExperts.features.1.title"),
                desc: t("copyExperts.features.1.desc"),
              },
              {
                icon: ShieldCheck,
                title: t("copyExperts.features.2.title"),
                desc: t("copyExperts.features.2.desc"),
              },
              {
                icon: Activity,
                title: t("copyExperts.features.3.title"),
                desc: t("copyExperts.features.3.desc"),
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glass-card rounded-[2rem] border border-white/5 p-8 text-center"
              >
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3
                  className="mb-4 text-xl font-bold text-foreground"
                  suppressHydrationWarning
                >
                  {feature.title}
                </h3>
                <p
                  className="text-sm leading-relaxed text-muted-foreground"
                  suppressHydrationWarning
                >
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

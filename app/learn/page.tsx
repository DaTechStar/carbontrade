"use client"

import React, { useState } from "react"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { useLanguage } from "@/lib/i18n/context"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import {
  BookOpen,
  GraduationCap,
  FileText,
  Search,
  ChevronRight,
  HelpCircle,
  Award,
  Sliders,
  ShieldCheck,
  Zap,
  TrendingDown,
} from "lucide-react"
import { siteConfig } from "@/config/site"

interface Guide {
  id: string
  category: "Trading Basics" | "Advanced Copying" | "Risk Control"
  title: string
  readTime: string
  level: "Beginner" | "Intermediate" | "Professional"
  icon: React.ComponentType<any>
  summary: string
  details: string
}

export default function LearnPage() {
  const { t } = useLanguage()
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const academyGuides: Guide[] = [
    {
      id: "1",
      category: "Trading Basics",
      title: "Understanding PRIME ECN Spreads",
      readTime: "4 Min Read",
      level: "Beginner",
      icon: Zap,
      summary:
        "What does it mean to trade with ECN execution and how are 0.0 pip spreads calculated?",
      details:
        "Electronic Communication Network (ECN) execution directly matches retail traders with global institutional liquidity banks (Tier-1 banks) without dealing desk intervention. This guarantees that bid and ask prices are loaded instantly with virtually no markup. Spreads fluctuate naturally around 0.0 pips on highly liquid instruments like EURUSD and Gold, accompanied by a tiny, transparent flat transaction commission. It ensures retail access to institutional grade tools.",
    },
    {
      id: "2",
      category: "Advanced Copying",
      title: "The Mechanics of Inverse Copy Trading",
      readTime: "6 Min Read",
      level: "Intermediate",
      icon: TrendingDown,
      summary:
        "Learn how our unique fade technology lets you take the opposite side of consistently losing traders.",
      details: `In traditional copy trading, you duplicate the gains of successful leaders. But what if you could take advantage of failing managers? ${siteConfig.name} inverse technology lets you deploy unique trade fading. Our platform intercepts a trade signal, inverts the execution (BUY becomes SELL, and vice-versa), and executes the inverted order instantly at ECN rates. If the trader consistently enters bad setups, your duplicate order gains. Always monitor risk allocations when deploying inverse parameters.`,
    },
    {
      id: "3",
      category: "Risk Control",
      title: "Risk Control Limits & Slippage Margins",
      readTime: "5 Min Read",
      level: "Intermediate",
      icon: Sliders,
      summary:
        "Understand why setting lot limitations, custom max slippage, and emergency stop values saves your capital.",
      details:
        "Slippage represents the difference between the requested price of an order and the actual execution price. In fast markets, slippage can erode gains. By utilizing our Slippage Protection Control sliders, you can define the maximum pip deviation permitted. If institutional quotes drift further than your cap, the trade instantly drops. We highly recommend configuring stop loss margins and maximum copy drawdowns on all allocations.",
    },
    {
      id: "4",
      category: "Trading Basics",
      title: "Eco-Fintech: Trading for the Future",
      readTime: "3 Min Read",
      level: "Beginner",
      icon: ShieldCheck,
      summary: `How ${siteConfig.name} combines capital execution with clean environmental accountability.`,
      details: `${siteConfig.name} is committed to offsetting retail carbon footprints. For every lot volume traded on our standard and ECN servers, we allocate a micro-fraction of platform commissions to fund certified global green initiatives, direct air carbon captures, and forestation projects. Our servers located in Equinix NY4 also utilize high-efficiency cooling architectures to minimize net energy wastage.`,
    },
  ]

  const filteredGuides = academyGuides.filter(
    (g) =>
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.summary.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <main
      translate="no"
      className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary"
    >
      <Navbar />

      <div className="container mx-auto px-4 pt-28 pb-20 md:px-8">
        {/* Header */}
        <div className="mb-12 max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <GraduationCap className="h-3.5 w-3.5" />
            {t("learn.hero.badge")}
          </div>
          <h1 className="mb-4 text-4xl font-black md:text-6xl">
            <span>{t("learn.hero.title1")}</span>{" "}
            <span className="text-gradient">{t("learn.hero.title2")}</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            {t("learn.hero.desc")}
          </p>
        </div>

        {/* Search bar */}
        <div className="relative mb-12 w-full max-w-xl">
          <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search tutorials, glossaries, guides..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 pr-4 pl-12 text-sm transition-colors focus:border-primary focus:outline-none"
          />
        </div>

        {/* Content list Grid */}
        <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
          {filteredGuides.map((guide) => {
            const Icon = guide.icon
            return (
              <motion.div
                key={guide.id}
                layoutId={`guide-card-${guide.id}`}
                onClick={() => setSelectedGuide(guide)}
                className="glass-card relative flex min-h-[220px] cursor-pointer flex-col justify-between overflow-hidden rounded-3xl border border-white/5 p-6 transition-all hover:border-primary/20"
              >
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-[10px] font-black tracking-widest text-primary uppercase">
                      {guide.category}
                    </span>
                    <span className="text-[10px] font-semibold text-zinc-500">
                      {guide.readTime}
                    </span>
                  </div>

                  <h3 className="mb-2 flex items-center gap-2 text-xl font-bold text-zinc-100">
                    <Icon className="h-5 w-5 shrink-0 text-primary" />
                    {guide.title}
                  </h3>

                  <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
                    {guide.summary}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-primary">
                  Start Learning
                  <ChevronRight className="h-4 w-4" />
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Guide detail modal dialog */}
      <AnimatePresence>
        {selectedGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedGuide(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              layoutId={`guide-card-${selectedGuide.id}`}
              className="custom-scrollbar relative z-10 max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] border border-white/10 bg-zinc-950 p-8 shadow-2xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <span className="mb-1 block text-[10px] font-black tracking-widest text-primary uppercase">
                    {selectedGuide.category} • {selectedGuide.level}
                  </span>
                  <h3 className="text-2xl font-black text-white">
                    {selectedGuide.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedGuide(null)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-400 hover:text-white"
                >
                  <ChevronRight className="h-4 w-4 rotate-180" />
                </button>
              </div>

              <div className="space-y-4 text-sm leading-relaxed text-zinc-300">
                <p className="rounded-xl border border-white/5 bg-white/5 p-4 font-semibold text-zinc-400">
                  {selectedGuide.summary}
                </p>

                {/* Paragraph segments split by double spacing */}
                {selectedGuide.details.split("\n\n").map((para, i) => (
                  <p key={i} className="text-zinc-300">
                    {para}
                  </p>
                ))}
              </div>

              <div className="mt-8 flex justify-end gap-3 border-t border-white/5 pt-6">
                <Button
                  onClick={() => setSelectedGuide(null)}
                  className="h-11 rounded-xl bg-primary px-6 text-xs font-bold text-primary-foreground transition-transform hover:bg-primary/90 active:scale-95"
                >
                  Completed Reading
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  )
}

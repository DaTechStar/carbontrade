"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { MarketChart } from "@/components/shared/market-chart";
import { useLanguage } from "@/lib/i18n/context";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { 
  Users, 
  TrendingUp, 
  ShieldCheck, 
  AlertTriangle, 
  Settings2, 
  X, 
  SlidersHorizontal,
  ArrowRight,
  TrendingDown,
  Percent,
  Activity,
  HeartHandshake
} from "lucide-react";

interface Expert {
  id: string;
  name: string;
  avatar: string;
  gain: string;
  allTime: string;
  risk: "Low" | "Medium" | "High";
  followers: number;
  winRate: string;
  defaultSymbol: string;
}

export default function CopyExpertsPage() {
  const { t } = useLanguage();
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [copyDemoActive, setCopyDemoActive] = useState(false);

  const experts: Expert[] = [
    {
      id: "1",
      name: "Maximuz",
      avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=80&h=80&fit=crop&crop=face",
      gain: "+122%",
      allTime: "+295%",
      risk: "Medium",
      followers: 560,
      winRate: "88%",
      defaultSymbol: "BINANCE:BTCUSD"
    },
    {
      id: "2",
      name: "Thinh Ph...",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&h=80&fit=crop&crop=face",
      gain: "+48%",
      allTime: "+50%",
      risk: "Medium",
      followers: 620,
      winRate: "79%",
      defaultSymbol: "FX:EURUSD"
    },
    {
      id: "3",
      name: "Axion",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
      gain: "+35%",
      allTime: "+236%",
      risk: "High",
      followers: 870,
      winRate: "82%",
      defaultSymbol: "NASDAQ:TSLA"
    },
    {
      id: "4",
      name: "DT Trading",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
      gain: "+18%",
      allTime: "+89%",
      risk: "Low",
      followers: 1240,
      winRate: "91%",
      defaultSymbol: "OANDA:XAUUSD"
    }
  ];

  return (
    <main translate="no" className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary mb-6">
              <HeartHandshake className="w-4 h-4 text-primary animate-pulse" />
              {t("copyExperts.hero.badge")}
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-[1.05]">
              <span>{t("copyExperts.hero.title1")}</span> <br />
              <span className="text-gradient">{t("copyExperts.hero.title2")}</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              {t("copyExperts.hero.desc")}
            </p>

            <div className="flex justify-center gap-4">
              <Button size="lg" className="h-13 px-8 bg-primary hover:bg-primary/95 text-primary-foreground font-bold rounded-2xl transition-all hover:scale-105 active:scale-95">
                {t("copyExperts.hero.cta")}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How Copy Trading Works Visual Timeline Section */}
      <section className="py-20 bg-black/20 border-t border-border/10">
        <div className="container mx-auto px-4 max-w-5xl">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">{t("copyExperts.how.title")}</h2>
            <p className="text-muted-foreground">
              {t("copyExperts.how.desc")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {[
              { step: "01", title: t("copyExperts.timeline.step1.title"), desc: t("copyExperts.timeline.step1.desc") },
              { step: "02", title: t("copyExperts.timeline.step2.title"), desc: t("copyExperts.timeline.step2.desc") },
              { step: "03", title: t("copyExperts.timeline.step3.title"), desc: t("copyExperts.timeline.step3.desc") }
            ].map((item, idx) => (
              <div key={idx} className="glass-card p-8 rounded-3xl border border-white/5 relative overflow-hidden">
                <div className="text-5xl font-black text-primary/20 mb-4">{item.step}</div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Elite Performers Grid */}
      <section className="py-20 relative border-t border-border/10">
        <div className="container mx-auto px-4">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">{t("copyExperts.directory.title")}</h2>
            <p className="text-muted-foreground">
              {t("copyExperts.directory.desc")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {experts.map((expert, idx) => (
              <motion.div
                key={expert.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="glass-card p-6 rounded-3xl border border-white/5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-primary/20 shrink-0">
                      <Image 
                        src={expert.avatar} 
                        alt={expert.name} 
                        width={40} 
                        height={40} 
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-zinc-100">{expert.name}</h4>
                      <span className="text-[9px] uppercase tracking-widest font-bold text-zinc-500">
                        {t("copyExperts.labels.risk." + expert.risk.toLowerCase())} {t("copyExperts.labels.riskLabel")}
                      </span>
                    </div>
                  </div>

                  {/* ROI metric */}
                  <div className="mb-6">
                    <span className="text-[9px] uppercase tracking-widest font-black text-zinc-500">
                      {t("copyExperts.labels.weeklyPerformance")}
                    </span>
                    <div className="text-3xl font-black text-emerald-400">{expert.gain}</div>
                  </div>

                  {/* Sparkline widget preview */}
                  <div className="h-[140px] w-full bg-zinc-950 rounded-xl overflow-hidden mb-6 pointer-events-none border border-white/5">
                    <MarketChart 
                      type="mini"
                      symbol={expert.defaultSymbol}
                      height="100%"
                      width="100%"
                      isTransparent={false}
                    />
                  </div>

                  {/* Mini stats */}
                  <div className="grid grid-cols-2 gap-2 mb-6 text-center text-xs">
                    <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                      <div className="text-[8px] text-zinc-500 uppercase tracking-widest mb-0.5">
                        {t("copyExperts.labels.winRate")}
                      </div>
                      <span className="font-bold text-white">{expert.winRate}</span>
                    </div>
                    <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                      <div className="text-[8px] text-zinc-500 uppercase tracking-widest mb-0.5">
                        {t("copyExperts.labels.copiers")}
                      </div>
                      <span className="font-bold text-zinc-300">{expert.followers}</span>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={() => setSelectedExpert(expert)}
                  className="w-full h-11 bg-primary/10 hover:bg-primary border border-primary/20 text-primary hover:text-primary-foreground font-bold rounded-2xl text-xs transition-colors"
                >
                  {t("copyExperts.labels.viewParams")}
                </Button>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* Smart Copy Unique Technology Highlights */}
      <section className="py-20 bg-zinc-950 border-t border-border/10">
        <div className="container mx-auto px-4 max-w-5xl">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left side text */}
            <div>
              <span className="text-xs uppercase tracking-widest font-black text-primary mb-2 block">{t("copyExperts.tech.badge")}</span>
              <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
                {t("copyExperts.tech.title1")} <br />
                <span className="text-gradient">{t("copyExperts.tech.title2")}</span>
              </h2>
              <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                {t("copyExperts.tech.desc")}
              </p>

              <div className="space-y-4">
                <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                  <h4 className="font-bold text-white text-sm mb-1 flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-primary" />
                    {t("copyExperts.tech.inverseTitle")}
                  </h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {t("copyExperts.tech.inverseDesc")}
                  </p>
                </div>
                <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                  <h4 className="font-bold text-white text-sm mb-1 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-secondary" />
                    {t("copyExperts.tech.slippageTitle")}
                  </h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {t("copyExperts.tech.slippageDesc")}
                  </p>
                </div>
              </div>
            </div>

            {/* Right side graphical representation */}
            <div className="glass-card p-8 rounded-[2rem] border border-white/5 relative overflow-hidden">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-secondary" />
                {t("copyExperts.labels.exampleInverse")}
              </h3>

              <div className="space-y-4">
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex justify-between items-center text-xs">
                  <div>
                    <span className="text-zinc-500 block">{t("copyExperts.labels.losingAction")}</span>
                    <strong className="text-rose-400 uppercase">{t("copyExperts.labels.buyBTC")}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-zinc-500 block">{t("copyExperts.labels.result")}</span>
                    <strong className="text-rose-400">{t("copyExperts.labels.lossValue")}</strong>
                  </div>
                </div>

                <div className="flex justify-center my-2">
                  <ArrowRight className="w-6 h-6 text-primary rotate-90" />
                </div>

                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex justify-between items-center text-xs">
                  <div>
                    <span className="text-zinc-500 block">{t("copyExperts.labels.inverseReplica")}</span>
                    <strong className="text-emerald-400 uppercase">{t("copyExperts.labels.sellBTC")}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-zinc-500 block">{t("copyExperts.labels.result")}</span>
                    <strong className="text-emerald-400">{t("copyExperts.labels.profitValue")}</strong>
                  </div>
                </div>
              </div>

              <p className="text-[10px] text-zinc-500 italic mt-6 leading-relaxed">
                {t("copyExperts.labels.replicationNote")}
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Copy parameters preview modal mock */}
      <AnimatePresence>
        {selectedExpert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedExpert(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-zinc-950 border border-white/10 rounded-[2rem] p-8 shadow-2xl z-10 text-center"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span className="text-xs font-bold text-zinc-400">{t("copyExperts.modal.title")}</span>
                </div>
                <button 
                  onClick={() => setSelectedExpert(null)}
                  className="w-6 h-6 rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="w-12 h-12 rounded-full overflow-hidden border border-primary/20 mx-auto mb-4">
                <Image 
                  src={selectedExpert.avatar} 
                  alt={selectedExpert.name} 
                  width={48} 
                  height={48} 
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </div>

              <h3 className="text-xl font-bold text-white mb-2">{t("copyExperts.labels.mirror")} {selectedExpert.name}</h3>
              <p className="text-xs text-zinc-500 leading-relaxed mb-6">
                {t("copyExperts.modal.desc")}
              </p>

              <div className="space-y-4 text-left">
                <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">{t("copyExperts.labels.traditionalMirror")}</span>
                    <strong className="text-zinc-200">{t("copyExperts.labels.yes")}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">{t("copyExperts.labels.inverseSupport")}</span>
                    <strong className="text-primary font-bold">{t("copyExperts.labels.enabled")}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">{t("copyExperts.labels.avgWinRate")}</span>
                    <strong className="text-emerald-400">{selectedExpert.winRate}</strong>
                  </div>
                </div>

                <Button 
                  onClick={() => setSelectedExpert(null)}
                  className="w-full h-11 bg-primary hover:bg-primary/95 text-primary-foreground font-bold rounded-xl text-xs active:scale-95 transition-transform"
                >
                  {t("copyExperts.labels.createAllocation")}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}

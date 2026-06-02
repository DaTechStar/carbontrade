"use client";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { Star, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/context";

import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden pb-20 lg:pb-32 min-h-[90vh] flex items-center">
      {/* Background Glow Effects */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-radial from-primary to-transparent blur-3xl rounded-full" />
      </div>
      <div className="absolute bottom-0 right-0 w-[800px] h-[600px] opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-radial from-secondary to-transparent blur-[100px] rounded-full" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Content */}
          <div className="text-left max-w-2xl">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-5xl md:text-7xl lg:text-[5.5rem] font-black tracking-tighter mb-6 leading-[1.1]"
            >
              <span>{t("landing.hero.title1")}</span>{" "}
              <span className="text-gradient">{t("landing.hero.title2")}</span>{" "}
              <span>{t("landing.hero.title3")}</span>
            </motion.h1>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="flex flex-wrap items-center gap-6 mb-8 text-sm md:text-base font-medium"
            >
              <div className="flex items-center gap-2 text-primary">
                <Users className="w-5 h-5" />
                <span>{t("landing.hero.activeUsers")}</span>
              </div>
              <div className="flex items-center gap-2 text-yellow-500">
                <Star className="w-5 h-5 fill-yellow-500" />
                <span className="text-foreground">{t("landing.hero.googleRating")}</span>
              </div>
            </motion.div>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-xl"
            >
              {t("landing.hero.description")}
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              className="flex flex-col sm:flex-row items-center gap-4"
            >
              <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-10 border-glow bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all hover:scale-105 active:scale-95">
                {t("landing.hero.getStarted")}
              </Button>
            </motion.div>
          </div>

          {/* Right Column: Dynamic Lottie Animation Visual */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative w-full h-[500px] lg:h-[650px] rounded-[2rem] glass-panel border border-border/50 overflow-hidden group flex items-center justify-center"
          >
            {/* Ambient inner glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-secondary/10 pointer-events-none" />
            
            {/* Real Lottie Animation replacing placeholder */}
            <div className="w-[85%] h-[85%] flex items-center justify-center relative z-10">
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
              className="absolute -left-6 top-20 glass-card p-4 rounded-xl flex items-center gap-3 z-20"
            >
              <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]" />
              <div className="text-sm font-semibold">{t("landing.hero.copyActive")}</div>
            </motion.div>
            
            <motion.div 
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -right-4 bottom-32 glass-card p-4 rounded-xl flex items-center gap-3 z-20"
            >
              <div className="text-lg font-bold text-primary">+124.50%</div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

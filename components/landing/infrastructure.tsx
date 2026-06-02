"use client";

import { Activity, Server, Shield, Zap } from "lucide-react";
import { siteConfig } from "@/config/site";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/context";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
} as const;

export function Infrastructure() {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-background border-y border-border/10 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">{t("landing.infrastructure.title1")} <span className="text-primary">{t("landing.infrastructure.title2")}</span></h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t("landing.infrastructure.description")}
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          
          <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} className="glass-card p-8 rounded-2xl border-t border-white/5 relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <Zap className="w-10 h-10 text-primary mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="text-3xl font-black mb-2">{siteConfig.features.executionSpeed}</h3>
            <p className="text-muted-foreground font-medium">{t("landing.infrastructure.executionSpeed")}</p>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} className="glass-card p-8 rounded-2xl border-t border-white/5 relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <Activity className="w-10 h-10 text-secondary mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="text-3xl font-black mb-2">{siteConfig.features.spreads}</h3>
            <p className="text-muted-foreground font-medium">{t("landing.infrastructure.tightSpreads")}</p>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} className="glass-card p-8 rounded-2xl border-t border-white/5 relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <Server className="w-10 h-10 text-primary mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="text-3xl font-black mb-2">{siteConfig.features.servers}</h3>
            <p className="text-muted-foreground font-medium">{t("landing.infrastructure.uptime")}</p>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} className="glass-card p-8 rounded-2xl border-t border-white/5 relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <Shield className="w-10 h-10 text-secondary mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="text-3xl font-black mb-2">{siteConfig.features.instruments}</h3>
            <p className="text-muted-foreground font-medium">{t("landing.infrastructure.tradableAssets")}</p>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}



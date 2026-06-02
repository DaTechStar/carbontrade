"use client";

import { siteConfig } from "@/config/site";
import { ShieldCheck, Lock, Award } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/context";

export function Security() {
  const { t } = useLanguage();

  const securityItems = [
    { icon: ShieldCheck, color: "text-primary", titleKey: "landing.security.regulated.title", descKey: "landing.security.regulated.desc" },
    { icon: Lock, color: "text-secondary", titleKey: "landing.security.segregated.title", descKey: "landing.security.segregated.desc" },
    { icon: Award, color: "text-primary", titleKey: "landing.security.award.title", descKey: "landing.security.award.desc" },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="glass-panel rounded-3xl p-8 md:p-16 relative overflow-hidden"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/10 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
            <div>
              <motion.h2 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-3xl md:text-5xl font-bold mb-6"
              >
                {t("landing.security.title1")}<br />
                <span className="text-gradient">{t("landing.security.title2")}</span>
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-lg text-muted-foreground mb-8 max-w-md"
              >
                {t("landing.security.description")}
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="grid grid-cols-2 gap-8 mb-8"
              >
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">{siteConfig.stats.accuracyRate}</div>
                  <div className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">{t("landing.security.executionAccuracy")}</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-secondary mb-2">{siteConfig.stats.happyClients}</div>
                  <div className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">{t("landing.security.clientSatisfaction")}</div>
                </div>
              </motion.div>
            </div>
            
            <div className="flex flex-col justify-center gap-8">
              {securityItems.map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + (i * 0.1) }}
                  className="flex gap-4 group"
                >
                  <div className={`w-12 h-12 shrink-0 rounded-xl bg-background border border-border/50 flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{t(item.titleKey)}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{t(item.descKey)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
        
      </div>
    </section>
  );
}

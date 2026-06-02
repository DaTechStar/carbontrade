"use client";

import { Activity, Globe, RefreshCcw } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/context";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
} as const;

export function SmartCopy() {
  const { t } = useLanguage();

  const features = [
    {
      title: t("landing.smartCopy.features.autoIntel.title"),
      description: t("landing.smartCopy.features.autoIntel.description"),
      icon: Activity,
    },
    {
      title: t("landing.smartCopy.features.inverse.title"),
      description: t("landing.smartCopy.features.inverse.description"),
      icon: RefreshCcw,
    },
    {
      title: t("landing.smartCopy.features.community.title"),
      description: t("landing.smartCopy.features.community.description"),
      icon: Globe,
    },
  ];

  return (
    <section className="py-24 bg-background relative border-t border-border/10 overflow-hidden">
      {/* Background glow */}
      <div className="absolute -left-1/4 top-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            {t("landing.smartCopy.title1")} <span className="text-gradient">{t("landing.smartCopy.title2")}</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            {t("landing.smartCopy.description")}
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="glass-card p-8 rounded-2xl relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 border border-primary/20 group-hover:border-primary/50 group-hover:scale-110 transition-all">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

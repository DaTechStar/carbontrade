"use client";

import { UserPlus, Wallet, Rocket } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/context";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.2 } }
} as const;

const itemVariants = {
  hidden: { opacity: 0, x: -30 },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 80 } }
} as const;

export function OnboardingSteps() {
  const { t } = useLanguage();

  const steps = [
    { number: "1", titleKey: "landing.onboarding.steps.register.title", descKey: "landing.onboarding.steps.register.description", icon: UserPlus },
    { number: "2", titleKey: "landing.onboarding.steps.fund.title", descKey: "landing.onboarding.steps.fund.description", icon: Wallet },
    { number: "3", titleKey: "landing.onboarding.steps.trade.title", descKey: "landing.onboarding.steps.trade.description", icon: Rocket },
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-background">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] border border-border/10 rounded-[100%] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[800px] border border-border/5 rounded-[100%] pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            {t("landing.onboarding.title1")} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00e5ff] to-[#0077ff]">{t("landing.onboarding.title2")}</span>
          </h2>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col md:flex-row justify-center items-center gap-12 lg:gap-16 max-w-6xl mx-auto"
        >
          {steps.map((step, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              className="flex items-center group w-full md:w-auto flex-col md:flex-row text-center md:text-left cursor-default relative"
            >
              <div className="flex items-center gap-4 lg:gap-6 mb-4 md:mb-0 relative">
                <motion.div 
                  animate={{ color: ["#1e293b", "#00e5ff", "#1e293b", "#1e293b"] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", times: [0, 0.2, 0.4, 1], delay: index * 1.2 }}
                  className="text-8xl lg:text-9xl font-black leading-none select-none transition-transform duration-300 group-hover:-translate-y-2"
                >
                  {step.number}
                </motion.div>
                
                <div className="max-w-[200px] pt-2">
                  <h3 className="text-xl font-bold mb-3 flex items-center justify-center md:justify-start gap-2 text-white tracking-wide">
                    <step.icon className="w-5 h-5 text-[#00FF87] stroke-[2.5]" /> {t(step.titleKey)}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                    {t(step.descKey)}
                  </p>
                </div>
              </div>

              {index < steps.length - 1 && (
                <motion.div 
                  animate={{ backgroundColor: ["rgba(30, 41, 59, 0.5)", "#00e5ff", "rgba(30, 41, 59, 0.5)", "rgba(30, 41, 59, 0.5)"] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", times: [0, 0.2, 0.4, 1], delay: index * 1.2 + 0.6 }}
                  className="hidden md:block w-12 h-px mx-4 lg:mx-8 shrink-0 relative"
                >
                  <motion.div 
                    animate={{ borderColor: ["rgba(30, 41, 59, 0.5)", "#00e5ff", "rgba(30, 41, 59, 0.5)", "rgba(30, 41, 59, 0.5)"] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", times: [0, 0.2, 0.4, 1], delay: index * 1.2 + 0.6 }}
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t border-r rotate-45" 
                  />
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

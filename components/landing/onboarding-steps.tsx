"use client"

import { UserPlus, Wallet, Rocket } from "lucide-react"
import { motion } from "framer-motion"
import { useLanguage } from "@/lib/i18n/context"

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.2 } },
} as const

const itemVariants = {
  hidden: { opacity: 0, x: -30 },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 80 } },
} as const

export function OnboardingSteps() {
  const { t } = useLanguage()

  const steps = [
    {
      number: "1",
      titleKey: "landing.onboarding.steps.register.title",
      descKey: "landing.onboarding.steps.register.description",
      icon: UserPlus,
    },
    {
      number: "2",
      titleKey: "landing.onboarding.steps.fund.title",
      descKey: "landing.onboarding.steps.fund.description",
      icon: Wallet,
    },
    {
      number: "3",
      titleKey: "landing.onboarding.steps.trade.title",
      descKey: "landing.onboarding.steps.trade.description",
      icon: Rocket,
    },
  ]

  return (
    <section className="relative overflow-hidden bg-background py-24">
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-[100%] border border-border/10" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[800px] w-[1200px] -translate-x-1/2 -translate-y-1/2 rounded-[100%] border border-border/5" />

      <div className="relative z-10 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-20 text-center"
        >
          <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
            {t("landing.onboarding.title1")}{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t("landing.onboarding.title2")}
            </span>
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-12 md:flex-row lg:gap-16"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              className="group relative flex w-full cursor-default flex-col items-center text-center md:w-auto md:flex-row md:text-left"
            >
              <div className="relative mb-4 flex items-center gap-4 md:mb-0 lg:gap-6">
                <motion.div
                  animate={{
                    color: [
                      "var(--muted)",
                      "var(--primary)",
                      "var(--muted)",
                      "var(--muted)",
                    ],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    times: [0, 0.2, 0.4, 1],
                    delay: index * 1.2,
                  }}
                  className="text-8xl leading-none font-black transition-transform duration-300 select-none group-hover:-translate-y-2 lg:text-9xl"
                >
                  {step.number}
                </motion.div>

                <div className="max-w-[200px] pt-2">
                  <h3 className="mb-3 flex items-center justify-center gap-2 text-xl font-bold tracking-wide text-foreground md:justify-start">
                    <step.icon className="h-5 w-5 stroke-[2.5] text-primary" />{" "}
                    {t(step.titleKey)}
                  </h3>
                  <p className="text-sm leading-relaxed font-medium text-muted-foreground">
                    {t(step.descKey)}
                  </p>
                </div>
              </div>

              {index < steps.length - 1 && (
                <motion.div
                  animate={{
                    backgroundColor: [
                      "var(--muted)",
                      "var(--primary)",
                      "var(--muted)",
                      "var(--muted)",
                    ],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    times: [0, 0.2, 0.4, 1],
                    delay: index * 1.2 + 0.6,
                  }}
                  className="relative mx-4 hidden h-px w-12 shrink-0 md:block lg:mx-8"
                >
                  <motion.div
                    animate={{
                      borderColor: [
                        "var(--muted)",
                        "var(--primary)",
                        "var(--muted)",
                        "var(--muted)",
                      ],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      times: [0, 0.2, 0.4, 1],
                      delay: index * 1.2 + 0.6,
                    }}
                    className="absolute top-1/2 right-0 h-2 w-2 -translate-y-1/2 rotate-45 border-t border-r"
                  />
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

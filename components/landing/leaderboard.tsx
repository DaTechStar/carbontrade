"use client"

import { TrendingUp, ShieldAlert, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useLanguage } from "@/lib/i18n/context"
import Image from "next/image"

const leaders = [
  {
    name: "Maximuz",
    gain: "+122%",
    allTime: "+295%",
    risk: "Medium",
    followers: 56,
    last7d: 12,
    avatar:
      "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=80&h=80&fit=crop&crop=face",
  },
  {
    name: "Thinh Ph...",
    gain: "+48%",
    allTime: "+50%",
    risk: "Medium",
    followers: 62,
    last7d: 14,
    avatar:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&h=80&fit=crop&crop=face",
  },
  {
    name: "Axion",
    gain: "+35%",
    allTime: "+236%",
    risk: "Medium",
    followers: 87,
    last7d: 11,
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
  },
  {
    name: "DT Trading",
    gain: "+18%",
    allTime: "+89%",
    risk: "Low",
    followers: 124,
    last7d: 32,
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
} as const
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80 } },
} as const

export function Leaderboard() {
  const { t } = useLanguage()

  return (
    <section className="relative border-t border-border/10 bg-background py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end"
        >
          <div className="max-w-2xl">
            <h2 className="mb-4 text-3xl font-bold md:text-5xl">
              {t("landing.leaderboard.title1")}{" "}
              <span className="text-gradient">
                {t("landing.leaderboard.title2")}
              </span>
            </h2>
            <p className="text-lg text-muted-foreground">
              {t("landing.leaderboard.description")}
            </p>
          </div>
          <Button
            variant="outline"
            className="hidden rounded-full border-border/50 transition-colors hover:bg-primary/10 hover:text-primary md:flex"
          >
            {t("landing.leaderboard.viewFull")}
          </Button>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {leaders.map((leader, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="glass-card group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl p-6"
            >
              <div className="absolute right-0 bottom-0 left-0 h-1/2 bg-gradient-to-t from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

              <div className="relative z-10 mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-secondary/30 shadow-md transition-colors group-hover:border-primary/60">
                    <Image
                      src={leader.avatar}
                      alt={leader.name}
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                      unoptimized
                    />
                  </div>
                  <span className="text-lg font-medium">{leader.name}</span>
                </div>
                <Button
                  size="sm"
                  className="h-8 rounded-full bg-primary/10 px-4 text-primary transition-all hover:bg-primary hover:text-primary-foreground"
                >
                  {t("landing.leaderboard.copy")}
                </Button>
              </div>

              <div className="relative z-10 mb-6">
                <div className="mb-1 flex items-baseline gap-2">
                  <span className="origin-left text-4xl font-bold text-primary transition-transform group-hover:scale-105">
                    {leader.gain}
                  </span>
                  <span className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                    {t("landing.leaderboard.gain")}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4 text-profit" />{" "}
                  {leader.allTime} {t("landing.leaderboard.allTimeGain")}
                </div>
              </div>

              <div className="relative z-10 mt-auto flex items-center justify-between border-t border-border/40 pt-4">
                <div className="flex items-center gap-1 rounded-md bg-warning-bg px-2 py-1 text-xs font-medium text-warning">
                  <ShieldAlert className="h-3 w-3" /> {leader.risk}{" "}
                  {t("landing.leaderboard.risk")}
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1 text-sm font-semibold">
                    <Users className="h-3 w-3 text-primary" />{" "}
                    {leader.followers}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    +{leader.last7d} {t("landing.leaderboard.thisWeek")}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <Button
          variant="outline"
          className="mt-8 w-full rounded-full border-border/50 md:hidden"
        >
          {t("landing.leaderboard.viewFull")}
        </Button>
      </div>
    </section>
  )
}

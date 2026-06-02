"use client";

import { TrendingUp, ShieldAlert, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/context";
import Image from "next/image";

const leaders = [
  { name: "Maximuz",    gain: "+122%", allTime: "+295%", risk: "Medium", followers: 56,  last7d: 12, avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=80&h=80&fit=crop&crop=face" },
  { name: "Thinh Ph...",gain: "+48%",  allTime: "+50%",  risk: "Medium", followers: 62,  last7d: 14, avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&h=80&fit=crop&crop=face" },
  { name: "Axion",      gain: "+35%",  allTime: "+236%", risk: "Medium", followers: 87,  last7d: 11, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face" },
  { name: "DT Trading", gain: "+18%",  allTime: "+89%",  risk: "Low",    followers: 124, last7d: 32, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face" },
];

const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } } as const;
const itemVariants = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80 } } } as const;

export function Leaderboard() {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-background relative border-t border-border/10">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
        >
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              {t("landing.leaderboard.title1")} <span className="text-gradient">{t("landing.leaderboard.title2")}</span>
            </h2>
            <p className="text-lg text-muted-foreground">{t("landing.leaderboard.description")}</p>
          </div>
          <Button variant="outline" className="rounded-full border-border/50 hidden md:flex hover:bg-primary/10 hover:text-primary transition-colors">
            {t("landing.leaderboard.viewFull")}
          </Button>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {leaders.map((leader, i) => (
            <motion.div 
              key={i} 
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="glass-card rounded-2xl p-6 flex flex-col relative overflow-hidden group cursor-pointer"
            >
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-secondary/30 group-hover:border-primary/60 transition-colors shrink-0 shadow-md">
                    <Image
                      src={leader.avatar}
                      alt={leader.name}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  </div>
                  <span className="font-medium text-lg">{leader.name}</span>
                </div>
                <Button size="sm" className="rounded-full h-8 px-4 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all">
                  {t("landing.leaderboard.copy")}
                </Button>
              </div>

              <div className="mb-6 relative z-10">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-4xl font-bold text-primary group-hover:scale-105 transition-transform origin-left">{leader.gain}</span>
                  <span className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">{t("landing.leaderboard.gain")}</span>
                </div>
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-green-500" /> {leader.allTime} {t("landing.leaderboard.allTimeGain")}
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-border/40 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-yellow-500/10 text-yellow-500 font-medium">
                  <ShieldAlert className="w-3 h-3" /> {leader.risk} {t("landing.leaderboard.risk")}
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold flex items-center gap-1 justify-end">
                    <Users className="w-3 h-3 text-primary" /> {leader.followers}
                  </div>
                  <div className="text-xs text-muted-foreground">+{leader.last7d} {t("landing.leaderboard.thisWeek")}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <Button variant="outline" className="w-full mt-8 rounded-full border-border/50 md:hidden">
          {t("landing.leaderboard.viewFull")}
        </Button>
      </div>
    </section>
  );
}

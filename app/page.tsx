import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { TickerTape } from "@/components/landing/ticker-tape"
import { MarketTabs } from "@/components/landing/market-tabs"
import { SmartCopy } from "@/components/landing/smart-copy"
import { Infrastructure } from "@/components/landing/infrastructure"
import { Leaderboard } from "@/components/landing/leaderboard"
import { Security } from "@/components/landing/security"
import { AppPreview } from "@/components/landing/app-preview"
import { OnboardingSteps } from "@/components/landing/onboarding-steps"
import { Footer } from "@/components/landing/footer"
import { siteConfig } from "@/config/site"

export default function Home() {
  return (
    <main
      translate="no"
      className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary"
    >
      {/* 
        This is the new Neon Eco-Fintech {siteConfig.name} Landing Page.
        Each section is modularized in components/landing.
      */}
      <Navbar />
      <div className="pt-24">
        <Hero />
        <TickerTape />
      </div>
      <MarketTabs />
      <SmartCopy />
      <Infrastructure />
      <Leaderboard />
      <AppPreview />
      <OnboardingSteps />
      <Security />
      <Footer />
    </main>
  )
}

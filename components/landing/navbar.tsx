"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { siteConfig } from "@/config/site"
import { Menu, X } from "lucide-react"
import { LanguageSelector } from "@/components/shared/language-selector"

import { useLanguage } from "@/lib/i18n/context"

const navLinks = [
  { titleKey: "common.navbar.trading", href: "/trading" },
  { titleKey: "common.navbar.markets", href: "/markets" },
  { titleKey: "common.navbar.copyExperts", href: "/copy-experts" },
  { titleKey: "common.navbar.learn", href: "/learn" },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const { t } = useLanguage()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-border/20 bg-background/80 py-4 shadow-2xl backdrop-blur-md"
            : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto flex items-center justify-between px-4">
          {/* Logo */}
          <Link href="/" className="group notranslate flex items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-primary/50 bg-primary/20 transition-colors group-hover:bg-primary">
              <span className="text-lg font-black text-primary group-hover:text-primary-foreground">
                C
              </span>
            </div>
            <span className="hidden text-xl font-black tracking-tight sm:block">
              {siteConfig.name.toUpperCase()}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link, i) => (
              <Link
                key={i}
                href={link.href}
                className="group relative text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <span>{t(link.titleKey)}</span>
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Language Selector (Always Visible) */}
            <LanguageSelector triggerClassName="h-7 px-2 rounded-[4px]" />

            {/* Desktop CTA */}
            <div className="hidden items-center gap-4 md:flex">
              <Button
                variant="ghost"
                asChild
                className="font-semibold hover:bg-transparent hover:text-primary"
              >
                <Link href="/login">{t("common.navbar.logIn")}</Link>
              </Button>
              <Button
                asChild
                className="border-glow rounded-full bg-primary px-6 font-semibold text-primary-foreground hover:bg-primary/90"
              >
                <Link href="/register">{t("common.navbar.signUp")}</Link>
              </Button>
            </div>

            {/* Mobile Toggle */}
            <button
              className="shrink-0 text-foreground md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 flex flex-col bg-background/95 px-4 pt-24 pb-8 backdrop-blur-lg md:hidden"
          >
            <div className="flex flex-col items-center gap-6 text-center">
              {navLinks.map((link, i) => (
                <Link
                  key={i}
                  href={link.href}
                  className="text-2xl font-bold transition-colors hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>{t(link.titleKey)}</span>
                </Link>
              ))}
              <div className="mt-8 flex w-full max-w-xs flex-col gap-4">
                <Button
                  variant="outline"
                  asChild
                  className="h-12 w-full rounded-full border-border/50 text-lg"
                >
                  <Link href="/login">{t("common.navbar.logIn")}</Link>
                </Button>
                <Button
                  asChild
                  className="border-glow h-12 w-full rounded-full bg-primary text-lg text-primary-foreground hover:bg-primary/90"
                >
                  <Link href="/register">{t("common.navbar.signUp")}</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

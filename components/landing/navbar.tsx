"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { Menu, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useLanguage } from "@/lib/i18n/context";

const navLinks = [
  { titleKey: "common.navbar.trading", href: "/trading" },
  { titleKey: "common.navbar.markets", href: "/markets" },
  { titleKey: "common.navbar.copyExperts", href: "/copy-experts" },
  { titleKey: "common.navbar.learn", href: "/learn" },
];

const languages = [
  { code: "EN", flag: "🇺🇸", name: "English", id: "en" },
  { code: "ES", flag: "🇪🇸", name: "Español", id: "es" },
  { code: "FR", flag: "🇫🇷", name: "Français", id: "fr" },
  { code: "DE", flag: "🇩🇪", name: "Deutsch", id: "de" },
  { code: "ZH", flag: "🇨🇳", name: "中文", id: "zh-CN" },
  { code: "JA", flag: "🇯🇵", name: "日本語", id: "ja" },
  { code: "KO", flag: "🇰🇷", name: "한국어", id: "ko" },
  { code: "AR", flag: "🇸🇦", name: "العربية", id: "ar" },
  { code: "PT", flag: "🇧🇷", name: "Português", id: "pt" },
  { code: "IT", flag: "🇮🇹", name: "Italiano", id: "it" },
  { code: "RU", flag: "🇷🇺", name: "Русский", id: "ru" },
  { code: "HI", flag: "🇮🇳", name: "हिन्दी", id: "hi" },
  { code: "TR", flag: "🇹🇷", name: "Türkçe", id: "tr" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const { language, setLanguage, t } = useLanguage();
  const selectedLang = languages.find(l => l.id === language) || languages[0];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLanguageChange = (lang: typeof languages[0]) => {
    setLanguage(lang.id);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-background/80 backdrop-blur-md border-b border-border/20 py-4 shadow-2xl" : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group notranslate">
            <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/50 flex items-center justify-center group-hover:bg-primary transition-colors shrink-0">
              <span className="font-black text-primary group-hover:text-primary-foreground text-lg">C</span>
            </div>
            <span className="text-xl font-black tracking-tight hidden sm:block">{siteConfig.name.toUpperCase()}</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link, i) => (
              <Link 
                key={i} 
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
              >
                <span>{t(link.titleKey)}</span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Language Selector (Always Visible) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="notranslate bg-[#f5f5f5] hover:bg-[#e0e0e0] transition-colors text-black border border-transparent h-7 px-2 flex items-center gap-1.5 rounded-[4px] shadow-sm">
                  <span className="text-sm leading-none -mt-[2px]">{selectedLang.flag}</span>
                  <span className="font-bold text-[11px] font-sans">{selectedLang.code}</span>
                  {/* Solid gray triangle */}
                  <svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-500 fill-current">
                    <path d="M4 6L0 0H8L4 6Z" />
                  </svg>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[140px] max-h-[300px] overflow-y-auto bg-white dark:bg-zinc-950 border-border/50">
                {languages.map((lang) => (
                  <DropdownMenuItem 
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang)}
                    className="cursor-pointer notranslate hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                  >
                    <span className="mr-3 text-base">{lang.flag}</span>
                    <span className="font-medium text-sm">{lang.code} - {lang.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-4">
              <Button variant="ghost" className="hover:bg-transparent hover:text-primary font-semibold">
                {t("common.navbar.logIn")}
              </Button>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full border-glow px-6">
                {t("common.navbar.signUp")}
              </Button>
            </div>

            {/* Mobile Toggle */}
            <button 
              className="md:hidden text-foreground shrink-0"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-lg pt-24 px-4 pb-8 flex flex-col md:hidden"
          >
            <div className="flex flex-col gap-6 items-center text-center">
              {navLinks.map((link, i) => (
                <Link 
                  key={i} 
                  href={link.href}
                  className="text-2xl font-bold hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>{t(link.titleKey)}</span>
                </Link>
              ))}
              <div className="flex flex-col gap-4 w-full max-w-xs mt-8">
                <Button variant="outline" className="w-full rounded-full h-12 text-lg border-border/50">
                  {t("common.navbar.logIn")}
                </Button>
                <Button className="w-full rounded-full h-12 text-lg bg-primary hover:bg-primary/90 text-primary-foreground border-glow">
                  {t("common.navbar.signUp")}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

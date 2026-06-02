"use client";

import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/lib/i18n/context";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-background border-t border-border/10 pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-black mb-6 tracking-tighter">
              {siteConfig.name.toUpperCase()}
            </h3>
            <p className="text-muted-foreground text-sm mb-6 max-w-xs leading-relaxed">
              {t("landing.footer.tagline")}
            </p>
            <div className="flex gap-4">
              <Link href={siteConfig.links.twitter} className="text-muted-foreground hover:text-primary transition-colors">
                <Image src="/twitter.svg" alt="Twitter" width={20} height={20} className="w-5 h-5" />
              </Link>
              <Link href={siteConfig.links.github} className="text-muted-foreground hover:text-primary transition-colors">
                <Image src="/instagram.svg" alt="Instagram" width={20} height={20} className="w-5 h-5" />
              </Link>
              <Link href={siteConfig.links.docs} className="text-muted-foreground hover:text-primary transition-colors">
                <Image src="/linkedin.svg" alt="LinkedIn" width={20} height={20} className="w-5 h-5" />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-6">{t("landing.footer.products")}</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">{t("landing.footer.tradingPlatform")}</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">{t("landing.footer.mobileApp")}</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">{t("landing.footer.aiAssistant")}</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">{t("landing.footer.dataAnalytics")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6">{t("landing.footer.company")}</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">{t("landing.footer.aboutUs")}</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">{t("landing.footer.careers")}</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">{t("landing.footer.blog")}</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">{t("landing.footer.press")}</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">{t("landing.footer.contact")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6">{t("landing.footer.subscribe")}</h4>
            <p className="text-sm text-muted-foreground mb-4">{t("landing.footer.subscribeDesc")}</p>
            <div className="flex gap-2">
              <Input 
                type="email" 
                placeholder={t("landing.footer.emailPlaceholder")} 
                className="bg-card/50 border-border/50 focus-visible:ring-primary h-10"
              />
              <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground h-10">
                {t("landing.footer.subscribe")}
              </Button>
            </div>
          </div>
          
        </div>

        <div className="pt-8 border-t border-border/20 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} {siteConfig.name} Inc. {t("landing.footer.allRightsReserved")}</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-primary transition-colors">{t("landing.footer.privacyPolicy")}</Link>
            <Link href="#" className="hover:text-primary transition-colors">{t("landing.footer.termsOfService")}</Link>
            <Link href="#" className="hover:text-primary transition-colors">{t("landing.footer.amlPolicy")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

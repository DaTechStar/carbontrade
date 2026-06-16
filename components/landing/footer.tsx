"use client"

import { siteConfig } from "@/config/site"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/lib/i18n/context"

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="border-t border-border/10 bg-background pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <h3 className="mb-6 text-2xl font-black tracking-tighter">
              {siteConfig.name.toUpperCase()}
            </h3>
            <p
              className="mb-6 max-w-xs text-sm leading-relaxed text-muted-foreground"
              suppressHydrationWarning
            >
              {t("landing.footer.tagline")}
            </p>
            <div className="flex gap-4">
              <Link
                href={siteConfig.links.twitter}
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                <Image
                  src="/twitter.svg"
                  alt="Twitter"
                  width={20}
                  height={20}
                  className="h-5 w-5"
                />
              </Link>
              <Link
                href={siteConfig.links.github}
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                <Image
                  src="/instagram.svg"
                  alt="Instagram"
                  width={20}
                  height={20}
                  className="h-5 w-5"
                />
              </Link>
              <Link
                href={siteConfig.links.docs}
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                <Image
                  src="/linkedin.svg"
                  alt="LinkedIn"
                  width={20}
                  height={20}
                  className="h-5 w-5"
                />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="mb-6 font-semibold" suppressHydrationWarning>
              {t("landing.footer.products")}
            </h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li>
                <Link
                  href="#"
                  className="transition-colors hover:text-primary"
                  suppressHydrationWarning
                >
                  {t("landing.footer.tradingPlatform")}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="transition-colors hover:text-primary"
                  suppressHydrationWarning
                >
                  {t("landing.footer.mobileApp")}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="transition-colors hover:text-primary"
                  suppressHydrationWarning
                >
                  {t("landing.footer.aiAssistant")}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="transition-colors hover:text-primary"
                  suppressHydrationWarning
                >
                  {t("landing.footer.dataAnalytics")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 font-semibold" suppressHydrationWarning>
              {t("landing.footer.company")}
            </h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li>
                <Link
                  href="#"
                  className="transition-colors hover:text-primary"
                  suppressHydrationWarning
                >
                  {t("landing.footer.aboutUs")}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="transition-colors hover:text-primary"
                  suppressHydrationWarning
                >
                  {t("landing.footer.careers")}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="transition-colors hover:text-primary"
                  suppressHydrationWarning
                >
                  {t("landing.footer.blog")}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="transition-colors hover:text-primary"
                  suppressHydrationWarning
                >
                  {t("landing.footer.press")}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="transition-colors hover:text-primary"
                  suppressHydrationWarning
                >
                  {t("landing.footer.contact")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 font-semibold" suppressHydrationWarning>
              {t("landing.footer.subscribe")}
            </h4>
            <p
              className="mb-4 text-sm text-muted-foreground"
              suppressHydrationWarning
            >
              {t("landing.footer.subscribeDesc")}
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder={t("landing.footer.emailPlaceholder")}
                className="h-10 border-border/50 bg-card/50 focus-visible:ring-primary"
              />
              <Button
                className="h-10 bg-primary text-primary-foreground hover:bg-primary/90"
                suppressHydrationWarning
              >
                {t("landing.footer.subscribe")}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-border/20 pt-8 text-xs text-muted-foreground md:flex-row">
          <p>
            © {new Date().getFullYear()} {siteConfig.name} Inc.{" "}
            <span suppressHydrationWarning>
              {t("landing.footer.allRightsReserved")}
            </span>
          </p>
          <div className="flex gap-6">
            <Link
              href="#"
              className="transition-colors hover:text-primary"
              suppressHydrationWarning
            >
              {t("landing.footer.privacyPolicy")}
            </Link>
            <Link
              href="#"
              className="transition-colors hover:text-primary"
              suppressHydrationWarning
            >
              {t("landing.footer.termsOfService")}
            </Link>
            <Link
              href="#"
              className="transition-colors hover:text-primary"
              suppressHydrationWarning
            >
              {t("landing.footer.amlPolicy")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

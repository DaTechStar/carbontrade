"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/lib/i18n/context"
import { SUPPORTED_LANGUAGES, type Language } from "@/lib/i18n/languages"
import { cn } from "@/lib/utils"

interface LanguageSelectorProps {
  triggerClassName?: string
  iconClassName?: string
  showName?: boolean
}

export function LanguageSelector({
  triggerClassName,
  iconClassName,
  showName = false,
}: LanguageSelectorProps) {
  const { language, setLanguage } = useLanguage()
  const selectedLang =
    SUPPORTED_LANGUAGES.find((l) => l.id === language) || SUPPORTED_LANGUAGES[0]

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang.id)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "notranslate flex items-center gap-1.5 border border-border bg-muted text-foreground shadow-sm transition-colors hover:bg-accent",
            triggerClassName || "h-8 rounded-lg px-2.5"
          )}
        >
          <span
            suppressHydrationWarning
            className="-mt-[2px] text-sm leading-none"
          >
            {selectedLang.flag}
          </span>
          <span
            suppressHydrationWarning
            className="font-sans text-[11px] font-bold"
          >
            {selectedLang.code}
          </span>
          {showName && (
            <span className="ml-1 hidden text-xs font-medium sm:inline-block">
              {selectedLang.name}
            </span>
          )}
          <svg
            width="8"
            height="6"
            viewBox="0 0 8 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn("fill-current text-muted-foreground", iconClassName)}
          >
            <path d="M4 6L0 0H8L4 6Z" />
          </svg>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="max-h-[300px] min-w-[140px] overflow-y-auto border-border bg-popover text-popover-foreground"
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang)}
            className="notranslate cursor-pointer text-popover-foreground transition-colors hover:bg-accent focus:bg-accent focus:text-accent-foreground"
          >
            <span className="mr-3 text-base">{lang.flag}</span>
            <span className="text-sm font-medium">
              {lang.code} - {lang.name}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

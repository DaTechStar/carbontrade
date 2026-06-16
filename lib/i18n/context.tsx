"use client"
// Force HMR reload for JSON locales!

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react"
import en from "./locales/en.json"
import es from "./locales/es.json"
import fr from "./locales/fr.json"
import de from "./locales/de.json"
import zhCN from "./locales/zh-CN.json"
import ja from "./locales/ja.json"
import ko from "./locales/ko.json"
import ar from "./locales/ar.json"
import pt from "./locales/pt.json"
import it from "./locales/it.json"
import ru from "./locales/ru.json"
import hi from "./locales/hi.json"
import tr from "./locales/tr.json"

const translations: Record<string, any> = {
  en,
  es,
  fr,
  de,
  "zh-CN": zhCN,
  ja,
  ko,
  ar,
  pt,
  it,
  ru,
  hi,
  tr,
}

// Read localStorage synchronously so the very FIRST client render uses the
// correct language. SSR always returns 'en' (window is undefined).
// suppressHydrationWarning on text nodes silences the SSR vs client mismatch.
function getInitialLanguage(): string {
  if (typeof window === "undefined") return "en"
  try {
    const saved = localStorage.getItem("language")
    return saved && translations[saved] ? saved : "en"
  } catch {
    return "en"
  }
}

interface LanguageContextType {
  language: string
  setLanguage: (lang: string) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<string>(getInitialLanguage)

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language
    }
  }, [language])

  const handleSetLanguage = (lang: string) => {
    const valid = translations[lang] ? lang : "en"
    setLanguage(valid)
    try {
      localStorage.setItem("language", valid)
    } catch {}
  }

  const getNestedValue = (obj: any, path: string) =>
    path.split(".").reduce((acc, part) => acc && acc[part], obj)

  const t = (key: string): string => {
    const dict = translations[language] || translations["en"]
    const val =
      getNestedValue(dict, key) ??
      (language !== "en" ? getNestedValue(translations["en"], key) : undefined)
    return val !== undefined ? val : key
  }

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage: handleSetLanguage, t }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context)
    throw new Error("useLanguage must be used within a LanguageProvider")
  return context
}

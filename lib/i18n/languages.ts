export type Language = {
  code: string
  flag: string
  name: string
  id: string
}

export const SUPPORTED_LANGUAGES: Language[] = [
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
]

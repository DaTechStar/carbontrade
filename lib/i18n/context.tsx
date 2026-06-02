"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import de from './locales/de.json';
import zhCN from './locales/zh-CN.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';
import ar from './locales/ar.json';
import pt from './locales/pt.json';
import it from './locales/it.json';
import ru from './locales/ru.json';
import hi from './locales/hi.json';
import tr from './locales/tr.json';

type Translations = typeof en;

const translations: Record<string, any> = {
  en,
  es,
  fr,
  de,
  'zh-CN': zhCN,
  ja,
  ko,
  ar,
  pt,
  it,
  ru,
  hi,
  tr,
};

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState('en');
  const [mounted, setMounted] = useState(false);

  // Load saved language on mount - only runs on client
  useEffect(() => {
    const saved = localStorage.getItem('language');
    if (saved && translations[saved]) {
      setLanguage(saved);
    }
    setMounted(true);
  }, []);

  // Synchronize dynamic HTML lang attribute with selected state on client
  useEffect(() => {
    if (mounted && typeof document !== "undefined") {
      document.documentElement.lang = language;
    }
  }, [language, mounted]);

  // Save language to localStorage
  const handleSetLanguage = (lang: string) => {
    if (translations[lang]) {
      setLanguage(lang);
      localStorage.setItem('language', lang);
    } else {
      setLanguage('en');
      localStorage.setItem('language', 'en');
    }
  };

  // Helper to get nested object property by string path "a.b.c"
  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  const t = (key: string): string => {
    // Before mount, always return English to match SSR output exactly
    const lang = mounted ? language : 'en';
    const currentDict = translations[lang] || translations['en'];
    let val = getNestedValue(currentDict, key);
    
    if (val === undefined && lang !== 'en') {
      val = getNestedValue(translations['en'], key);
    }
    
    return val !== undefined ? val : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { Locale, Currency } from "@/types/i18n";
import type { Translation } from "@/types/i18n";
import { getTranslation } from "@/i18n";

interface LocaleContextType {
  locale: Locale;
  currency: Currency;
  t: Translation;
  setLocale: (locale: Locale) => void;
  setCurrency: (currency: Currency) => void;
}

const LocaleContext = createContext<LocaleContextType | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [currency, setCurrencyState] = useState<Currency>("USD");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedLocaleStr = window.localStorage.getItem("panda_locale");
    const savedLocale = savedLocaleStr ? (savedLocaleStr.replace(/"/g, "") as Locale) : "en";
    
    const savedCurrencyStr = window.localStorage.getItem("panda_currency");
    const savedCurrency = savedCurrencyStr ? (savedCurrencyStr.replace(/"/g, "") as Currency) : "USD";
    
    setLocaleState(savedLocale);
    setCurrencyState(savedCurrency);
    setMounted(true);
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    window.localStorage.setItem("panda_locale", l);
  }, []);

  const setCurrency = useCallback((c: Currency) => {
    setCurrencyState(c);
    window.localStorage.setItem("panda_currency", c);
  }, []);

  const t = getTranslation(locale);

  if (!mounted) {
    return (
      <LocaleContext.Provider value={{ locale: "en", currency: "USD", t: getTranslation("en"), setLocale, setCurrency }}>
        {children}
      </LocaleContext.Provider>
    );
  }

  return (
    <LocaleContext.Provider value={{ locale, currency, t, setLocale, setCurrency }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextType {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}

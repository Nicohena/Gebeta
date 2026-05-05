"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "@/context/LocaleContext";
import { LOCALES, CURRENCIES } from "@/i18n";

export default function LanguageSwitcher() {
  const { locale, currency, setLocale, setCurrency, t } = useLocale();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"lang" | "currency">("lang");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const currentLocale = LOCALES.find((l) => l.code === locale);
  const currentCurrency = CURRENCIES.find((c) => c.code === currency);

  return (
    <div ref={ref} className="relative">
      <button
        id="language-currency-toggle"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-all duration-200 border border-white/20"
      >
        <span>{currentLocale?.flag}</span>
        <span className="hidden sm:inline text-xs">{currentLocale?.code.toUpperCase()}</span>
        <span className="text-gray-400">·</span>
        <span className="text-[#F97316] text-xs font-semibold">{currentCurrency?.code}</span>
        <svg className={`w-3 h-3 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-60 bg-[#0A0A0A] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
          {/* Tabs */}
          <div className="flex border-b border-white/10">
            <button
              className={`flex-1 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors ${tab === "lang" ? "text-[#F97316] border-b-2 border-[#F97316]" : "text-gray-400 hover:text-white"}`}
              onClick={() => setTab("lang")}
            >
              {t.common.language}
            </button>
            <button
              className={`flex-1 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors ${tab === "currency" ? "text-[#F97316] border-b-2 border-[#F97316]" : "text-gray-400 hover:text-white"}`}
              onClick={() => setTab("currency")}
            >
              {t.common.currency}
            </button>
          </div>

          <div className="p-2">
            {tab === "lang"
              ? LOCALES.map((l) => (
                  <button
                    key={l.code}
                    id={`lang-option-${l.code}`}
                    onClick={() => { setLocale(l.code); setOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${locale === l.code ? "bg-[#F97316]/20 text-[#F97316]" : "text-gray-300 hover:bg-white/10 hover:text-white"}`}
                  >
                    <span className="text-lg">{l.flag}</span>
                    <span className="font-medium">{l.nativeName}</span>
                    {locale === l.code && <span className="ml-auto text-[#F97316]">✓</span>}
                  </button>
                ))
              : CURRENCIES.map((c) => (
                  <button
                    key={c.code}
                    id={`currency-option-${c.code}`}
                    onClick={() => { setCurrency(c.code); setOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${currency === c.code ? "bg-[#F97316]/20 text-[#F97316]" : "text-gray-300 hover:bg-white/10 hover:text-white"}`}
                  >
                    <span className="text-lg">{c.flag}</span>
                    <span className="font-medium">{c.name}</span>
                    <span className="ml-auto text-xs font-mono">{c.symbol}</span>
                    {currency === c.code && <span className="text-[#F97316]">✓</span>}
                  </button>
                ))
            }
          </div>
        </div>
      )}
    </div>
  );
}

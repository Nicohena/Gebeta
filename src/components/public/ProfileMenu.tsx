"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "@/context/LocaleContext";
import { useTheme } from "@/context/ThemeContext";
import { useMenu } from "@/context/MenuContext";
import { LOCALES, CURRENCIES } from "@/i18n";

const UserIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const MoonIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

const SunIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const InfoIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default function ProfileMenu({ isMobile = false }: { isMobile?: boolean }) {
  const { locale, currency, setLocale, setCurrency, t } = useLocale();
  const { theme, toggleTheme } = useTheme();
  const { restaurantSettings } = useMenu();
  const [open, setOpen] = useState(false);
  const [activeView, setActiveView] = useState<"main" | "lang" | "currency" | "about">("main");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setTimeout(() => setActiveView("main"), 200);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const currentLocale = LOCALES.find((l) => l.code === locale);
  const currentCurrency = CURRENCIES.find((c) => c.code === currency);

  return (
    <div ref={ref} className={`relative ${isMobile ? 'flex justify-center items-center' : ''}`}>
      {/* Trigger */}
      {isMobile ? (
        <button
          aria-label="Profile"
          onClick={() => setOpen(!open)}
          className={`relative p-3.5 rounded-full transition-all duration-300 flex items-center justify-center ${
            open ? "bg-white text-black dark:bg-[#2A2A2A] dark:text-white" : "text-white/70 hover:text-white dark:text-gray-400 lg:dark:hover:text-white"
          }`}
        >
          <UserIcon />
        </button>
      ) : (
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-neutral-800 flex items-center justify-center text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-neutral-700">
            <UserIcon />
          </div>
        </button>
      )}

      {/* Menu Dropdown */}
      {open && (
        <div className={`absolute ${isMobile ? 'bottom-full mb-4 right-0' : 'right-0 top-full mt-2'} w-72 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden z-[100] transform transition-all`}>
          
          {/* Header */}
          <div className="flex items-center px-4 py-3 border-b border-gray-100 dark:border-neutral-800 bg-gray-50 dark:bg-[#0A0A0A]">
            {activeView !== "main" && (
              <button 
                onClick={() => setActiveView("main")}
                className="mr-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
            )}
            <h3 className="font-bold text-sm text-gray-800 dark:text-white flex-1 text-center pr-6">
              {activeView === "main" ? "Settings" : 
               activeView === "lang" ? t.common.language : 
               activeView === "currency" ? t.common.currency : "About Us"}
            </h3>
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {activeView === "main" && (
              <div className="p-2 space-y-1">
                {/* Language */}
                <button
                  onClick={() => setActiveView("lang")}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{currentLocale?.flag}</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{t.common.language}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300">
                    <span className="text-xs">{currentLocale?.nativeName}</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </div>
                </button>

                {/* Currency */}
                <button
                  onClick={() => setActiveView("currency")}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl text-gray-400 dark:text-gray-500">$</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{t.common.currency}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300">
                    <span className="text-xs font-semibold text-[#F97316]">{currentCurrency?.code}</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </div>
                </button>

                <div className="h-px bg-gray-100 dark:bg-neutral-800 my-2 mx-4"></div>

                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-gray-400 dark:text-gray-300">
                      {theme === "dark" ? <MoonIcon /> : <SunIcon />}
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      {theme === "dark" ? "Dark Mode" : "Light Mode"}
                    </span>
                  </div>
                  <div className={`w-10 h-6 rounded-full p-1 transition-colors ${theme === "dark" ? "bg-[#3B82F6]" : "bg-gray-300 dark:bg-neutral-700"}`}>
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${theme === "dark" ? "translate-x-4" : "translate-x-0"}`}></div>
                  </div>
                </button>

                {/* About Us */}
                <button
                  onClick={() => setActiveView("about")}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-gray-400 dark:text-gray-300"><InfoIcon /></div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">About Us</span>
                  </div>
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            )}

            {activeView === "lang" && (
              <div className="p-2 space-y-1">
                {LOCALES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => { setLocale(l.code); setActiveView("main"); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${locale === l.code ? "bg-[#F97316]/10 text-[#F97316] font-bold" : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800"}`}
                  >
                    <span className="text-xl">{l.flag}</span>
                    <span className="flex-1 text-left">{l.nativeName}</span>
                    {locale === l.code && <span>✓</span>}
                  </button>
                ))}
              </div>
            )}

            {activeView === "currency" && (
              <div className="p-2 space-y-1">
                {CURRENCIES.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => { setCurrency(c.code); setActiveView("main"); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${currency === c.code ? "bg-[#F97316]/10 text-[#F97316] font-bold" : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800"}`}
                  >
                    <span className="text-xl w-6 text-center">{c.symbol}</span>
                    <span className="flex-1 text-left">{c.name}</span>
                    <span className="text-xs opacity-60 font-mono">{c.code}</span>
                    {currency === c.code && <span>✓</span>}
                  </button>
                ))}
              </div>
            )}

            {activeView === "about" && (
              <div className="p-6 text-center space-y-4">
                <div className="text-5xl">🐼</div>
                <h4 className="font-bold text-xl text-gray-900 dark:text-white" style={{ fontFamily: "var(--font-playfair)" }}>
                  {restaurantSettings.name}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  "{restaurantSettings.tagline}"
                </p>
                <div className="h-px bg-gray-100 dark:bg-neutral-800 my-4"></div>
                <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                  <p className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 text-[#F97316]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {restaurantSettings.address}
                  </p>
                  <p className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 text-[#F97316]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    {restaurantSettings.phone}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

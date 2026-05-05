import type { Locale, Currency, LocaleInfo, CurrencyInfo, Translation } from "@/types/i18n";
import en from "./en";
import am from "./am";
import zh from "./zh";
import fr from "./fr";
import es from "./es";

export const translations: Record<Locale, Translation> = { en, am, zh, fr, es };

export const LOCALES: LocaleInfo[] = [
  { code: "en", label: "English", flag: "🇺🇸", nativeName: "English" },
  { code: "am", label: "Amharic", flag: "🇪🇹", nativeName: "አማርኛ" },
  { code: "zh", label: "Chinese", flag: "🇨🇳", nativeName: "中文" },
  { code: "fr", label: "French", flag: "🇫🇷", nativeName: "Français" },
  { code: "es", label: "Spanish", flag: "🇪🇸", nativeName: "Español" },
];

export const CURRENCIES: CurrencyInfo[] = [
  { code: "USD", symbol: "$", name: "US Dollar", flag: "🇺🇸" },
  { code: "ETB", symbol: "Br", name: "Ethiopian Birr", flag: "🇪🇹" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan", flag: "🇨🇳" },
  { code: "EUR", symbol: "€", name: "Euro", flag: "🇪🇺" },
  { code: "MXN", symbol: "MX$", name: "Mexican Peso", flag: "🇲🇽" },
];

export function getTranslation(locale: Locale): Translation {
  return translations[locale] ?? translations.en;
}

export { en, am, zh, fr, es };
export type { Locale, Currency };

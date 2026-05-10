import type { Currency } from "@/types/i18n";
import type { ExchangeRates } from "@/types/admin";

export const DEFAULT_EXCHANGE_RATES: ExchangeRates = {
  USD: 1.0,
  ETB: 56.5,
  CNY: 7.25,
  EUR: 0.92,
  MXN: 17.15,
};

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: "$",
  ETB: "ETB",
  CNY: "¥",
  EUR: "€",
  MXN: "MX$",
};

export function convertPrice(priceUSD: number, currency: Currency, rates: ExchangeRates): number {
  return priceUSD * rates[currency];
}

export function formatPrice(priceUSD: number, currency: Currency, rates: ExchangeRates): string {
  const converted = convertPrice(priceUSD, currency, rates);
  
  // Custom format for ETB to ensure symbol appears after the price
  if (currency === "ETB") {
    const formattedNumber = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(converted);
    return `${formattedNumber} ${CURRENCY_SYMBOLS.ETB}`;
  }

  const localeMap: Record<Currency, string> = {
    USD: "en-US",
    ETB: "am-ET",
    CNY: "zh-CN",
    EUR: "fr-FR",
    MXN: "es-MX",
  };
  try {
    return new Intl.NumberFormat(localeMap[currency], {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(converted);
  } catch {
    return `${CURRENCY_SYMBOLS[currency]}${converted.toFixed(2)}`;
  }
}

export function applyAdjustmentPreview(
  priceUSD: number,
  type: "percentage" | "fixed",
  direction: "increase" | "decrease",
  value: number
): number {
  const delta = type === "percentage" ? priceUSD * (value / 100) : value;
  const newPrice = direction === "increase" ? priceUSD + delta : priceUSD - delta;
  return Math.max(0.01, Math.round(newPrice * 100) / 100);
}

"use client";
import { useCallback } from "react";
import { useLocale } from "@/context/LocaleContext";
import { useMenu } from "@/context/MenuContext";
import { formatPrice } from "@/lib/priceUtils";
import type { Currency } from "@/types/i18n";

export function usePriceFormatter() {
  const { currency } = useLocale();
  const { exchangeRates } = useMenu();

  const format = useCallback(
    (priceUSD: number, overrideCurrency?: Currency) => {
      return formatPrice(priceUSD, overrideCurrency ?? currency, exchangeRates);
    },
    [currency, exchangeRates]
  );

  return { format, currency, exchangeRates };
}

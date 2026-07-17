export type Locale = "en" | "am" | "zh" | "fr" | "es";

export type Currency = "USD" | "ETB" | "CNY" | "EUR" | "MXN";

export interface CurrencyInfo {
  code: Currency;
  symbol: string;
  name: string;
  flag: string;
}

export interface LocaleInfo {
  code: Locale;
  label: string;
  flag: string;
  nativeName: string;
}

export interface Translation {
  nav: {
    menu: string;
    drinks: string;
    featured: string;
  };
  hero: {
    tagline: string;
    cta: string;
    subtitle: string;
  };
  filter: {
    all: string;
    burgers: string;
    sandwiches: string;
    pizza: string;
    burritos: string;
    noodles: string;
    breakfast: string;
  };
  drinks: {
    title: string;
    subtitle: string;
    mojito: string;
    juice: string;
    milkshake: string;
    softDrink: string;
  };
  featured: {
    title: string;
    subtitle: string;
  };

  footer: {
    tagline: string;
    hours: string;
    hoursValue: string;
    address: string;
    phone: string;
    rights: string;
  };
  badges: {
    chefsPick: string;
    new: string;
    fanFavorite: string;
    signature: string;
  };
  common: {
    from: string;
    addToOrder: string;
    viewDetails: string;
    currency: string;
    language: string;
    loading: string;
  };
}

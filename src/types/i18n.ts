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
    smallPlates: string;
    mains: string;
    burgers: string;
    desserts: string;
    pasta: string;
  };
  drinks: {
    title: string;
    subtitle: string;
    craftCocktails: string;
    coffee: string;
    nonAlcoholic: string;
    wine: string;
    beer: string;
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
    addToOrder: string;
    viewDetails: string;
    currency: string;
    language: string;
    loading: string;
  };
}

export const STORAGE_KEYS = {
  MENU_ITEMS: "panda_menu_items",
  DRINK_ITEMS: "panda_drink_items",
  SETTINGS: "panda_settings",
  EXCHANGE_RATES: "panda_exchange_rates",
  ADMIN_USER: "panda_admin_user",
  RATE_HISTORY: "panda_rate_history",
  LOCALE: "panda_locale",
  CURRENCY: "panda_currency",
} as const;

function isClient(): boolean {
  return typeof window !== "undefined";
}

export const storage = {
  get: <T>(key: string, fallback: T): T => {
    if (!isClient()) return fallback;
    try {
      const item = window.localStorage.getItem(key);
      if (item === null) return fallback;
      return JSON.parse(item) as T;
    } catch {
      return fallback;
    }
  },
  set: <T>(key: string, value: T): void => {
    if (!isClient()) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  },
  remove: (key: string): void => {
    if (!isClient()) return;
    try {
      window.localStorage.removeItem(key);
    } catch {}
  },
  clear: (): void => {
    if (!isClient()) return;
    try {
      Object.values(STORAGE_KEYS).forEach((key) => window.localStorage.removeItem(key));
    } catch {}
  },
};

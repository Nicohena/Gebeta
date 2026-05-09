export const STORAGE_KEYS = {
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

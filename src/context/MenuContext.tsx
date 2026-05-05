"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { MenuItem, DrinkItem, PriceAdjustment, MenuCategory, DrinkCategory } from "@/types/menu";
import type { RestaurantSettings, ExchangeRates, RateHistoryEntry } from "@/types/admin";
import { SEED_MENU_ITEMS, SEED_DRINK_ITEMS } from "@/data/menu";
import { DEFAULT_EXCHANGE_RATES } from "@/lib/priceUtils";
import { storage, STORAGE_KEYS } from "@/lib/storage";

const DEFAULT_SETTINGS: RestaurantSettings = {
  name: "Panda",
  tagline: "Bold flavors. No boundaries.",
  email: "hello@panda.com",
  phone: "+1 (555) 123-4567",
  address: "123 Fusion Ave, Culinary District",
  heroImageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&auto=format&fit=crop",
  heroHeadline: "",
  showHeroCta: true,
  showRewardsBanner: true,
  rewardsHeadline: "Join Panda Rewards",
  rewardsSubtext: "Earn points on every visit. Redeem for exclusive dishes and privileges.",
  hours: {
    Monday: { open: true, openTime: "11:00", closeTime: "22:00" },
    Tuesday: { open: true, openTime: "11:00", closeTime: "22:00" },
    Wednesday: { open: true, openTime: "11:00", closeTime: "22:00" },
    Thursday: { open: true, openTime: "11:00", closeTime: "22:00" },
    Friday: { open: true, openTime: "11:00", closeTime: "00:00" },
    Saturday: { open: true, openTime: "11:00", closeTime: "00:00" },
    Sunday: { open: true, openTime: "12:00", closeTime: "21:00" },
  },
};

interface MenuContextType {
  menuItems: MenuItem[];
  drinkItems: DrinkItem[];
  restaurantSettings: RestaurantSettings;
  exchangeRates: ExchangeRates;
  rateHistory: RateHistoryEntry[];
  lastUpdated: string | null;
  addMenuItem: (item: Omit<MenuItem, "id">) => void;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  toggleItemVisibility: (id: string) => void;
  addDrinkItem: (item: Omit<DrinkItem, "id">) => void;
  updateDrinkItem: (id: string, updates: Partial<DrinkItem>) => void;
  deleteDrinkItem: (id: string) => void;
  toggleDrinkVisibility: (id: string) => void;
  bulkUpdatePrices: (adjustment: PriceAdjustment) => void;
  resetToDefaults: () => void;
  updateSettings: (settings: Partial<RestaurantSettings>) => void;
  updateExchangeRates: (rates: Partial<ExchangeRates>, changedBy: string) => void;
}

const MenuContext = createContext<MenuContextType | null>(null);

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function affectsCategory(
  item: { category: string },
  adjustment: PriceAdjustment
): boolean {
  if (adjustment.category === "All") return true;
  return item.category === adjustment.category;
}

function applyAdjustment(price: number, adjustment: PriceAdjustment): number {
  const delta =
    adjustment.type === "percentage"
      ? price * (adjustment.value / 100)
      : adjustment.value;
  const newPrice =
    adjustment.direction === "increase" ? price + delta : price - delta;
  return Math.max(0.01, Math.round(newPrice * 100) / 100);
}

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(SEED_MENU_ITEMS);
  const [drinkItems, setDrinkItems] = useState<DrinkItem[]>(SEED_DRINK_ITEMS);
  const [restaurantSettings, setRestaurantSettings] = useState<RestaurantSettings>(DEFAULT_SETTINGS);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>(DEFAULT_EXCHANGE_RATES);
  const [rateHistory, setRateHistory] = useState<RateHistoryEntry[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMenuItems(storage.get(STORAGE_KEYS.MENU_ITEMS, SEED_MENU_ITEMS));
    setDrinkItems(storage.get(STORAGE_KEYS.DRINK_ITEMS, SEED_DRINK_ITEMS));
    setRestaurantSettings(storage.get(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS));
    setExchangeRates(storage.get(STORAGE_KEYS.EXCHANGE_RATES, DEFAULT_EXCHANGE_RATES));
    setRateHistory(storage.get(STORAGE_KEYS.RATE_HISTORY, []));
    setMounted(true);
  }, []);

  const persist = useCallback((items: MenuItem[], drinks: DrinkItem[]) => {
    const ts = new Date().toISOString();
    storage.set(STORAGE_KEYS.MENU_ITEMS, items);
    storage.set(STORAGE_KEYS.DRINK_ITEMS, drinks);
    setLastUpdated(ts);
  }, []);

  const addMenuItem = useCallback((item: Omit<MenuItem, "id">) => {
    setMenuItems((prev) => {
      const next = [...prev, { ...item, id: generateId("food") }];
      persist(next, drinkItems);
      return next;
    });
  }, [drinkItems, persist]);

  const updateMenuItem = useCallback((id: string, updates: Partial<MenuItem>) => {
    setMenuItems((prev) => {
      const next = prev.map((m) =>
        m.id === id ? { ...m, ...updates, updatedAt: new Date().toISOString() } : m
      );
      persist(next, drinkItems);
      return next;
    });
  }, [drinkItems, persist]);

  const deleteMenuItem = useCallback((id: string) => {
    setMenuItems((prev) => {
      const next = prev.filter((m) => m.id !== id);
      persist(next, drinkItems);
      return next;
    });
  }, [drinkItems, persist]);

  const toggleItemVisibility = useCallback((id: string) => {
    setMenuItems((prev) => {
      const next = prev.map((m) =>
        m.id === id ? { ...m, visible: !m.visible, updatedAt: new Date().toISOString() } : m
      );
      persist(next, drinkItems);
      return next;
    });
  }, [drinkItems, persist]);

  const addDrinkItem = useCallback((item: Omit<DrinkItem, "id">) => {
    setDrinkItems((prev) => {
      const next = [...prev, { ...item, id: generateId("drink") }];
      persist(menuItems, next);
      return next;
    });
  }, [menuItems, persist]);

  const updateDrinkItem = useCallback((id: string, updates: Partial<DrinkItem>) => {
    setDrinkItems((prev) => {
      const next = prev.map((d) =>
        d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d
      );
      persist(menuItems, next);
      return next;
    });
  }, [menuItems, persist]);

  const deleteDrinkItem = useCallback((id: string) => {
    setDrinkItems((prev) => {
      const next = prev.filter((d) => d.id !== id);
      persist(menuItems, next);
      return next;
    });
  }, [menuItems, persist]);

  const toggleDrinkVisibility = useCallback((id: string) => {
    setDrinkItems((prev) => {
      const next = prev.map((d) =>
        d.id === id ? { ...d, visible: !d.visible, updatedAt: new Date().toISOString() } : d
      );
      persist(menuItems, next);
      return next;
    });
  }, [menuItems, persist]);

  const bulkUpdatePrices = useCallback((adjustment: PriceAdjustment) => {
    setMenuItems((prev) => {
      const next = prev.map((m) =>
        affectsCategory(m, adjustment)
          ? { ...m, priceUSD: applyAdjustment(m.priceUSD, adjustment), updatedAt: new Date().toISOString() }
          : m
      );
      setDrinkItems((prevD) => {
        const nextD = prevD.map((d) =>
          affectsCategory(d, adjustment)
            ? { ...d, priceUSD: applyAdjustment(d.priceUSD, adjustment), updatedAt: new Date().toISOString() }
            : d
        );
        persist(next, nextD);
        return nextD;
      });
      return next;
    });
  }, [persist]);

  const resetToDefaults = useCallback(() => {
    setMenuItems(SEED_MENU_ITEMS);
    setDrinkItems(SEED_DRINK_ITEMS);
    setRestaurantSettings(DEFAULT_SETTINGS);
    setExchangeRates(DEFAULT_EXCHANGE_RATES);
    storage.set(STORAGE_KEYS.MENU_ITEMS, SEED_MENU_ITEMS);
    storage.set(STORAGE_KEYS.DRINK_ITEMS, SEED_DRINK_ITEMS);
    storage.set(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    storage.set(STORAGE_KEYS.EXCHANGE_RATES, DEFAULT_EXCHANGE_RATES);
    setLastUpdated(new Date().toISOString());
  }, []);

  const updateSettings = useCallback((settings: Partial<RestaurantSettings>) => {
    setRestaurantSettings((prev) => {
      const next = { ...prev, ...settings };
      storage.set(STORAGE_KEYS.SETTINGS, next);
      return next;
    });
  }, []);

  const updateExchangeRates = useCallback((rates: Partial<ExchangeRates>, changedBy: string) => {
    setExchangeRates((prev) => {
      const next = { ...prev, ...rates };
      storage.set(STORAGE_KEYS.EXCHANGE_RATES, next);
      const entry: RateHistoryEntry = { timestamp: new Date().toISOString(), changedBy, changes: rates };
      setRateHistory((h) => {
        const updated = [entry, ...h].slice(0, 5);
        storage.set(STORAGE_KEYS.RATE_HISTORY, updated);
        return updated;
      });
      return next;
    });
  }, []);

  if (!mounted) return null;

  return (
    <MenuContext.Provider value={{
      menuItems, drinkItems, restaurantSettings, exchangeRates, rateHistory, lastUpdated,
      addMenuItem, updateMenuItem, deleteMenuItem, toggleItemVisibility,
      addDrinkItem, updateDrinkItem, deleteDrinkItem, toggleDrinkVisibility,
      bulkUpdatePrices, resetToDefaults, updateSettings, updateExchangeRates,
    }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu(): MenuContextType {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error("useMenu must be used within MenuProvider");
  return ctx;
}

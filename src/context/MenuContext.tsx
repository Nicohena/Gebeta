"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { MenuItem, DrinkItem, PriceAdjustment, MenuCategory, DrinkCategory } from "@/types/menu";
import type { RestaurantSettings, ExchangeRates, RateHistoryEntry } from "@/types/admin";
import { SEED_MENU_ITEMS, SEED_DRINK_ITEMS } from "@/data/menu";
import { DEFAULT_EXCHANGE_RATES } from "@/lib/priceUtils";
import { createClient, isSupabaseConfigured } from "@/lib/supabase";

const DEFAULT_SETTINGS: RestaurantSettings = {
  name: "Panda",
  tagline: "Bold flavors. No boundaries.",
  email: "hello@panda.com",
  phone: "+1 (555) 123-4567",
  address: "123 Fusion Ave, Culinary District",
  heroImageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&auto=format&fit=crop",
  heroHeadline: "",
  showHeroCta: true,
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

type MenuItemRow = {
  id: string;
  name: MenuItem["name"];
  description: MenuItem["description"];
  category: string;
  price_usd: number | string;
  image: string;
  badge: string;
  is_signature: boolean;
  visible: boolean;
  created_at: string;
  updated_at: string;
};

type DrinkItemRow = MenuItemRow & {
  sizes: DrinkItem["sizes"] | null;
};

type RestaurantSettingsRow = {
  name: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  hero_image_url: string;
  hero_headline: string;
  show_hero_cta: boolean;
  hours: RestaurantSettings["hours"];
  updated_at: string;
};

type ExchangeRatesRow = {
  usd: number | string;
  etb: number | string;
  cny: number | string;
  eur: number | string;
  mxn: number | string;
  updated_at: string;
};

type RateHistoryRow = {
  timestamp: string;
  changed_by: string;
  changes: Partial<ExchangeRates>;
};

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

function toNumber(value: number | string): number {
  return typeof value === "string" ? Number(value) : value;
}

function toMenuItem(row: MenuItemRow): MenuItem {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    category: row.category as MenuCategory,
    priceUSD: toNumber(row.price_usd),
    image: row.image,
    badge: row.badge as MenuItem["badge"],
    isSignature: row.is_signature,
    visible: row.visible,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toDrinkItem(row: DrinkItemRow): DrinkItem {
  return {
    ...toMenuItem(row),
    category: row.category as DrinkCategory,
    sizes: row.sizes ?? undefined,
  };
}

function toBaseRow(item: Omit<MenuItem | DrinkItem, "id">) {
  return {
    name: item.name,
    description: item.description,
    category: item.category,
    price_usd: item.priceUSD,
    image: item.image,
    badge: item.badge,
    is_signature: item.isSignature,
    visible: item.visible,
  };
}

function toMenuRow(item: Omit<MenuItem, "id">) {
  return toBaseRow(item);
}

function toDrinkRow(item: Omit<DrinkItem, "id">) {
  return {
    ...toBaseRow(item),
    category: item.category,
    sizes: item.sizes ?? null,
  };
}

function toBasePatch(updates: Partial<MenuItem | DrinkItem>) {
  const patch: Partial<ReturnType<typeof toBaseRow>> = {};
  if (updates.name !== undefined) patch.name = updates.name;
  if (updates.description !== undefined) patch.description = updates.description;
  if (updates.category !== undefined) patch.category = updates.category;
  if (updates.priceUSD !== undefined) patch.price_usd = updates.priceUSD;
  if (updates.image !== undefined) patch.image = updates.image;
  if (updates.badge !== undefined) patch.badge = updates.badge;
  if (updates.isSignature !== undefined) patch.is_signature = updates.isSignature;
  if (updates.visible !== undefined) patch.visible = updates.visible;
  return patch;
}

function toMenuPatch(updates: Partial<MenuItem>) {
  return toBasePatch(updates);
}

function toDrinkPatch(updates: Partial<DrinkItem>) {
  return {
    ...toBasePatch(updates),
    ...(updates.category !== undefined ? { category: updates.category } : {}),
    ...(updates.sizes !== undefined ? { sizes: updates.sizes ?? null } : {}),
  };
}

function toSettings(row: RestaurantSettingsRow): RestaurantSettings {
  return {
    name: row.name,
    tagline: row.tagline,
    email: row.email,
    phone: row.phone,
    address: row.address,
    heroImageUrl: row.hero_image_url,
    heroHeadline: row.hero_headline,
    showHeroCta: row.show_hero_cta,
    hours: row.hours,
  };
}

function toSettingsRow(settings: RestaurantSettings) {
  return {
    id: 1,
    name: settings.name,
    tagline: settings.tagline,
    email: settings.email,
    phone: settings.phone,
    address: settings.address,
    hero_image_url: settings.heroImageUrl,
    hero_headline: settings.heroHeadline,
    show_hero_cta: settings.showHeroCta,
    hours: settings.hours,
  };
}

function toExchangeRates(row: ExchangeRatesRow): ExchangeRates {
  return {
    USD: toNumber(row.usd),
    ETB: toNumber(row.etb),
    CNY: toNumber(row.cny),
    EUR: toNumber(row.eur),
    MXN: toNumber(row.mxn),
  };
}

function toExchangeRow(rates: ExchangeRates) {
  return {
    id: 1,
    usd: rates.USD,
    etb: rates.ETB,
    cny: rates.CNY,
    eur: rates.EUR,
    mxn: rates.MXN,
  };
}

function toRateHistory(row: RateHistoryRow): RateHistoryEntry {
  return {
    timestamp: row.timestamp,
    changedBy: row.changed_by,
    changes: row.changes,
  };
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
    let active = true;
    let channel: ReturnType<ReturnType<typeof createClient>['channel']> | null = null;

    async function loadData() {
      if (!isSupabaseConfigured()) {
                                                setMounted(true);
        return;
      }

      const supabase = createClient();
      const [menuResult, drinksResult, settingsResult, ratesResult, historyResult] =
        await Promise.all([
          supabase.from("menu_items").select("*").order("created_at"),
          supabase.from("drink_items").select("*").order("created_at"),
          supabase.from("restaurant_settings").select("*").eq("id", 1).maybeSingle(),
          supabase.from("exchange_rates").select("*").eq("id", 1).maybeSingle(),
          supabase
            .from("rate_history")
            .select("timestamp, changed_by, changes")
            .order("timestamp", { ascending: false })
            .limit(5),
        ]);

      if (!active) return;

      if (menuResult.error || drinksResult.error) {
        console.error("Unable to load Supabase menu data", menuResult.error ?? drinksResult.error);
        setMenuItems(SEED_MENU_ITEMS);
        setDrinkItems(SEED_DRINK_ITEMS);
      } else {
        const items = (menuResult.data as MenuItemRow[]).map(toMenuItem);
        const drinks = (drinksResult.data as DrinkItemRow[]).map(toDrinkItem);
        setMenuItems(items.length > 0 ? items : SEED_MENU_ITEMS);
        setDrinkItems(drinks.length > 0 ? drinks : SEED_DRINK_ITEMS);
      }

      if (settingsResult.error) console.error("Unable to load settings", settingsResult.error);
      if (ratesResult.error) console.error("Unable to load exchange rates", ratesResult.error);
      if (historyResult.error) console.error("Unable to load rate history", historyResult.error);

      if (settingsResult.data) {
        setRestaurantSettings(toSettings(settingsResult.data as RestaurantSettingsRow));
      }
      if (ratesResult.data) {
        setExchangeRates(toExchangeRates(ratesResult.data as ExchangeRatesRow));
      }
      if (historyResult.data) {
        setRateHistory((historyResult.data as RateHistoryRow[]).map(toRateHistory));
      }

      if (isSupabaseConfigured() && active) {
        channel = supabase.channel('schema-db-changes')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'menu_items' }, (payload) => {
            if (payload.eventType === 'INSERT') {
              setMenuItems((prev) => {
                const item = toMenuItem(payload.new as MenuItemRow);
                if (prev.some((m) => m.id === item.id)) return prev;
                return [...prev, item];
              });
            } else if (payload.eventType === 'UPDATE') {
              setMenuItems((prev) => {
                const item = toMenuItem(payload.new as MenuItemRow);
                return prev.map((m) => (m.id === item.id ? item : m));
              });
            } else if (payload.eventType === 'DELETE') {
              setMenuItems((prev) => prev.filter((m) => m.id !== payload.old.id));
            }
          })
          .on('postgres_changes', { event: '*', schema: 'public', table: 'drink_items' }, (payload) => {
            if (payload.eventType === 'INSERT') {
              setDrinkItems((prev) => {
                const item = toDrinkItem(payload.new as DrinkItemRow);
                if (prev.some((m) => m.id === item.id)) return prev;
                return [...prev, item];
              });
            } else if (payload.eventType === 'UPDATE') {
              setDrinkItems((prev) => {
                const item = toDrinkItem(payload.new as DrinkItemRow);
                return prev.map((m) => (m.id === item.id ? item : m));
              });
            } else if (payload.eventType === 'DELETE') {
              setDrinkItems((prev) => prev.filter((m) => m.id !== payload.old.id));
            }
          })
          .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'restaurant_settings' }, (payload) => {
            setRestaurantSettings(toSettings(payload.new as RestaurantSettingsRow));
          })
          .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'exchange_rates' }, (payload) => {
            setExchangeRates(toExchangeRates(payload.new as ExchangeRatesRow));
          })
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'rate_history' }, (payload) => {
            setRateHistory((prev) => [toRateHistory(payload.new as RateHistoryRow), ...prev].slice(0, 5));
          })
          .subscribe();
      }

      setMounted(true);
    }

    loadData();

    return () => {
      active = false;
      if (channel) channel.unsubscribe();
    };
  }, []);

  const addMenuItem = useCallback((item: Omit<MenuItem, "id">) => {
    const optimisticId = generateId("food");
    setMenuItems((prev) => {
      const next = [...prev, { ...item, id: optimisticId }];
      return next;
    });

    if (isSupabaseConfigured()) {
      createClient()
        .from("menu_items")
        .insert(toMenuRow(item))
        .select()
        .single()
        .then(({ data, error }) => {
          if (error) {
            console.error("Unable to add menu item", error);
            return;
          }
          const saved = toMenuItem(data as MenuItemRow);
          setMenuItems((prev) => prev.map((m) => (m.id === optimisticId ? saved : m)));
          setLastUpdated(saved.updatedAt);
        });
    }
  }, [drinkItems]);

  const updateMenuItem = useCallback((id: string, updates: Partial<MenuItem>) => {
    setMenuItems((prev) => {
      const next = prev.map((m) =>
        m.id === id ? { ...m, ...updates, updatedAt: new Date().toISOString() } : m
      );
      return next;
    });

    if (isSupabaseConfigured()) {
      createClient()
        .from("menu_items")
        .update(toMenuPatch(updates))
        .eq("id", id)
        .select()
        .single()
        .then(({ data, error }) => {
          if (error) {
            console.error("Unable to update menu item", error);
            return;
          }
          const saved = toMenuItem(data as MenuItemRow);
          setMenuItems((prev) => prev.map((m) => (m.id === id ? saved : m)));
          setLastUpdated(saved.updatedAt);
        });
    }
  }, [drinkItems]);

  const deleteMenuItem = useCallback((id: string) => {
    setMenuItems((prev) => {
      const next = prev.filter((m) => m.id !== id);
      return next;
    });

    if (isSupabaseConfigured()) {
      createClient()
        .from("menu_items")
        .delete()
        .eq("id", id)
        .then(({ error }) => {
          if (error) console.error("Unable to delete menu item", error);
          else setLastUpdated(new Date().toISOString());
        });
    }
  }, [drinkItems]);

  const toggleItemVisibility = useCallback((id: string) => {
    setMenuItems((prev) => {
      const next = prev.map((m) =>
        m.id === id ? { ...m, visible: !m.visible, updatedAt: new Date().toISOString() } : m
      );
      return next;
    });
    const item = menuItems.find((m) => m.id === id);
    if (item && isSupabaseConfigured()) {
      updateMenuItem(id, { visible: !item.visible });
    }
  }, [drinkItems, menuItems, updateMenuItem]);

  const addDrinkItem = useCallback((item: Omit<DrinkItem, "id">) => {
    const optimisticId = generateId("drink");
    setDrinkItems((prev) => {
      const next = [...prev, { ...item, id: optimisticId }];
      return next;
    });

    if (isSupabaseConfigured()) {
      createClient()
        .from("drink_items")
        .insert(toDrinkRow(item))
        .select()
        .single()
        .then(({ data, error }) => {
          if (error) {
            console.error("Unable to add drink item", error);
            return;
          }
          const saved = toDrinkItem(data as DrinkItemRow);
          setDrinkItems((prev) => prev.map((d) => (d.id === optimisticId ? saved : d)));
          setLastUpdated(saved.updatedAt);
        });
    }
  }, [menuItems]);

  const updateDrinkItem = useCallback((id: string, updates: Partial<DrinkItem>) => {
    setDrinkItems((prev) => {
      const next = prev.map((d) =>
        d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d
      );
      return next;
    });

    if (isSupabaseConfigured()) {
      createClient()
        .from("drink_items")
        .update(toDrinkPatch(updates))
        .eq("id", id)
        .select()
        .single()
        .then(({ data, error }) => {
          if (error) {
            console.error("Unable to update drink item", error);
            return;
          }
          const saved = toDrinkItem(data as DrinkItemRow);
          setDrinkItems((prev) => prev.map((d) => (d.id === id ? saved : d)));
          setLastUpdated(saved.updatedAt);
        });
    }
  }, [menuItems]);

  const deleteDrinkItem = useCallback((id: string) => {
    setDrinkItems((prev) => {
      const next = prev.filter((d) => d.id !== id);
      return next;
    });

    if (isSupabaseConfigured()) {
      createClient()
        .from("drink_items")
        .delete()
        .eq("id", id)
        .then(({ error }) => {
          if (error) console.error("Unable to delete drink item", error);
          else setLastUpdated(new Date().toISOString());
        });
    }
  }, [menuItems]);

  const toggleDrinkVisibility = useCallback((id: string) => {
    setDrinkItems((prev) => {
      const next = prev.map((d) =>
        d.id === id ? { ...d, visible: !d.visible, updatedAt: new Date().toISOString() } : d
      );
      return next;
    });
    const drink = drinkItems.find((d) => d.id === id);
    if (drink && isSupabaseConfigured()) {
      updateDrinkItem(id, { visible: !drink.visible });
    }
  }, [drinkItems, menuItems, updateDrinkItem]);

  const bulkUpdatePrices = useCallback((adjustment: PriceAdjustment) => {
    const updatedMenuItems = menuItems.map((m) =>
      affectsCategory(m, adjustment)
        ? { ...m, priceUSD: applyAdjustment(m.priceUSD, adjustment), updatedAt: new Date().toISOString() }
        : m
    );
    const updatedDrinkItems = drinkItems.map((d) =>
      affectsCategory(d, adjustment)
        ? { ...d, priceUSD: applyAdjustment(d.priceUSD, adjustment), updatedAt: new Date().toISOString() }
        : d
    );

    setMenuItems(updatedMenuItems);
    setDrinkItems(updatedDrinkItems);

    if (isSupabaseConfigured()) {
      const supabase = createClient();
      Promise.all([
        ...updatedMenuItems
          .filter((item) => affectsCategory(item, adjustment))
          .map((item) =>
            supabase
              .from("menu_items")
              .update({ price_usd: item.priceUSD })
              .eq("id", item.id)
          ),
        ...updatedDrinkItems
          .filter((item) => affectsCategory(item, adjustment))
          .map((item) =>
            supabase
              .from("drink_items")
              .update({ price_usd: item.priceUSD })
              .eq("id", item.id)
          ),
      ]).then((results) => {
        const error = results.find((result) => result.error)?.error;
        if (error) console.error("Unable to bulk update prices", error);
        else setLastUpdated(new Date().toISOString());
      });
    }
  }, [drinkItems, menuItems]);

  const resetToDefaults = useCallback(() => {
    setMenuItems(SEED_MENU_ITEMS);
    setDrinkItems(SEED_DRINK_ITEMS);
    setRestaurantSettings(DEFAULT_SETTINGS);
    setExchangeRates(DEFAULT_EXCHANGE_RATES);
    setLastUpdated(new Date().toISOString());

    if (isSupabaseConfigured()) {
      const supabase = createClient();
      Promise.all([
        supabase.from("menu_items").delete().neq("id", "00000000-0000-0000-0000-000000000000"),
        supabase.from("drink_items").delete().neq("id", "00000000-0000-0000-0000-000000000000"),
      ])
        .then(([menuDelete, drinkDelete]) => {
          if (menuDelete.error || drinkDelete.error) {
            throw menuDelete.error ?? drinkDelete.error;
          }
          return Promise.all([
            supabase.from("menu_items").insert(SEED_MENU_ITEMS.map(({ id, ...item }) => toMenuRow(item))),
            supabase.from("drink_items").insert(SEED_DRINK_ITEMS.map(({ id, ...item }) => toDrinkRow(item))),
            supabase.from("restaurant_settings").upsert(toSettingsRow(DEFAULT_SETTINGS)),
            supabase.from("exchange_rates").upsert(toExchangeRow(DEFAULT_EXCHANGE_RATES)),
          ]);
        })
        .then((results) => {
          const error = results.find((result) => result.error)?.error;
          if (error) console.error("Unable to reset Supabase data", error);
        })
        .catch((error) => console.error("Unable to reset Supabase data", error));
    }
  }, []);

  const updateSettings = useCallback((settings: Partial<RestaurantSettings>) => {
    setRestaurantSettings((prev) => {
      const next = { ...prev, ...settings };
        if (isSupabaseConfigured()) {
        createClient()
          .from("restaurant_settings")
          .upsert(toSettingsRow(next))
          .then(({ error }) => {
            if (error) console.error("Unable to update settings", error);
          });
      }
      return next;
    });
  }, []);

  const updateExchangeRates = useCallback((rates: Partial<ExchangeRates>, changedBy: string) => {
    setExchangeRates((prev) => {
      const next = { ...prev, ...rates };
        const entry: RateHistoryEntry = { timestamp: new Date().toISOString(), changedBy, changes: rates };
      setRateHistory((h) => {
        const updated = [entry, ...h].slice(0, 5);
            return updated;
      });
      if (isSupabaseConfigured()) {
        const supabase = createClient();
        Promise.all([
          supabase.from("exchange_rates").upsert(toExchangeRow(next)),
          supabase.from("rate_history").insert({
            timestamp: entry.timestamp,
            changed_by: entry.changedBy,
            changes: entry.changes,
          }),
        ]).then((results) => {
          const error = results.find((result) => result.error)?.error;
          if (error) console.error("Unable to update exchange rates", error);
        });
      }
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

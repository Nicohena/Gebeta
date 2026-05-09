export type MenuCategory =
  | "Small Plates"
  | "Mains"
  | "Burgers"
  | "Desserts"
  | "Pasta";

export type DrinkCategory =
  | "Craft Cocktails"
  | "Coffee"
  | "Non-Alcoholic"
  | "Wine"
  | "Beer";

export type Badge = "none" | "Chef's Pick" | "New" | "Fan Favorite";

export interface LocalizedString {
  en: string;
  am: string;
  zh: string;
  fr: string;
  es: string;
}

export interface DrinkSize {
  label: "S" | "M" | "L";
  priceUSD: number;
}

export interface NutritionInfo {
  kcal: number;
  protein: number;
  fat: number;
  carbs: number;
}

export interface AddOn {
  name: string;
  priceUSD: number;
}

export interface MenuItem {
  id: string;
  name: LocalizedString;
  description: LocalizedString;
  category: MenuCategory;
  priceUSD: number;
  image: string;
  badge: Badge;
  isSignature: boolean;
  visible: boolean;
  ingredients?: string[];
  nutrition?: NutritionInfo;
  addOns?: AddOn[];
  createdAt: string;
  updatedAt: string;
}

export interface DrinkItem {
  id: string;
  name: LocalizedString;
  description: LocalizedString;
  category: DrinkCategory;
  priceUSD: number;
  sizes?: DrinkSize[];
  image: string;
  badge: Badge;
  isSignature: boolean;
  visible: boolean;
  ingredients?: string[];
  nutrition?: NutritionInfo;
  addOns?: AddOn[];
  createdAt: string;
  updatedAt: string;
}

export interface PriceAdjustment {
  category: MenuCategory | DrinkCategory | "All";
  type: "percentage" | "fixed";
  direction: "increase" | "decrease";
  value: number;
}

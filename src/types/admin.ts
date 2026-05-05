export type AdminRole = "superadmin" | "manager";

export interface AdminUser {
  email: string;
  name: string;
  role: AdminRole;
  token: string;
}

export interface StoredAdminUser {
  email: string;
  password: string;
  role: AdminRole;
  name: string;
}

export interface RestaurantSettings {
  name: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  heroImageUrl: string;
  heroHeadline: string;
  showHeroCta: boolean;
  showRewardsBanner: boolean;
  rewardsHeadline: string;
  rewardsSubtext: string;
  hours: {
    [day: string]: {
      open: boolean;
      openTime: string;
      closeTime: string;
    };
  };
}

export interface ExchangeRates {
  USD: number;
  ETB: number;
  CNY: number;
  EUR: number;
  MXN: number;
}

export interface RateHistoryEntry {
  timestamp: string;
  changedBy: string;
  changes: Partial<ExchangeRates>;
}

export interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: string;
  color: "orange" | "blue" | "green" | "red";
}

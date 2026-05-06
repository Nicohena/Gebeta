"use client";

import { useLocale } from "@/context/LocaleContext";
import type { MenuCategory } from "@/types/menu";

const ALL_CATEGORIES: (MenuCategory | "All")[] = ["All", "Small Plates", "Mains", "Burgers", "Pasta", "Desserts"];

interface FilterButtonsProps {
  active: MenuCategory | "All";
  onChange: (cat: MenuCategory | "All") => void;
}

export default function FilterButtons({ active, onChange }: FilterButtonsProps) {
  const { t } = useLocale();

  const labels: Record<MenuCategory | "All", string> = {
    All: t.filter.all,
    "Small Plates": t.filter.smallPlates,
    Mains: t.filter.mains,
    Burgers: t.filter.burgers,
    Pasta: t.filter.pasta,
    Desserts: t.filter.desserts,
  };

  return (
    <div className="flex flex-wrap gap-2 justify-center" role="group" aria-label="Filter menu categories">
      {ALL_CATEGORIES.map((cat) => (
        <button
          key={cat}
          id={`filter-${cat.toLowerCase().replace(/\s+/g, "-")}`}
          onClick={() => onChange(cat)}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 border ${
            active === cat
              ? "bg-[#F97316] text-white border-[#F97316] shadow-lg shadow-orange-400/30 scale-105"
              : "bg-white text-[#1A1A1A] border-[#E5E7EB] dark:bg-neutral-900 dark:text-gray-300 dark:border-neutral-800 lg:hover:border-[#F97316] lg:hover:text-[#F97316]"
          }`}
        >
          {labels[cat]}
        </button>
      ))}
    </div>
  );
}

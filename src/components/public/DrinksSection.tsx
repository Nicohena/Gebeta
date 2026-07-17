"use client";
import { useState } from "react";
import Image from "next/image";
import { useLocale } from "@/context/LocaleContext";
import { useMenu } from "@/context/MenuContext";
import { usePriceFormatter } from "@/hooks/usePriceFormatter";
import ItemDetailModal from "./ItemDetailModal";
import type { DrinkCategory, DrinkItem } from "@/types/menu";

const DRINK_CATEGORIES: (DrinkCategory | "All")[] = ["All", "Mojito", "Juice", "Milkshake", "Soft Drink"];

export default function DrinksSection() {
  const { t, locale } = useLocale();
  const { drinkItems } = useMenu();
  const { format } = usePriceFormatter();
  const [active, setActive] = useState<DrinkCategory | "All">("All");
  const [selectedDrink, setSelectedDrink] = useState<DrinkItem | null>(null);

  // Reversed order
  const visible = [...drinkItems].reverse().filter((d) => d.visible);
  const filtered = active === "All" ? visible : visible.filter((d) => d.category === active);

  const catLabel = (cat: DrinkCategory | "All") => {
    const map: Record<DrinkCategory | "All", string> = {
      All: t.filter.all,
      Mojito: t.drinks.mojito,
      Juice: t.drinks.juice,
      Milkshake: t.drinks.milkshake,
      "Soft Drink": t.drinks.softDrink,
    };
    return map[cat];
  };

  return (
    <section id="drinks" className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-2xl text-[#1A1A1A] dark:text-white">{t.drinks.title}</h2>
      </div>

      {/* Category pills */}
      <div className="flex flex-nowrap sm:flex-wrap gap-2 justify-start sm:justify-center mb-8 overflow-x-auto pb-4 scrollbar-hide">
        {DRINK_CATEGORIES.map((cat) => (
          <button
            key={cat}
            id={`drink-filter-${cat.toLowerCase().replace(/\s+/g, "-")}`}
            onClick={() => setActive(cat)}
            className={`px-5 py-2 whitespace-nowrap rounded-full text-sm font-semibold border transition-all duration-200 ${
              active === cat
                ? "bg-[#F97316] text-white border-[#F97316] shadow-lg shadow-orange-400/30 scale-105"
                : "bg-white text-gray-600 border-[#E5E7EB] dark:bg-neutral-900 dark:text-gray-400 dark:border-neutral-800 hover:border-[#F97316] hover:text-[#F97316] dark:hover:border-[#F97316] dark:hover:text-[#F97316]"
            }`}
          >
            {catLabel(cat)}
          </button>
        ))}
      </div>

      {/* Drink circular items */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <div className="text-4xl mb-4">🥤</div>
          <p className="text-sm">No drinks in this category yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {filtered.map((drink, i) => {
            const name = drink.name[locale] || drink.name.en;
            const hasSizes = drink.sizes && drink.sizes.length > 0;
            return (
              <article
                key={drink.id}
                className="flex flex-col items-center group cursor-pointer"
                style={{ animationDelay: `${i * 60}ms` }}
                onClick={() => setSelectedDrink(drink)}
              >
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 mb-4 rounded-full overflow-hidden bg-gray-50 dark:bg-neutral-800 border border-gray-100 dark:border-neutral-700 shadow-sm group-hover:shadow-md transition-all duration-300">
                  <Image
                    src={drink.image}
                    alt={name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="150px"
                  />
                </div>
                <h3 className="font-semibold text-center text-[#1A1A1A] dark:text-gray-100 text-sm md:text-base leading-snug group-hover:text-[#F97316] transition-colors">
                  {name}
                </h3>
                <p className="text-[#F97316] font-bold text-sm mt-1">
                  {hasSizes && (
                    <span className="text-[10px] uppercase mr-1 text-gray-500 dark:text-gray-400 font-medium">
                      {t.common.from}
                    </span>
                  )}
                  {format(drink.priceUSD)}
                </p>
              </article>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      <ItemDetailModal item={selectedDrink} onClose={() => setSelectedDrink(null)} />
    </section>
  );
}

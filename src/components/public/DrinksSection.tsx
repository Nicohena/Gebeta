"use client";
import { useState } from "react";
import Image from "next/image";
import { useLocale } from "@/context/LocaleContext";
import { useMenu } from "@/context/MenuContext";
import { usePriceFormatter } from "@/hooks/usePriceFormatter";
import ItemDetailModal from "./ItemDetailModal";
import type { DrinkCategory, DrinkItem } from "@/types/menu";

const DRINK_CATEGORIES: (DrinkCategory | "All")[] = ["All", "Craft Cocktails", "Coffee", "Non-Alcoholic", "Wine", "Beer"];

export default function DrinksSection() {
  const { t, locale } = useLocale();
  const { drinkItems } = useMenu();
  const { format } = usePriceFormatter();
  const [active, setActive] = useState<DrinkCategory | "All">("All");
  const [selectedDrink, setSelectedDrink] = useState<DrinkItem | null>(null);

  const visible = drinkItems.filter((d) => d.visible);
  const filtered = active === "All" ? visible : visible.filter((d) => d.category === active);

  const catLabel = (cat: DrinkCategory | "All") => {
    const map: Record<DrinkCategory | "All", string> = {
      All: t.filter.all,
      "Craft Cocktails": t.drinks.craftCocktails,
      Coffee: t.drinks.coffee,
      "Non-Alcoholic": t.drinks.nonAlcoholic,
      Wine: t.drinks.wine,
      Beer: t.drinks.beer,
    };
    return map[cat];
  };

  return (
    <section id="drinks" className="py-8">
      {/* Category pills */}
      <div className="flex flex-nowrap sm:flex-wrap gap-2 justify-start md:justify-center mb-12 overflow-x-auto pb-4 scrollbar-hide">
        {DRINK_CATEGORIES.map((cat) => (
          <button
            key={cat}
            id={`drink-filter-${cat.toLowerCase().replace(/\s+/g, "-")}`}
            onClick={() => setActive(cat)}
            className={`px-5 py-2 whitespace-nowrap rounded-full text-sm font-semibold border transition-all duration-200 ${
              active === cat
                ? "bg-[#1A1A1A] text-white border-[#1A1A1A] dark:bg-white dark:text-[#1A1A1A] dark:border-white"
                : "bg-white text-gray-600 border-[#E5E7EB] dark:bg-neutral-900 dark:text-gray-400 dark:border-neutral-800 hover:border-[#1A1A1A] hover:text-[#1A1A1A] dark:hover:border-white dark:hover:text-white"
            }`}
          >
            {catLabel(cat)}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-2xl text-[#1A1A1A] dark:text-white">All Drinks</h2>
        <button className="text-sm font-semibold text-[#3B82F6] hover:text-[#F97316] transition-colors">
          View all
        </button>
      </div>

      {/* Drink circular items */}
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
                {hasSizes && <span className="text-[10px] uppercase mr-1 text-gray-500 dark:text-gray-400 font-medium">{t.common.from}</span>}
                {format(drink.priceUSD)}
              </p>
            </article>
          );
        })}
      </div>

      {/* Detail Modal */}
      <ItemDetailModal item={selectedDrink} onClose={() => setSelectedDrink(null)} />
    </section>
  );
}

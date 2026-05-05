"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale } from "@/context/LocaleContext";
import { useMenu } from "@/context/MenuContext";
import { usePriceFormatter } from "@/hooks/usePriceFormatter";
import type { DrinkCategory } from "@/types/menu";

const DRINK_CATEGORIES: (DrinkCategory | "All")[] = ["All", "Craft Cocktails", "Coffee", "Non-Alcoholic", "Wine", "Beer"];

export default function DrinksSection() {
  const { t, locale } = useLocale();
  const { drinkItems } = useMenu();
  const { format } = usePriceFormatter();
  const [active, setActive] = useState<DrinkCategory | "All">("All");

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
    <section id="drinks" className="py-20 bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-[#F97316] text-xs font-bold uppercase tracking-[0.3em] mb-3 block">🍹 Beverages</span>
          <h2 className="text-[#1A1A1A] font-bold text-4xl mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
            {t.drinks.title}
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">{t.drinks.subtitle}</p>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {DRINK_CATEGORIES.map((cat) => (
            <button
              key={cat}
              id={`drink-filter-${cat.toLowerCase().replace(/\s+/g, "-")}`}
              onClick={() => setActive(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200 ${
                active === cat
                  ? "bg-[#F97316] text-white border-[#F97316] shadow-md"
                  : "bg-white text-gray-600 border-[#E5E7EB] hover:border-[#F97316] hover:text-[#F97316]"
              }`}
            >
              {catLabel(cat)}
            </button>
          ))}
        </div>

        {/* Drink cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((drink, i) => {
            const name = drink.name[locale] || drink.name.en;
            const desc = drink.description[locale] || drink.description.en;
            return (
              <article
                key={drink.id}
                className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <Image src={drink.image} alt={name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                  {drink.badge !== "none" && (
                    <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${
                      drink.badge === "Chef's Pick" ? "bg-amber-500 text-white" :
                      drink.badge === "New" ? "bg-emerald-500 text-white" : "bg-purple-500 text-white"
                    }`}>
                      {drink.badge}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-[#1A1A1A] text-base leading-snug" style={{ fontFamily: "var(--font-playfair)" }}>{name}</h3>
                    <span className="text-[#F97316] font-bold text-base shrink-0">{format(drink.priceUSD)}</span>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-3">{desc}</p>
                  {drink.sizes && (
                    <div className="flex gap-2">
                      {drink.sizes.map((s) => (
                        <span key={s.label} className="text-xs px-2.5 py-1 bg-[#F97316]/10 text-[#F97316] rounded-full font-semibold">
                          {s.label} · {format(s.priceUSD)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

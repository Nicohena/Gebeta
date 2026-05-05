"use client";

import { useState } from "react";
import { useMenu } from "@/context/MenuContext";
import { useLocale } from "@/context/LocaleContext";
import FilterButtons from "./FilterButtons";
import MenuCard from "./MenuCard";
import type { MenuCategory } from "@/types/menu";

export default function FoodSection() {
  const { t } = useLocale();
  const { menuItems } = useMenu();
  const [active, setActive] = useState<MenuCategory | "All">("All");

  const visible = menuItems.filter((m) => m.visible);
  const filtered = active === "All" ? visible : visible.filter((m) => m.category === active);

  return (
    <section id="menu" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-[#F97316] text-xs font-bold uppercase tracking-[0.3em] mb-3 block">🍽️ Our Menu</span>
          <h2 className="text-[#1A1A1A] font-bold text-4xl mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
            {t.nav.menu}
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Handcrafted dishes using the finest ingredients from around the world.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-10">
          <FilterButtons active={active} onChange={setActive} />
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">🍽️</div>
            <p className="text-lg">No items in this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((item, i) => (
              <MenuCard key={item.id} item={item} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

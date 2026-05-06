"use client";

import { useState } from "react";
import { useMenu } from "@/context/MenuContext";
import FilterButtons from "./FilterButtons";
import MenuCard from "./MenuCard";
import type { MenuCategory } from "@/types/menu";

export default function FoodSection() {
  const { menuItems } = useMenu();
  const [active, setActive] = useState<MenuCategory | "All">("All");

  const visible = menuItems.filter((m) => m.visible);
  const filtered = active === "All" ? visible : visible.filter((m) => m.category === active);

  return (
    <section id="menu" className="py-8 border-t border-gray-100 mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-2xl text-[#1A1A1A]">Food</h2>
        <button className="text-sm font-semibold text-[#3B82F6] hover:text-[#F97316] transition-colors">
          View all
        </button>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <FilterButtons active={active} onChange={setActive} />
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <div className="text-4xl mb-4">🍽️</div>
          <p className="text-sm">No items in this category yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((item, i) => (
            <MenuCard key={item.id} item={item} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}

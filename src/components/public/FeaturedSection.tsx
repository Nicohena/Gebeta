"use client";

import { useState } from "react";
import { useLocale } from "@/context/LocaleContext";
import { useMenu } from "@/context/MenuContext";
import MenuCard from "./MenuCard";
import ItemDetailModal from "./ItemDetailModal";
import type { MenuItem } from "@/types/menu";

export default function FeaturedSection() {
  const { t } = useLocale();
  const { menuItems } = useMenu();
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const featured = menuItems.filter(
    (item) => item.visible && (item.isSignature || item.badge === "Chef's Pick")
  ).slice(0, 4);

  if (featured.length === 0) return null;

  return (
    <section id="featured" className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-2xl text-[#1A1A1A] dark:text-white">{t.featured.title}</h2>
        <button className="text-sm font-semibold text-[#3B82F6] hover:text-[#F97316] transition-colors">
          View all
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {featured.map((item, i) => (
          <div key={item.id} onClick={() => setSelectedItem(item)} className="cursor-pointer">
            <MenuCard item={item} index={i} />
          </div>
        ))}
      </div>

      <ItemDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </section>
  );
}

"use client";

import { useLocale } from "@/context/LocaleContext";
import { useMenu } from "@/context/MenuContext";
import MenuCard from "./MenuCard";

export default function FeaturedSection() {
  const { t } = useLocale();
  const { menuItems } = useMenu();

  const featured = menuItems.filter(
    (item) => item.visible && (item.isSignature || item.badge === "Chef's Pick")
  ).slice(0, 4);

  if (featured.length === 0) return null;

  return (
    <section id="featured" className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-2xl text-[#1A1A1A]">{t.featured.title}</h2>
        <button className="text-sm font-semibold text-[#3B82F6] hover:text-[#F97316] transition-colors">
          View all
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {featured.map((item, i) => (
          <MenuCard key={item.id} item={item} index={i} />
        ))}
      </div>
    </section>
  );
}

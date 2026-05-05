"use client";

import { useLocale } from "@/context/LocaleContext";
import { useMenu } from "@/context/MenuContext";
import MenuCard from "./MenuCard";

export default function FeaturedSection() {
  const { t } = useLocale();
  const { menuItems } = useMenu();

  const featured = menuItems.filter(
    (item) => item.visible && (item.isSignature || item.badge === "Chef's Pick")
  ).slice(0, 3);

  if (featured.length === 0) return null;

  return (
    <section id="featured" className="py-20 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-[#F97316] text-xs font-bold uppercase tracking-[0.3em] mb-3 block">
            ✦ Curated
          </span>
          <h2
            className="text-white font-bold text-4xl mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {t.featured.title}
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">{t.featured.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map((item, i) => (
            <div key={item.id} className="[&>article]:bg-[#161616] [&>article]:border-white/10 [&_h3]:text-white [&_p]:text-gray-400 [&_.text-gray-400.text-xs]:text-gray-500">
              <MenuCard item={item} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

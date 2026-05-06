"use client";

import Image from "next/image";
import { useLocale } from "@/context/LocaleContext";
import { usePriceFormatter } from "@/hooks/usePriceFormatter";
import type { MenuItem } from "@/types/menu";

interface MenuCardProps {
  item: MenuItem;
  index?: number;
}

const BADGE_STYLES: Record<string, string> = {
  "Chef's Pick": "bg-amber-500 text-white",
  New: "bg-emerald-500 text-white",
  "Fan Favorite": "bg-purple-500 text-white",
};

export default function MenuCard({ item, index = 0 }: MenuCardProps) {
  const { locale, t } = useLocale();
  const { format } = usePriceFormatter();

  const name = item.name[locale] || item.name.en;
  const description = item.description[locale] || item.description.en;

  return (
    <article
      className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-[#E5E7EB] dark:border-neutral-800 overflow-hidden group lg:hover:shadow-xl lg:hover:shadow-black/10 dark:lg:hover:shadow-black/40 lg:hover:-translate-y-1 transition-all duration-300"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Image */}
      <div className="relative h-36 sm:h-52 overflow-hidden bg-gray-100 dark:bg-neutral-800">
        <Image
          src={item.image}
          alt={name}
          fill
          className="object-cover lg:group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {item.badge !== "none" && (
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${BADGE_STYLES[item.badge] ?? "bg-gray-700 text-white"}`}>
              {item.badge === "Chef's Pick" ? t.badges.chefsPick
                : item.badge === "New" ? t.badges.new
                : t.badges.fanFavorite}
            </span>
          )}
          {item.isSignature && (
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#0A0A0A] text-[#F97316]">
              {t.badges.signature}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 sm:gap-3 mb-1 sm:mb-2">
          <h3
            className="font-bold text-[#1A1A1A] dark:text-white text-sm sm:text-base leading-snug flex-1 line-clamp-1 sm:line-clamp-none"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {name}
          </h3>
          <span className="text-gray-500 sm:text-[#F97316] font-medium sm:font-bold text-xs sm:text-base whitespace-nowrap shrink-0">
            {format(item.priceUSD)}
          </span>
        </div>
        <p className="hidden sm:-webkit-box text-gray-500 dark:text-gray-400 text-sm leading-relaxed line-clamp-2">
          {description}
        </p>
        <div className="hidden sm:flex mt-4 items-center justify-between">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            {item.category}
          </span>
        </div>
      </div>
    </article>
  );
}

"use client";

import { useState } from "react";
import { useFavorites } from "@/context/FavoritesContext";
import { useMenu } from "@/context/MenuContext";
import type { MenuItem, DrinkItem } from "@/types/menu";
import Image from "next/image";
import { useLocale } from "@/context/LocaleContext";
import { usePriceFormatter } from "@/hooks/usePriceFormatter";
import ItemDetailModal from "./ItemDetailModal";

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default function FavoritesDrawer({ isOpen, onClose }: FavoritesDrawerProps) {
  const { favorites } = useFavorites();
  const { menuItems, drinkItems } = useMenu();
  const { locale } = useLocale();
  const { format } = usePriceFormatter();
  const [selectedItem, setSelectedItem] = useState<MenuItem | DrinkItem | null>(null);

  // Combine and filter favorites
  const favoriteItems = [...menuItems, ...drinkItems].filter((item) =>
    favorites.includes(item.id)
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-[100] transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white dark:bg-[#1A1A1A] z-[110] shadow-2xl transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-neutral-800">
          <h2 className="font-bold text-2xl text-[#1A1A1A] dark:text-white" style={{ fontFamily: "var(--font-playfair)" }}>
            Saved Items
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {favoriteItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
              <svg className="w-16 h-16 mb-4 text-gray-300 dark:text-neutral-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              <p className="font-medium text-lg text-gray-600 dark:text-gray-300 mb-2">No favorites yet</p>
              <p className="text-sm">Tap the heart icon on any item to save it here for later.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {favoriteItems.map((item) => {
                const name = item.name[locale] || item.name.en;
                const isDrink = "sizes" in item;
                return (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3 rounded-2xl border border-gray-100 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-800/50 cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors group"
                    onClick={() => setSelectedItem(item)}
                  >
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                      <Image src={item.image} alt={name} fill className="object-cover" sizes="80px" />
                    </div>
                    <div className="flex-1 py-1">
                      <h3 className="font-bold text-[#1A1A1A] dark:text-white text-sm line-clamp-1 group-hover:text-[#F97316] transition-colors">{name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wide">{item.category}</p>
                      <p className="font-bold text-[#F97316] text-sm mt-2">
                        {isDrink && (item as DrinkItem).sizes && <span className="text-[10px] font-medium text-gray-400 mr-1">FROM</span>}
                        {format(item.priceUSD)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <ItemDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </>
  );
}

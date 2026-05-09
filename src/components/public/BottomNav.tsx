"use client";

import { useState, useEffect } from "react";
import { useLocale } from "@/context/LocaleContext";
import ProfileMenu from "./ProfileMenu";
import FavoritesDrawer from "./FavoritesDrawer";

const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
  </svg>
);

const DrinksIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h1a4 4 0 1 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4ZM6 2v2M10 2v2M14 2v2" />
  </svg>
);

const FeaturedIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657zM9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
  </svg>
);

const HeartIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);

export default function BottomNav() {
  const { t } = useLocale();
  const [active, setActive] = useState("#menu");
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);

  const navItems = [
    { id: "#menu", label: t.nav.menu, icon: <MenuIcon /> },
    { id: "#drinks", label: t.nav.drinks, icon: <DrinksIcon /> },
    { id: "#featured", label: t.nav.featured, icon: <FeaturedIcon /> },
    { id: "#favorites", label: "Favorites", icon: <HeartIcon /> },
  ];

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    if (id === "#favorites") {
      setIsFavoritesOpen(true);
      return;
    }
    setActive(id);
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#1A1A1A]/95 backdrop-blur-md rounded-[2.5rem] px-2 py-2 flex items-center justify-between w-[95%] max-w-[400px] z-50 shadow-2xl">
        {navItems.map((item) => (
          <a
            key={item.id}
            href={item.id}
            onClick={(e) => handleClick(e, item.id)}
            aria-label={item.label}
            className={`relative p-3.5 rounded-full transition-all duration-300 flex items-center justify-center ${
              active === item.id && item.id !== "#favorites" ? "bg-[#E5E7EB] text-[#1A1A1A]" : "text-gray-400 lg:hover:text-white"
            }`}
          >
            {item.icon}
          </a>
        ))}
        <ProfileMenu isMobile={true} />
      </div>

      <FavoritesDrawer isOpen={isFavoritesOpen} onClose={() => setIsFavoritesOpen(false)} />
    </>
  );
}

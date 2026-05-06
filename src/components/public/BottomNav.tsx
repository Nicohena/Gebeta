"use client";

import { useState, useEffect } from "react";
import { useLocale } from "@/context/LocaleContext";
import ProfileMenu from "./ProfileMenu";

const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
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



export default function BottomNav() {
  const { t } = useLocale();
  const [active, setActive] = useState("#menu");

  const navItems = [
    { id: "#menu", label: t.nav.menu, icon: <MenuIcon /> },
    { id: "#drinks", label: t.nav.drinks, icon: <DrinksIcon /> },
    { id: "#featured", label: t.nav.featured, icon: <FeaturedIcon /> },
  ];

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setActive(id);
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#1A1A1A]/95 backdrop-blur-md rounded-[2.5rem] px-2 py-2 flex items-center justify-between w-[90%] max-w-[360px] z-50 shadow-2xl">
      {navItems.map((item) => (
        <a
          key={item.id}
          href={item.id}
          onClick={(e) => handleClick(e, item.id)}
          aria-label={item.label}
          className={`relative p-3.5 rounded-full transition-all duration-300 flex items-center justify-center ${
            active === item.id ? "bg-[#E5E7EB] text-[#1A1A1A]" : "text-gray-400 lg:hover:text-white"
          }`}
        >
          {item.icon}
        </a>
      ))}
      <ProfileMenu isMobile={true} />
    </div>
  );
}

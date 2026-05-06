"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";
import { useMenu } from "@/context/MenuContext";

// Simple SVG Icons
const MenuIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
const DrinksIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h1a4 4 0 1 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4ZM6 2v2M10 2v2M14 2v2" /></svg>;
const FeaturedIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657zM9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg>;

export default function Sidebar() {
  const { t } = useLocale();
  const { restaurantSettings } = useMenu();
  const [active, setActive] = useState("#menu");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "#menu", label: t.nav.menu, icon: <MenuIcon /> },
    { href: "#drinks", label: t.nav.drinks, icon: <DrinksIcon /> },
    { href: "#featured", label: t.nav.featured, icon: <FeaturedIcon /> },
  ];

  const handleNavClick = (href: string) => {
    setActive(href);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Sidebar (fixed on desktop) */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-[#1A1A1A] border-r border-gray-100 dark:border-neutral-800 flex-col transition-colors duration-300">
        
        {/* Logo (hidden on mobile header) */}
        <div className="hidden md:flex items-center gap-2 px-8 py-8">
          <span className="text-3xl">🐼</span>
          <span className="text-[#1A1A1A] dark:text-white font-bold text-2xl tracking-wide" style={{ fontFamily: "var(--font-playfair)" }}>
            Panda
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 mt-4 space-y-2">
          {navLinks.map((link) => {
            const isActive = active === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={() => handleNavClick(link.href)}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-semibold ${
                  isActive 
                    ? "bg-[#FAFAFA] text-[#1A1A1A] dark:bg-neutral-800 dark:text-white" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-[#1A1A1A] dark:text-gray-400 dark:hover:bg-neutral-800/50 dark:hover:text-white"
                }`}
              >
                <div className={`${isActive ? "text-[#F97316]" : "text-gray-400 dark:text-gray-500"}`}>
                  {link.icon}
                </div>
                {link.label}
              </a>
            );
          })}
        </nav>


      </aside>
    </>
  );
}

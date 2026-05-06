"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";
import { useMenu } from "@/context/MenuContext";

// Simple SVG Icons
const HomeIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const DrinksIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>; // Substitute icon
const FoodIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;

export default function Sidebar() {
  const { t } = useLocale();
  const { restaurantSettings } = useMenu();
  const [active, setActive] = useState("#menu");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "#menu", label: t.nav.menu, icon: <HomeIcon /> },
    { href: "#drinks", label: t.nav.drinks, icon: <DrinksIcon /> },
    { href: "#featured", label: t.nav.featured, icon: <FoodIcon /> },
    { href: "#rewards", label: t.nav.rewards, icon: <HomeIcon /> },
  ];

  const handleNavClick = (href: string) => {
    setActive(href);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Header (visible only on small screens) */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white z-50 px-4 flex items-center justify-between border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl">🐼</span>
          <span className="text-[#1A1A1A] font-bold text-xl tracking-wide" style={{ fontFamily: "var(--font-playfair)" }}>
            Panda
          </span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-gray-600 focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             {mobileMenuOpen ? (
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
             ) : (
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
             )}
          </svg>
        </button>
      </div>

      {/* Sidebar (fixed on desktop, toggleable on mobile) */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${mobileMenuOpen ? "translate-x-0 pt-16 md:pt-0" : "-translate-x-full pt-16 md:pt-0"}`}>
        
        {/* Logo (hidden on mobile header) */}
        <div className="hidden md:flex items-center gap-2 px-8 py-8">
          <span className="text-3xl">🐼</span>
          <span className="text-[#1A1A1A] font-bold text-2xl tracking-wide" style={{ fontFamily: "var(--font-playfair)" }}>
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
                    ? "bg-[#FAFAFA] text-[#1A1A1A]" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-[#1A1A1A]"
                }`}
              >
                <div className={`${isActive ? "text-[#F97316]" : "text-gray-400"}`}>
                  {link.icon}
                </div>
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Rewards Banner (Vertical Sidebar Version) */}
        {restaurantSettings.showRewardsBanner && (
          <div className="p-4 mt-auto mb-6">
            <div className="bg-[#0A0A0A] rounded-2xl p-5 text-center relative overflow-hidden shadow-xl shadow-black/10">
              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-[#1A1A1A]" />
              <div className="absolute top-4 left-4 text-white/10 text-4xl">★</div>
              
              <div className="relative z-10 text-white">
                <div className="text-3xl mb-2">🐼</div>
                <h3 className="font-bold text-lg mb-1 leading-tight tracking-wide" style={{ fontFamily: "var(--font-playfair)" }}>
                  PANDA REWARDS
                </h3>
                <p className="text-xs text-gray-400 mb-4 px-2">
                  Every bite makes a reward.
                </p>
                <button className="w-full bg-white text-[#1A1A1A] font-bold py-2 rounded-full text-xs hover:bg-gray-100 transition-colors">
                  Join now
                </button>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Overlay for mobile */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 md:hidden" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}

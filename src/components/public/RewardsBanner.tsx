"use client";

import { useLocale } from "@/context/LocaleContext";
import { useMenu } from "@/context/MenuContext";

export default function RewardsBanner() {
  const { t } = useLocale();
  const { restaurantSettings } = useMenu();

  if (!restaurantSettings.showRewardsBanner) return null;

  return (
    <section id="rewards" className="py-16 bg-gradient-to-br from-[#F97316] via-[#f97316] to-[#ea6b10] relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-white/5" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="text-5xl mb-6">🐼</div>
        <h2
          className="text-white font-bold text-4xl mb-4 leading-tight"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          {restaurantSettings.rewardsHeadline || t.rewards.title}
        </h2>
        <p className="text-white/90 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
          {restaurantSettings.rewardsSubtext || t.rewards.subtitle}
        </p>
        <button
          id="rewards-signup-btn"
          className="inline-flex items-center gap-2 bg-white text-[#F97316] font-bold px-8 py-4 rounded-full text-base hover:bg-white/90 transition-all duration-200 hover:scale-105 hover:shadow-xl shadow-lg"
        >
          {t.rewards.cta}
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>

        {/* Stats row */}
        <div className="mt-12 grid grid-cols-3 gap-6 max-w-lg mx-auto">
          {[
            { value: "2×", label: "Points on birthdays" },
            { value: "Free", label: "Welcome dessert" },
            { value: "VIP", label: "Early access" },
          ].map((stat) => (
            <div key={stat.label} className="text-white/90">
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs mt-1 text-white/70">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

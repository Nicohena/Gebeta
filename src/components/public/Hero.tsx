"use client";

import Image from "next/image";
import { useLocale } from "@/context/LocaleContext";
import { useMenu } from "@/context/MenuContext";

export default function Hero() {
  const { t } = useLocale();
  const { restaurantSettings } = useMenu();

  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src={restaurantSettings.heroImageUrl}
          alt="Panda Restaurant"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      {/* Animated grain overlay */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")"
      }} />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Logo badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-8 animate-fade-in">
          <span className="text-2xl">🐼</span>
          <span className="text-white font-semibold tracking-widest uppercase text-xs">
            {restaurantSettings.name}
          </span>
        </div>

        {/* Tagline */}
        <h1
          className="text-white font-bold mb-6 leading-tight"
          style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(2.5rem, 7vw, 5rem)" }}
        >
          {restaurantSettings.heroHeadline || t.hero.tagline}
        </h1>

        <p className="text-gray-200 text-lg mb-10 max-w-xl mx-auto leading-relaxed" style={{ fontFamily: "var(--font-dm-sans)" }}>
          {t.hero.subtitle}
        </p>

        {restaurantSettings.showHeroCta && (
          <a
            href="#menu"
            id="hero-cta"
            className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-[#ea6b10] text-white font-semibold px-8 py-4 rounded-full text-base transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/30"
          >
            {t.hero.cta}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        )}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/50">
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-white/50 to-transparent animate-pulse" />
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import { useLocale } from "@/context/LocaleContext";
import { useMenu } from "@/context/MenuContext";

export default function Hero() {
  const { t } = useLocale();
  const { restaurantSettings } = useMenu();

  return (
    <section className="relative w-full rounded-3xl overflow-hidden bg-[#0A0A0A] shadow-2xl mb-12 flex flex-col md:flex-row min-h-[360px]">
      
      {/* Text Content */}
      <div className="relative z-10 flex-1 p-8 md:p-12 flex flex-col justify-center">
        <h1
          className="text-white font-bold text-4xl md:text-5xl lg:text-6xl mb-4 leading-tight"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          {restaurantSettings.heroHeadline || t.hero.tagline}
        </h1>
        
        <p className="text-gray-300 text-lg max-w-md mb-8 leading-relaxed" style={{ fontFamily: "var(--font-dm-sans)" }}>
          {t.hero.subtitle}
        </p>

        {restaurantSettings.showHeroCta && (
          <div>
            <a
              href="#menu"
              className="inline-flex items-center justify-center bg-[#F97316] hover:bg-[#ea6b10] text-white font-semibold px-6 py-3 rounded-full text-sm transition-all duration-300 hover:scale-105"
            >
              {t.hero.cta}
            </a>
          </div>
        )}
      </div>

      {/* Image Content */}
      <div className="relative w-full md:w-1/2 min-h-[250px] md:min-h-full">
        {/* Decorative sloped background using clip-path on desktop */}
        <div className="hidden md:block absolute inset-0 bg-[#0A0A0A] z-10 w-32" style={{ clipPath: "polygon(0 0, 100% 0, 0 100%, 0% 100%)" }} />
        
        <Image
          src={restaurantSettings.heroImageUrl}
          alt="Panda Restaurant"
          fill
          className="object-cover object-center"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        
        {/* Gradient overlay for blending */}
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0A0A0A]/80 md:from-[#0A0A0A]/50 to-transparent" />
      </div>
    </section>
  );
}

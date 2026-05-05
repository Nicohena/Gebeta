"use client";

import { useLocale } from "@/context/LocaleContext";
import { useMenu } from "@/context/MenuContext";

export default function Footer() {
  const { t } = useLocale();
  const { restaurantSettings } = useMenu();

  const days = Object.entries(restaurantSettings.hours);

  return (
    <footer className="bg-[#0A0A0A] text-gray-400 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🐼</span>
              <span className="text-white font-bold text-2xl" style={{ fontFamily: "var(--font-playfair)" }}>
                {restaurantSettings.name}
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed italic mb-6">
              &ldquo;{t.footer.tagline}&rdquo;
            </p>
            <div className="flex gap-3">
              {["instagram", "twitter", "facebook"].map((sn) => (
                <a
                  key={sn}
                  href="#"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#F97316] transition-colors duration-200"
                  aria-label={sn}
                >
                  <span className="text-sm">
                    {sn === "instagram" ? "📸" : sn === "twitter" ? "🐦" : "📘"}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              {t.footer.hours}
            </h3>
            <div className="space-y-1.5">
              {days.map(([day, hrs]) => (
                <div key={day} className="flex justify-between text-sm">
                  <span className="text-gray-400">{day.slice(0, 3)}</span>
                  <span className={hrs.open ? "text-gray-300" : "text-gray-600"}>
                    {hrs.open ? `${hrs.openTime} – ${hrs.closeTime}` : "Closed"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Find Us</h3>
            <div className="space-y-3 text-sm">
              <p className="flex items-start gap-2">
                <span className="text-[#F97316] mt-0.5">📍</span>
                <span>{restaurantSettings.address}</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-[#F97316]">📞</span>
                <a href={`tel:${restaurantSettings.phone}`} className="hover:text-white transition-colors">
                  {restaurantSettings.phone}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-[#F97316]">✉️</span>
                <a href={`mailto:${restaurantSettings.email}`} className="hover:text-white transition-colors">
                  {restaurantSettings.email}
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600">
          <p>{t.footer.rights}</p>
          <a href="/admin" className="hover:text-gray-400 transition-colors">Admin ↗</a>
        </div>
      </div>
    </footer>
  );
}

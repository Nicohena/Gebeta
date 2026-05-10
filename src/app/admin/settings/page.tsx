"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useMenu } from "@/context/MenuContext";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { useTheme } from "@/context/ThemeContext";
import AdminToggle from "@/components/admin/AdminToggle";
import type { RestaurantSettings } from "@/types/admin";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-[#E5E7EB] dark:border-neutral-800 p-6 space-y-5">
    <h3 className="font-bold text-[#1A1A1A] dark:text-white text-base border-b border-[#E5E7EB] dark:border-neutral-800 pb-3" style={{ fontFamily: "var(--font-playfair)" }}>{title}</h3>
    {children}
  </div>
);

const Field = ({ label, id, children }: { label: string; id?: string; children: React.ReactNode }) => (
  <div>
    <label htmlFor={id} className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 block">{label}</label>
    {children}
  </div>
);

const inputCls = "w-full bg-white dark:bg-neutral-900 border border-[#E5E7EB] dark:border-neutral-700 focus:border-[#3B82F6] dark:focus:border-[#3B82F6] text-[#1A1A1A] dark:text-white rounded-xl px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-gray-400 dark:placeholder:text-neutral-500";

export default function AdminSettingsPage() {
  const { user } = useAdminAuth();
  const { restaurantSettings, updateSettings } = useMenu();
  const { theme, toggleTheme } = useTheme();
  const [form, setForm] = useState<RestaurantSettings>({ ...restaurantSettings });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm({ ...restaurantSettings });
  }, [restaurantSettings]);

  if (user?.role !== "superadmin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="text-5xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2" style={{ fontFamily: "var(--font-playfair)" }}>Access Denied</h2>
        <p className="text-gray-500">Only Super Admins can access restaurant settings.</p>
      </div>
    );
  }

  const set = (key: keyof RestaurantSettings, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  function handleSave() {
    updateSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="max-w-3xl space-y-6">
      {/* General */}
      <Section title="General">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Restaurant Name" id="setting-name">
            <input id="setting-name" value={form.name} onChange={(e) => set("name", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Tagline" id="setting-tagline">
            <input id="setting-tagline" value={form.tagline} onChange={(e) => set("tagline", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Contact Email" id="setting-email">
            <input id="setting-email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Phone Number" id="setting-phone">
            <input id="setting-phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} className={inputCls} />
          </Field>
        </div>
        <Field label="Address" id="setting-address">
          <input id="setting-address" value={form.address} onChange={(e) => set("address", e.target.value)} className={inputCls} />
        </Field>
      </Section>

      {/* Hero */}
      <Section title="Hero Section">
        <Field label="Hero Image URL" id="setting-hero-image">
          <input id="setting-hero-image" value={form.heroImageUrl} onChange={(e) => set("heroImageUrl", e.target.value)} className={inputCls} placeholder="https://images.unsplash.com/..." />
        </Field>
        {form.heroImageUrl && (
          <div className="relative h-40 rounded-xl overflow-hidden border border-[#E5E7EB]">
            <Image src={form.heroImageUrl} alt="Hero preview" fill className="object-cover" sizes="700px" />
          </div>
        )}
        <Field label="Hero Headline Override (EN)" id="setting-hero-headline">
          <input id="setting-hero-headline" value={form.heroHeadline} onChange={(e) => set("heroHeadline", e.target.value)} placeholder="Leave empty to use tagline" className={inputCls} />
        </Field>
        <AdminToggle id="toggle-hero-cta" checked={form.showHeroCta} onChange={(v) => set("showHeroCta", v)} label="Show Hero CTA Button" />
      </Section>



      {/* Hours */}
      <Section title="Operating Hours">
        <div className="space-y-4 sm:space-y-3">
          {DAYS.map((day) => {
            const hrs = form.hours[day] ?? { open: true, openTime: "11:00", closeTime: "22:00" };
            return (
              <div key={day} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 border-b border-gray-50 pb-3 sm:border-0 sm:pb-0 last:border-0">
                <div className="w-24 shrink-0">
                  <AdminToggle
                    id={`hours-toggle-${day.toLowerCase()}`}
                    checked={hrs.open}
                    onChange={(v) => set("hours", { ...form.hours, [day]: { ...hrs, open: v } })}
                    label={day.slice(0, 3)}
                    size="sm"
                  />
                </div>
                <div className="flex items-center gap-2 sm:gap-4 ml-1">
                  <input
                    type="time"
                    value={hrs.openTime}
                    disabled={!hrs.open}
                    onChange={(e) => set("hours", { ...form.hours, [day]: { ...hrs, openTime: e.target.value } })}
                    className="flex-1 sm:flex-none bg-white dark:bg-neutral-900 text-[#1A1A1A] dark:text-white border border-[#E5E7EB] dark:border-neutral-700 rounded-xl px-3 py-1.5 text-sm outline-none focus:border-[#3B82F6] disabled:opacity-40 disabled:cursor-not-allowed min-w-0"
                  />
                  <span className="text-gray-400 dark:text-gray-500 text-sm shrink-0">to</span>
                  <input
                    type="time"
                    value={hrs.closeTime}
                    disabled={!hrs.open}
                    onChange={(e) => set("hours", { ...form.hours, [day]: { ...hrs, closeTime: e.target.value } })}
                    className="flex-1 sm:flex-none bg-white dark:bg-neutral-900 text-[#1A1A1A] dark:text-white border border-[#E5E7EB] dark:border-neutral-700 rounded-xl px-3 py-1.5 text-sm outline-none focus:border-[#3B82F6] disabled:opacity-40 disabled:cursor-not-allowed min-w-0"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Appearance */}
      <Section title="Appearance">
        <div>
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Admin Theme</p>
          <div className="grid grid-cols-2 gap-3">
            {/* Light Mode */}
            <button
              id="theme-light-btn"
              onClick={() => theme === "dark" && toggleTheme()}
              className={`relative flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-200 ${
                theme === "light"
                  ? "border-[#3B82F6] bg-blue-50 dark:bg-blue-950/30"
                  : "border-[#E5E7EB] dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-500"
              }`}
            >
              {/* Light preview */}
              <div className="w-full h-16 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden flex flex-col gap-1 p-1.5">
                <div className="h-2 w-1/2 rounded bg-gray-300" />
                <div className="h-1.5 w-3/4 rounded bg-gray-200" />
                <div className="h-1.5 w-2/3 rounded bg-gray-200" />
                <div className="mt-1 h-3 w-1/3 rounded bg-blue-300" />
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2a1 1 0 011 1v1a1 1 0 01-2 0V3a1 1 0 011-1zm7.071 2.929a1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 0zM21 11a1 1 0 010 2h-1a1 1 0 010-2h1zm-2.929 7.071a1 1 0 01-1.414 0l-.707-.707a1 1 0 011.414-1.414l.707.707a1 1 0 010 1.414zM13 20a1 1 0 01-2 0v-1a1 1 0 012 0v1zm-7.071-2.929a1 1 0 010-1.414l.707-.707a1 1 0 011.414 1.414l-.707.707a1 1 0 01-1.414 0zM4 13a1 1 0 010-2h1a1 1 0 010 2H4zm2.929-7.071a1 1 0 011.414 0l.707.707A1 1 0 017.636 8.05l-.707-.707a1 1 0 010-1.414zM12 7a5 5 0 100 10A5 5 0 0012 7z" />
                </svg>
                <span className="text-sm font-semibold text-[#1A1A1A] dark:text-white">Light</span>
                {theme === "light" && (
                  <span className="ml-auto w-4 h-4 rounded-full bg-[#3B82F6] flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </span>
                )}
              </div>
            </button>

            {/* Dark Mode */}
            <button
              id="theme-dark-btn"
              onClick={() => theme === "light" && toggleTheme()}
              className={`relative flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-200 ${
                theme === "dark"
                  ? "border-[#3B82F6] bg-blue-50 dark:bg-blue-950/30"
                  : "border-[#E5E7EB] dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-500"
              }`}
            >
              {/* Dark preview */}
              <div className="w-full h-16 rounded-xl bg-[#1A1A1A] border border-neutral-700 overflow-hidden flex flex-col gap-1 p-1.5">
                <div className="h-2 w-1/2 rounded bg-neutral-600" />
                <div className="h-1.5 w-3/4 rounded bg-neutral-700" />
                <div className="h-1.5 w-2/3 rounded bg-neutral-700" />
                <div className="mt-1 h-3 w-1/3 rounded bg-blue-600" />
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
                </svg>
                <span className="text-sm font-semibold text-[#1A1A1A] dark:text-white">Dark</span>
                {theme === "dark" && (
                  <span className="ml-auto w-4 h-4 rounded-full bg-[#3B82F6] flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>
      </Section>

      {/* Save */}
      <div className="flex justify-end pb-8">
        <button
          id="save-settings-btn"
          onClick={handleSave}
          className={`px-8 py-3 text-sm font-semibold text-white rounded-xl transition-all shadow-sm ${saved ? "bg-emerald-500" : "bg-[#3B82F6] hover:bg-blue-700"}`}
        >
          {saved ? "✓ Settings Saved!" : "Save Settings"}
        </button>
      </div>
    </div>
  );
}

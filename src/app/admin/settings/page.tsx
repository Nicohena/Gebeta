"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useMenu } from "@/context/MenuContext";
import { useAdminAuth } from "@/context/AdminAuthContext";
import AdminToggle from "@/components/admin/AdminToggle";
import type { RestaurantSettings } from "@/types/admin";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function AdminSettingsPage() {
  const { user } = useAdminAuth();
  const { restaurantSettings, updateSettings } = useMenu();
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

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 space-y-5">
      <h3 className="font-bold text-[#1A1A1A] text-base border-b border-[#E5E7EB] pb-3" style={{ fontFamily: "var(--font-playfair)" }}>{title}</h3>
      {children}
    </div>
  );

  const Field = ({ label, id, children }: { label: string; id?: string; children: React.ReactNode }) => (
    <div>
      <label htmlFor={id} className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">{label}</label>
      {children}
    </div>
  );

  const inputCls = "w-full border border-[#E5E7EB] focus:border-[#3B82F6] rounded-xl px-3 py-2.5 text-sm outline-none transition-colors";

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

      {/* Rewards */}
      <Section title="Rewards Banner">
        <AdminToggle id="toggle-rewards" checked={form.showRewardsBanner} onChange={(v) => set("showRewardsBanner", v)} label="Show Rewards Banner" />
        <Field label="Rewards Headline" id="setting-rewards-headline">
          <input id="setting-rewards-headline" value={form.rewardsHeadline} onChange={(e) => set("rewardsHeadline", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Rewards Subtext" id="setting-rewards-subtext">
          <textarea id="setting-rewards-subtext" rows={2} value={form.rewardsSubtext} onChange={(e) => set("rewardsSubtext", e.target.value)} className={`${inputCls} resize-none`} />
        </Field>
      </Section>

      {/* Hours */}
      <Section title="Operating Hours">
        <div className="space-y-3">
          {DAYS.map((day) => {
            const hrs = form.hours[day] ?? { open: true, openTime: "11:00", closeTime: "22:00" };
            return (
              <div key={day} className="flex items-center gap-4">
                <div className="w-24 shrink-0">
                  <AdminToggle
                    id={`hours-toggle-${day.toLowerCase()}`}
                    checked={hrs.open}
                    onChange={(v) => set("hours", { ...form.hours, [day]: { ...hrs, open: v } })}
                    label={day.slice(0, 3)}
                    size="sm"
                  />
                </div>
                <input
                  type="time"
                  value={hrs.openTime}
                  disabled={!hrs.open}
                  onChange={(e) => set("hours", { ...form.hours, [day]: { ...hrs, openTime: e.target.value } })}
                  className="border border-[#E5E7EB] rounded-xl px-3 py-1.5 text-sm outline-none focus:border-[#3B82F6] disabled:opacity-40 disabled:cursor-not-allowed"
                />
                <span className="text-gray-400 text-sm">to</span>
                <input
                  type="time"
                  value={hrs.closeTime}
                  disabled={!hrs.open}
                  onChange={(e) => set("hours", { ...form.hours, [day]: { ...hrs, closeTime: e.target.value } })}
                  className="border border-[#E5E7EB] rounded-xl px-3 py-1.5 text-sm outline-none focus:border-[#3B82F6] disabled:opacity-40 disabled:cursor-not-allowed"
                />
              </div>
            );
          })}
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

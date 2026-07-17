"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import AdminToggle from "./AdminToggle";
import type { MenuItem, DrinkItem, Badge, MenuCategory, DrinkCategory } from "@/types/menu";

type ItemType = "food" | "drink";

interface AdminItemModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (item: Omit<MenuItem, "id"> | Omit<DrinkItem, "id">) => void;
  itemType: ItemType;
  editItem?: MenuItem | DrinkItem | null;
}

const FOOD_CATEGORIES: MenuCategory[] = ["Burgers", "Sandwiches", "Pizza", "Burritos", "Noodles", "Breakfast"];
const DRINK_CATEGORIES: DrinkCategory[] = ["Mojito", "Juice", "Milkshake", "Soft Drink"];
const BADGES: Badge[] = ["none", "Chef's Pick", "New", "Fan Favorite"];
const LOCALES = ["en", "am", "zh", "fr", "es"] as const;
const LOCALE_FLAGS: Record<string, string> = { en: "🇺🇸", am: "🇪🇹", zh: "🇨🇳", fr: "🇫🇷", es: "🇪🇸" };
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop";

type LocaleKey = typeof LOCALES[number];

function emptyLocalizedString() {
  return { en: "", am: "", zh: "", fr: "", es: "" };
}

export default function AdminItemModal({ open, onClose, onSave, itemType, editItem }: AdminItemModalProps) {
  const [tab, setTab] = useState<"basic" | "descriptions" | "media">("basic");
  const [name, setName] = useState(emptyLocalizedString());
  const [description, setDescription] = useState(emptyLocalizedString());
  const [category, setCategory] = useState<MenuCategory | DrinkCategory>(
    itemType === "food" ? "Burgers" : "Mojito"
  );
  const [priceUSD, setPriceUSD] = useState("12.00");
  const [badge, setBadge] = useState<Badge>("none");
  const [isSignature, setIsSignature] = useState(false);
  const [visible, setVisible] = useState(true);
  const [image, setImage] = useState(DEFAULT_IMAGE);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editItem) {
      setName({ ...emptyLocalizedString(), ...editItem.name });
      setDescription({ ...emptyLocalizedString(), ...editItem.description });
      setCategory(editItem.category as MenuCategory | DrinkCategory);
      setPriceUSD(editItem.priceUSD.toFixed(2));
      setBadge(editItem.badge);
      setIsSignature(editItem.isSignature);
      setVisible(editItem.visible);
      setImage(editItem.image);
    } else {
      setName(emptyLocalizedString());
      setDescription(emptyLocalizedString());
      setCategory(itemType === "food" ? "Burgers" : "Mojito");
      setPriceUSD("12.00");
      setBadge("none");
      setIsSignature(false);
      setVisible(true);
      setImage(DEFAULT_IMAGE);
    }
    setTab("basic");
    setErrors({});
  }, [editItem, open, itemType]);

  if (!open) return null;

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!name.en.trim()) errs["name.en"] = "English name is required";
    const price = parseFloat(priceUSD);
    if (isNaN(price) || price <= 0) errs.price = "Price must be a positive number";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSave() {
    if (!validate()) { setTab("basic"); return; }
    const now = new Date().toISOString();
    const base = {
      name: { ...name },
      description: { ...description },
      category,
      priceUSD: parseFloat(priceUSD),
      badge,
      isSignature,
      visible,
      image,
      createdAt: editItem?.createdAt ?? now,
      updatedAt: now,
    };
    onSave(base as Omit<MenuItem, "id">);
    onClose();
  }

  const categories = itemType === "food" ? FOOD_CATEGORIES : DRINK_CATEGORIES;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
          <h2 className="font-bold text-[#1A1A1A] text-lg" style={{ fontFamily: "var(--font-playfair)" }}>
            {editItem ? "Edit" : "Add"} {itemType === "food" ? "Menu Item" : "Drink"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#E5E7EB] px-6">
          {(["basic", "descriptions", "media"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-3 text-sm font-semibold capitalize border-b-2 -mb-px transition-colors ${tab === t ? "border-[#3B82F6] text-[#3B82F6]" : "border-transparent text-gray-400 hover:text-gray-600"}`}
            >
              {t === "basic" ? "Basic Info" : t === "descriptions" ? "Descriptions" : "Media"}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Tab 1: Basic Info */}
          {tab === "basic" && (
            <div className="space-y-5">
              {/* Names per locale */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">Item Name (per language)</label>
                <div className="space-y-2">
                  {LOCALES.map((loc) => (
                    <div key={loc}>
                      <div className="flex items-center gap-2">
                        <span className="text-lg w-7">{LOCALE_FLAGS[loc]}</span>
                        <input
                          id={`name-${loc}`}
                          value={name[loc]}
                          onChange={(e) => setName((prev) => ({ ...prev, [loc]: e.target.value }))}
                          placeholder={loc === "en" ? "Required" : "Optional"}
                          className={`flex-1 border rounded-xl px-3 py-2 text-sm outline-none transition-colors ${errors[`name.${loc}`] ? "border-red-400 focus:border-red-500" : "border-[#E5E7EB] focus:border-[#3B82F6]"}`}
                        />
                      </div>
                      {errors[`name.${loc}`] && <p className="text-red-500 text-xs mt-1 ml-9">{errors[`name.${loc}`]}</p>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Category + Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Category</label>
                  <select
                    id="item-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as MenuCategory | DrinkCategory)}
                    className="w-full border border-[#E5E7EB] rounded-xl px-3 py-2 text-sm outline-none focus:border-[#3B82F6] bg-white"
                  >
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Price (USD)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input
                      id="item-price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={priceUSD}
                      onChange={(e) => setPriceUSD(e.target.value)}
                      className={`w-full border rounded-xl pl-7 pr-3 py-2 text-sm outline-none transition-colors ${errors.price ? "border-red-400" : "border-[#E5E7EB] focus:border-[#3B82F6]"}`}
                    />
                  </div>
                  {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                </div>
              </div>

              {/* Badge */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Badge</label>
                <div className="flex flex-wrap gap-2">
                  {BADGES.map((b) => (
                    <label key={b} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm cursor-pointer transition-all ${badge === b ? "bg-[#1A1A1A] text-white border-[#1A1A1A]" : "border-[#E5E7EB] text-gray-600 hover:border-gray-400"}`}>
                      <input type="radio" name="badge" value={b} checked={badge === b} onChange={() => setBadge(b)} className="sr-only" />
                      {b === "none" ? "No badge" : b}
                    </label>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="flex gap-6 flex-wrap">
                <AdminToggle id="toggle-signature" checked={isSignature} onChange={setIsSignature} label="Signature Item" />
                <AdminToggle id="toggle-visible" checked={visible} onChange={setVisible} label="Visible on menu" />
              </div>
            </div>
          )}

          {/* Tab 2: Descriptions */}
          {tab === "descriptions" && (
            <div className="space-y-4">
              <p className="text-xs text-gray-400">All locales optional except English.</p>
              {LOCALES.map((loc) => (
                <div key={loc}>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <span>{LOCALE_FLAGS[loc]}</span> {loc.toUpperCase()}
                    <span className="ml-auto text-gray-300 font-normal">{description[loc].length}/200</span>
                  </label>
                  <textarea
                    id={`desc-${loc}`}
                    rows={3}
                    maxLength={200}
                    value={description[loc]}
                    onChange={(e) => setDescription((prev) => ({ ...prev, [loc]: e.target.value }))}
                    placeholder={loc === "en" ? "Describe this item..." : "Optional"}
                    className="w-full border border-[#E5E7EB] focus:border-[#3B82F6] rounded-xl px-3 py-2 text-sm outline-none resize-none transition-colors"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Media */}
          {tab === "media" && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Image URL (Unsplash)</label>
                <input
                  id="item-image-url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full border border-[#E5E7EB] focus:border-[#3B82F6] rounded-xl px-3 py-2 text-sm outline-none transition-colors"
                />
                <button
                  onClick={() => setImage(DEFAULT_IMAGE)}
                  className="mt-2 text-xs text-[#3B82F6] hover:underline"
                >
                  Use placeholder image
                </button>
              </div>
              {image && (
                <div className="relative h-52 rounded-xl overflow-hidden border border-[#E5E7EB] bg-gray-50">
                  <Image src={image} alt="Preview" fill className="object-cover" sizes="600px" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#E5E7EB] bg-gray-50">
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-200 rounded-xl transition-colors">
            Cancel
          </button>
          <button
            id="save-item-btn"
            onClick={handleSave}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-[#3B82F6] hover:bg-blue-700 rounded-xl transition-colors shadow-sm"
          >
            Save Item
          </button>
        </div>
      </div>
    </div>
  );
}

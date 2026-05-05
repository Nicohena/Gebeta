"use client";

import { useState, useMemo } from "react";
import { useMenu } from "@/context/MenuContext";
import { applyAdjustmentPreview } from "@/lib/priceUtils";
import type { PriceAdjustment, MenuCategory, DrinkCategory } from "@/types/menu";
import ConfirmDialog from "./ConfirmDialog";

const ALL_CATS = ["All", "Small Plates", "Mains", "Burgers", "Pasta", "Desserts", "Craft Cocktails", "Coffee", "Non-Alcoholic"] as const;

export default function AdminPriceEditor() {
  const { menuItems, drinkItems, bulkUpdatePrices, updateMenuItem, updateDrinkItem, resetToDefaults } = useMenu();
  const [category, setCategory] = useState<typeof ALL_CATS[number]>("All");
  const [adjType, setAdjType] = useState<"percentage" | "fixed">("percentage");
  const [direction, setDirection] = useState<"increase" | "decrease">("increase");
  const [value, setValue] = useState("10");
  const [preview, setPreview] = useState(false);
  const [confirmApply, setConfirmApply] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const adjustment: PriceAdjustment = { category: category as MenuCategory | DrinkCategory | "All", type: adjType, direction, value: parseFloat(value) || 0 };

  const allItems = useMemo(() => [
    ...menuItems.map((m) => ({ id: m.id, name: m.name.en, category: m.category, priceUSD: m.priceUSD, type: "food" as const })),
    ...drinkItems.map((d) => ({ id: d.id, name: d.name.en, category: d.category, priceUSD: d.priceUSD, type: "drink" as const })),
  ], [menuItems, drinkItems]);

  const previewItems = useMemo(() => allItems.filter((item) => {
    if (category === "All") return true;
    return item.category === category;
  }).map((item) => {
    const delta = adjType === "percentage" ? item.priceUSD * (adjustment.value / 100) : adjustment.value;
    const newPrice = direction === "increase" ? item.priceUSD + delta : item.priceUSD - delta;
    return { ...item, newPrice: Math.max(0.01, Math.round(newPrice * 100) / 100), change: direction === "increase" ? delta : -delta };
  }), [allItems, category, adjType, direction, adjustment.value]);

  function handleApply() {
    bulkUpdatePrices(adjustment);
    setPreview(false);
    setConfirmApply(false);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left: Controls */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 space-y-6">
        <h3 className="font-bold text-[#1A1A1A] text-lg" style={{ fontFamily: "var(--font-playfair)" }}>Bulk Price Adjustment</h3>

        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Category</label>
          <select id="price-category" value={category} onChange={(e) => setCategory(e.target.value as typeof ALL_CATS[number])}
            className="w-full border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm bg-white outline-none focus:border-[#3B82F6]">
            {ALL_CATS.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Adjustment Type</label>
          <div className="flex gap-2">
            {(["percentage", "fixed"] as const).map((t) => (
              <button key={t} onClick={() => setAdjType(t)}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-xl border transition-all ${adjType === t ? "bg-[#1A1A1A] text-white border-[#1A1A1A]" : "border-[#E5E7EB] text-gray-500 hover:border-gray-400"}`}>
                {t === "percentage" ? "Percentage (%)" : "Fixed Amount ($)"}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Direction</label>
          <div className="flex gap-2">
            {(["increase", "decrease"] as const).map((d) => (
              <button key={d} onClick={() => setDirection(d)}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-xl border transition-all ${direction === d ? (d === "increase" ? "bg-emerald-500 text-white border-emerald-500" : "bg-red-500 text-white border-red-500") : "border-[#E5E7EB] text-gray-500 hover:border-gray-400"}`}>
                {d === "increase" ? "▲ Increase" : "▼ Decrease"}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
            Value ({adjType === "percentage" ? "%" : "$"})
          </label>
          <input id="price-value" type="number" min="0" step={adjType === "percentage" ? "1" : "0.01"} value={value} onChange={(e) => setValue(e.target.value)}
            className="w-full border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#3B82F6]" />
        </div>

        <div className="flex flex-col gap-2">
          <button id="preview-changes-btn" onClick={() => setPreview(true)}
            className="w-full py-3 text-sm font-semibold text-[#1A1A1A] bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
            Preview Changes
          </button>
          <button id="apply-all-btn" onClick={() => setConfirmApply(true)}
            className="w-full py-3 text-sm font-semibold text-white bg-[#F97316] hover:bg-[#ea6b10] rounded-xl transition-colors shadow-sm">
            Apply to All
          </button>
          <button onClick={() => setConfirmReset(true)} className="text-xs text-red-400 hover:text-red-600 hover:underline text-center transition-colors mt-1">
            Reset All Prices to defaults
          </button>
        </div>
      </div>

      {/* Right: Preview */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
        <h3 className="font-bold text-[#1A1A1A] text-lg mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
          {preview ? "Price Preview" : "Select options and click Preview"}
        </h3>
        {preview && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-[#E5E7EB]">
                <tr>
                  {["Item", "Current", "New Price", "Change"].map((h) => (
                    <th key={h} className="pb-2 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {previewItems.map((item) => (
                  <tr key={item.id}>
                    <td className="py-2.5 pr-2 font-medium text-[#1A1A1A] max-w-[140px] truncate">{item.name}</td>
                    <td className="py-2.5 pr-2 text-gray-500">${item.priceUSD.toFixed(2)}</td>
                    <td className="py-2.5 pr-2 font-semibold text-[#1A1A1A]">${item.newPrice.toFixed(2)}</td>
                    <td className={`py-2.5 font-semibold text-sm ${item.change >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                      {item.change >= 0 ? "+" : ""}${item.change.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button id="confirm-apply-btn" onClick={() => setConfirmApply(true)}
              className="w-full mt-4 py-3 text-sm font-semibold text-white bg-[#F97316] hover:bg-[#ea6b10] rounded-xl transition-colors">
              Confirm &amp; Apply
            </button>
          </div>
        )}
        {!preview && (
          <div className="flex flex-col items-center justify-center h-48 text-gray-300">
            <div className="text-4xl mb-3">💰</div>
            <p className="text-sm">Preview will appear here</p>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirmApply}
        title="Apply Price Changes"
        message={`This will ${direction} prices by ${value}${adjType === "percentage" ? "%" : "$"} for ${category} items. Continue?`}
        confirmLabel="Apply"
        onConfirm={handleApply}
        onCancel={() => setConfirmApply(false)}
      />
      <ConfirmDialog
        open={confirmReset}
        title="Reset All Prices"
        message="This will restore all menu and drink prices to the original seed data values. All price edits will be lost."
        confirmLabel="Reset"
        onConfirm={() => { resetToDefaults(); setConfirmReset(false); setPreview(false); }}
        onCancel={() => setConfirmReset(false)}
      />
    </div>
  );
}

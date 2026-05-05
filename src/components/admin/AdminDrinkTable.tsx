"use client";

import { useState } from "react";
import Image from "next/image";
import { useMenu } from "@/context/MenuContext";
import AdminToggle from "./AdminToggle";
import AdminItemModal from "./AdminItemModal";
import ConfirmDialog from "./ConfirmDialog";
import type { DrinkItem } from "@/types/menu";

const PAGE_SIZE = 10;

export default function AdminDrinkTable() {
  const { drinkItems, updateDrinkItem, deleteDrinkItem, toggleDrinkVisibility, addDrinkItem } = useMenu();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<DrinkItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingPrice, setEditingPrice] = useState<string | null>(null);
  const [priceValue, setPriceValue] = useState("");

  const filtered = drinkItems.filter((d) =>
    d.name.en.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <input
          id="drink-search"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search drinks…"
          className="border border-[#E5E7EB] rounded-xl px-4 py-2 text-sm outline-none focus:border-[#3B82F6] w-56"
        />
        <div className="ml-auto">
          <button
            id="add-drink-btn"
            onClick={() => { setEditItem(null); setModalOpen(true); }}
            className="px-4 py-2 text-sm font-semibold text-white bg-[#F97316] hover:bg-[#ea6b10] rounded-xl transition-colors flex items-center gap-1.5"
          >
            <span>＋</span> Add Drink
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[#E5E7EB]">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-[#E5E7EB]">
            <tr>
              {["Image","Name (EN)","Category","Sizes","Price (USD)","Visible","Badge","Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB] bg-white">
            {paginated.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-12 text-gray-400">No drinks found.</td></tr>
            ) : paginated.map((drink) => (
              <tr key={drink.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100">
                    <Image src={drink.image} alt={drink.name.en} fill className="object-cover" sizes="48px" />
                  </div>
                </td>
                <td className="px-4 py-3 font-medium text-[#1A1A1A] max-w-[160px] truncate">{drink.name.en}</td>
                <td className="px-4 py-3 text-gray-500">{drink.category}</td>
                <td className="px-4 py-3">
                  {drink.sizes ? (
                    <div className="flex gap-1 flex-wrap">
                      {drink.sizes.map((s) => (
                        <span key={s.label} className="text-xs px-2 py-0.5 bg-[#F97316]/10 text-[#F97316] rounded-full font-semibold">{s.label}</span>
                      ))}
                    </div>
                  ) : <span className="text-gray-300 text-xs">—</span>}
                </td>
                <td className="px-4 py-3">
                  {editingPrice === drink.id ? (
                    <input
                      autoFocus type="number" value={priceValue}
                      onChange={(e) => setPriceValue(e.target.value)}
                      onBlur={() => setEditingPrice(null)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") { const p = parseFloat(priceValue); if (!isNaN(p) && p > 0) updateDrinkItem(drink.id, { priceUSD: p }); setEditingPrice(null); }
                        if (e.key === "Escape") setEditingPrice(null);
                      }}
                      className="w-24 border border-[#3B82F6] rounded-lg px-2 py-1 text-sm outline-none"
                    />
                  ) : (
                    <button onClick={() => { setEditingPrice(drink.id); setPriceValue(drink.priceUSD.toFixed(2)); }} className="text-[#F97316] font-semibold hover:underline">
                      ${drink.priceUSD.toFixed(2)}
                    </button>
                  )}
                </td>
                <td className="px-4 py-3">
                  <AdminToggle size="sm" checked={drink.visible} onChange={() => toggleDrinkVisibility(drink.id)} />
                </td>
                <td className="px-4 py-3">
                  {drink.badge !== "none" ? <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">{drink.badge}</span> : <span className="text-gray-300 text-xs">—</span>}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button id={`edit-drink-${drink.id}`} onClick={() => { setEditItem(drink); setModalOpen(true); }} className="p-1.5 text-gray-400 hover:text-[#3B82F6] hover:bg-blue-50 rounded-lg transition-colors" title="Edit">✏️</button>
                    <button id={`delete-drink-${drink.id}`} onClick={() => setDeleteId(drink.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors ${p === page ? "bg-[#F97316] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{p}</button>
          ))}
        </div>
      )}

      <AdminItemModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        itemType="drink"
        editItem={editItem}
        onSave={(data) => {
          if (editItem) updateDrinkItem(editItem.id, data as Partial<DrinkItem>);
          else addDrinkItem(data as Omit<DrinkItem, "id">);
        }}
      />
      <ConfirmDialog
        open={!!deleteId}
        title="Delete Drink"
        message="This drink will be permanently removed. This cannot be undone."
        onConfirm={() => { if (deleteId) deleteDrinkItem(deleteId); setDeleteId(null); }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}

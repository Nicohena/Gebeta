"use client";

import { useState } from "react";
import Image from "next/image";
import { useMenu } from "@/context/MenuContext";
import AdminToggle from "./AdminToggle";
import AdminItemModal from "./AdminItemModal";
import ConfirmDialog from "./ConfirmDialog";
import type { MenuItem } from "@/types/menu";

const PAGE_SIZE = 10;

export default function AdminMenuTable() {
  const { menuItems, updateMenuItem, deleteMenuItem, toggleItemVisibility, addMenuItem } = useMenu();
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [editingPrice, setEditingPrice] = useState<string | null>(null);
  const [priceValue, setPriceValue] = useState("");

  const categories = ["All", ...Array.from(new Set(menuItems.map((m) => m.category)))];

  const filtered = menuItems.filter((m) => {
    const matchSearch = m.name.en.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "All" || m.category === catFilter;
    return matchSearch && matchCat;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleBulkDelete = () => {
    selected.forEach((id) => deleteMenuItem(id));
    setSelected(new Set());
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <input
          id="menu-search"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search items…"
          className="border border-[#E5E7EB] rounded-xl px-4 py-2 text-sm outline-none focus:border-[#3B82F6] w-56"
        />
        <select
          id="menu-cat-filter"
          value={catFilter}
          onChange={(e) => { setCatFilter(e.target.value); setPage(1); }}
          className="border border-[#E5E7EB] rounded-xl px-3 py-2 text-sm bg-white outline-none focus:border-[#3B82F6]"
        >
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
        <div className="ml-auto flex gap-2">
          {selected.size > 0 && (
            <button
              onClick={handleBulkDelete}
              className="px-4 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors"
            >
              Delete {selected.size} selected
            </button>
          )}
          <button
            id="add-menu-item-btn"
            onClick={() => { setEditItem(null); setModalOpen(true); }}
            className="px-4 py-2 text-sm font-semibold text-white bg-[#F97316] hover:bg-[#ea6b10] rounded-xl transition-colors flex items-center gap-1.5"
          >
            <span>＋</span> Add Item
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="md:overflow-x-auto md:rounded-2xl md:border border-[#E5E7EB]">
        <table className="w-full text-sm block md:table">
          <thead className="bg-gray-50 border-b border-[#E5E7EB] hidden md:table-header-group">
            <tr>
              <th className="px-4 py-3 text-left">
                <input type="checkbox" onChange={(e) => {
                  if (e.target.checked) setSelected(new Set(paginated.map((m) => m.id)));
                  else setSelected(new Set());
                }} checked={selected.size === paginated.length && paginated.length > 0} className="rounded" />
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Image</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Name (EN)</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Category</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Price (USD)</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Visible</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Badge</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y md:divide-[#E5E7EB] bg-transparent md:bg-white block md:table-row-group">
            {paginated.length === 0 ? (
              <tr className="block md:table-row"><td colSpan={8} className="text-center py-12 text-gray-400 block md:table-cell">No items found.</td></tr>
            ) : paginated.map((item) => (
              <tr key={item.id} className="block md:table-row bg-white hover:bg-gray-50 transition-colors mb-4 md:mb-0 border border-[#E5E7EB] md:border-0 rounded-2xl md:rounded-none overflow-hidden">
                <td className="flex md:table-cell justify-between items-center px-4 py-3 border-b border-gray-100 md:border-none md:whitespace-nowrap">
                  <span className="md:hidden font-semibold text-gray-500 text-xs uppercase">Select</span>
                  <input type="checkbox" checked={selected.has(item.id)} onChange={() => toggleSelect(item.id)} className="rounded" />
                </td>
                <td className="flex md:table-cell justify-between items-center px-4 py-3 border-b border-gray-100 md:border-none md:whitespace-nowrap">
                  <span className="md:hidden font-semibold text-gray-500 text-xs uppercase">Image</span>
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                    <Image src={item.image} alt={item.name.en} fill className="object-cover" sizes="48px" />
                  </div>
                </td>
                <td className="flex md:table-cell justify-between items-center px-4 py-3 border-b border-gray-100 md:border-none md:whitespace-nowrap">
                  <span className="md:hidden font-semibold text-gray-500 text-xs uppercase">Name</span>
                  <span className="font-medium text-[#1A1A1A] max-w-[160px] truncate">{item.name.en}</span>
                </td>
                <td className="flex md:table-cell justify-between items-center px-4 py-3 border-b border-gray-100 md:border-none md:whitespace-nowrap">
                  <span className="md:hidden font-semibold text-gray-500 text-xs uppercase">Category</span>
                  <span className="text-gray-500">{item.category}</span>
                </td>
                <td className="flex md:table-cell justify-between items-center px-4 py-3 border-b border-gray-100 md:border-none md:whitespace-nowrap">
                  <span className="md:hidden font-semibold text-gray-500 text-xs uppercase">Price</span>
                  <div>
                  {editingPrice === item.id ? (
                    <input
                      autoFocus
                      type="number"
                      value={priceValue}
                      onChange={(e) => setPriceValue(e.target.value)}
                      onBlur={() => setEditingPrice(null)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          const p = parseFloat(priceValue);
                          if (!isNaN(p) && p > 0) updateMenuItem(item.id, { priceUSD: p });
                          setEditingPrice(null);
                        }
                        if (e.key === "Escape") setEditingPrice(null);
                      }}
                      className="w-20 sm:w-24 border border-[#3B82F6] rounded-lg px-2 py-1 text-sm outline-none"
                    />
                  ) : (
                    <button
                      onClick={() => { setEditingPrice(item.id); setPriceValue(item.priceUSD.toFixed(2)); }}
                      className="text-[#F97316] font-semibold hover:underline"
                    >
                      ${item.priceUSD.toFixed(2)}
                    </button>
                  )}
                  </div>
                </td>
                <td className="flex md:table-cell justify-between items-center px-4 py-3 border-b border-gray-100 md:border-none md:whitespace-nowrap">
                  <span className="md:hidden font-semibold text-gray-500 text-xs uppercase">Visible</span>
                  <AdminToggle size="sm" checked={item.visible} onChange={() => toggleItemVisibility(item.id)} />
                </td>
                <td className="flex md:table-cell justify-between items-center px-4 py-3 border-b border-gray-100 md:border-none md:whitespace-nowrap">
                  <span className="md:hidden font-semibold text-gray-500 text-xs uppercase">Badge</span>
                  <div>
                  {item.badge !== "none" ? (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">{item.badge}</span>
                  ) : <span className="text-gray-300 text-xs">—</span>}
                  </div>
                </td>
                <td className="flex md:table-cell justify-between items-center px-4 py-3 md:whitespace-nowrap">
                  <span className="md:hidden font-semibold text-gray-500 text-xs uppercase">Actions</span>
                  <div className="flex items-center gap-2">
                    <button
                      id={`edit-item-${item.id}`}
                      onClick={() => { setEditItem(item); setModalOpen(true); }}
                      className="p-1.5 text-gray-400 hover:text-[#3B82F6] hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      id={`delete-item-${item.id}`}
                      onClick={() => setDeleteId(item.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors ${p === page ? "bg-[#F97316] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      <AdminItemModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        itemType="food"
        editItem={editItem}
        onSave={(data) => {
          if (editItem) updateMenuItem(editItem.id, data as Partial<MenuItem>);
          else addMenuItem(data as Omit<MenuItem, "id">);
        }}
      />
      <ConfirmDialog
        open={!!deleteId}
        title="Delete Item"
        message="This item will be permanently removed from the menu. This cannot be undone."
        onConfirm={() => { if (deleteId) deleteMenuItem(deleteId); setDeleteId(null); }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}

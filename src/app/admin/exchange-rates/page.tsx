"use client";

import { useState } from "react";
import { useMenu } from "@/context/MenuContext";
import { useAdminAuth } from "@/context/AdminAuthContext";

const CURRENCY_META = [
  { code: "USD" as const, name: "US Dollar", flag: "🇺🇸", readOnly: true },
  { code: "ETB" as const, name: "Ethiopian Birr", flag: "🇪🇹", readOnly: false },
  { code: "CNY" as const, name: "Chinese Yuan", flag: "🇨🇳", readOnly: false },
  { code: "EUR" as const, name: "Euro", flag: "🇪🇺", readOnly: false },
  { code: "MXN" as const, name: "Mexican Peso", flag: "🇲🇽", readOnly: false },
];

export default function AdminExchangeRatesPage() {
  const { user } = useAdminAuth();
  const { exchangeRates, updateExchangeRates, rateHistory } = useMenu();
  const [draftRates, setDraftRates] = useState({ ...exchangeRates });
  const [saved, setSaved] = useState(false);

  if (user?.role !== "superadmin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="text-5xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
          Access Denied
        </h2>
        <p className="text-gray-500">Only Super Admins can manage exchange rates.</p>
      </div>
    );
  }

  function handleSave() {
    updateExchangeRates(draftRates, user?.name ?? "Admin");
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="max-w-3xl space-y-6">
      {/* Warning banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex items-start gap-3">
        <span className="text-amber-500 text-lg shrink-0">⚠️</span>
        <p className="text-amber-700 text-sm leading-relaxed">
          <strong>Warning:</strong> Updating exchange rates will immediately affect all displayed prices for customers browsing the public menu.
        </p>
      </div>

      {/* Rates table */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E5E7EB]">
          <h2 className="font-bold text-[#1A1A1A] text-lg" style={{ fontFamily: "var(--font-playfair)" }}>
            Currency Exchange Rates
          </h2>
          <p className="text-gray-400 text-sm mt-0.5">All rates relative to USD (base currency = 1.00)</p>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-[#E5E7EB]">
            <tr>
              {["Currency", "Code", "Current Rate", "New Rate", "Last Updated"].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]">
            {CURRENCY_META.map((c) => (
              <tr key={c.code} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-4 font-medium text-[#1A1A1A]">
                  <span className="mr-2">{c.flag}</span>{c.name}
                </td>
                <td className="px-5 py-4">
                  <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded-lg">{c.code}</span>
                </td>
                <td className="px-5 py-4 font-semibold text-[#1A1A1A]">
                  {exchangeRates[c.code].toFixed(4)}
                </td>
                <td className="px-5 py-4">
                  {c.readOnly ? (
                    <span className="text-gray-400 text-xs italic">Base currency</span>
                  ) : (
                    <input
                      id={`rate-${c.code.toLowerCase()}`}
                      type="number"
                      min="0.0001"
                      step="0.0001"
                      value={draftRates[c.code]}
                      onChange={(e) => setDraftRates((prev) => ({ ...prev, [c.code]: parseFloat(e.target.value) || 0 }))}
                      className="w-32 border border-[#E5E7EB] focus:border-[#3B82F6] rounded-xl px-3 py-1.5 text-sm outline-none transition-colors"
                    />
                  )}
                </td>
                <td className="px-5 py-4 text-gray-400 text-xs">
                  {rateHistory.find((h) => h.changes[c.code] !== undefined)
                    ? new Date(rateHistory[0].timestamp).toLocaleDateString()
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="px-6 py-4 border-t border-[#E5E7EB] flex justify-end">
          <button
            id="update-rates-btn"
            onClick={handleSave}
            className={`px-6 py-2.5 text-sm font-semibold text-white rounded-xl transition-all ${saved ? "bg-emerald-500" : "bg-[#3B82F6] hover:bg-blue-700"}`}
          >
            {saved ? "✓ Rates Updated!" : "Update Rates"}
          </button>
        </div>
      </div>

      {/* Rate history */}
      {rateHistory.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
          <h3 className="font-bold text-[#1A1A1A] mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
            Rate Change History (last 5)
          </h3>
          <div className="space-y-2">
            {rateHistory.map((entry, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50">
                <div className="w-8 h-8 rounded-full bg-[#3B82F6]/10 flex items-center justify-center text-[#3B82F6] text-xs font-bold shrink-0">
                  {entry.changedBy.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1A1A1A]">
                    Updated by <span className="text-[#3B82F6]">{entry.changedBy}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(entry.timestamp).toLocaleString()} ·{" "}
                    {Object.entries(entry.changes).map(([k, v]) => `${k}: ${v}`).join(", ")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { useMenu } from "@/context/MenuContext";
import { useAdminAuth } from "@/context/AdminAuthContext";
import type { ExchangeRates } from "@/types/admin";

const CURRENCY_META = [
  { code: "USD" as const, name: "US Dollar",      flag: "🇺🇸", readOnly: true  },
  { code: "ETB" as const, name: "Ethiopian Birr", flag: "🇪🇹", readOnly: false },
  { code: "CNY" as const, name: "Chinese Yuan",   flag: "🇨🇳", readOnly: false },
  { code: "EUR" as const, name: "Euro",            flag: "🇪🇺", readOnly: false },
  { code: "MXN" as const, name: "Mexican Peso",   flag: "🇲🇽", readOnly: false },
];

type SyncStatus = "idle" | "syncing" | "success" | "error";

export default function AdminExchangeRatesPage() {
  const { user } = useAdminAuth();
  const { exchangeRates, updateExchangeRates, rateHistory } = useMenu();

  const [draftRates, setDraftRates] = useState<ExchangeRates>({ ...exchangeRates });
  const [saved, setSaved] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle");
  const [syncError, setSyncError] = useState<string | null>(null);
  const [liveRates, setLiveRates] = useState<Partial<ExchangeRates> | null>(null);
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);
  const [autoSaved, setAutoSaved] = useState(false);

  // Auto-fetch live rates on mount through the app API so the browser avoids CORS/network issues.
  const fetchLiveRates = useCallback(async () => {
    setSyncStatus("syncing");
    setSyncError(null);

    const attempt = async (): Promise<Response> => {
      const res = await fetch("/api/exchange-rates", { cache: "no-store" });
      if (res.status === 503 || res.status === 429) {
        await new Promise((r) => setTimeout(r, 1500));
        return fetch("/api/exchange-rates", { cache: "no-store" });
      }
      return res;
    };

    try {
      const res = await attempt();
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error ?? `HTTP ${res.status}`);
      }

      const data = await res.json();
      const rates = data?.rates;
      if (!rates || typeof rates !== "object") throw new Error("Invalid exchange rate payload");

      const CODES = ["ETB", "CNY", "EUR", "MXN"] as const;
      const fetched: Partial<ExchangeRates> = { USD: 1 };
      for (const code of CODES) {
        if (typeof rates[code] === "number") fetched[code] = rates[code];
      }

      setLiveRates(fetched);
      setFetchedAt(new Date().toISOString());
      setDraftRates((prev) => ({ ...prev, ...fetched }));

      // Auto-save: only write to Supabase if any rate changed by more than 0.01%
      const THRESHOLD = 0.0001;
      const hasChanged = CODES.some((code) => {
        const live = fetched[code] ?? 0;
        const saved = exchangeRates[code] ?? 0;
        return saved === 0 || Math.abs(live - saved) / saved > THRESHOLD;
      });

      if (hasChanged) {
        const merged = { ...exchangeRates, ...fetched } as ExchangeRates;
        updateExchangeRates(merged, "Auto-sync (live API)");
        setAutoSaved(true);
        setTimeout(() => setAutoSaved(false), 4000);
      }

      setSyncStatus("success");
      setTimeout(() => setSyncStatus("idle"), 3000);
    } catch (err) {
      setSyncError(err instanceof Error ? err.message : "Unknown error");
      setSyncStatus("error");
    }
  }, [exchangeRates, updateExchangeRates]);

  useEffect(() => {
    fetchLiveRates();
  }, [fetchLiveRates]);

  if (user?.role !== "superadmin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="text-5xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold text-[#1A1A1A] dark:text-white mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
          Access Denied
        </h2>
        <p className="text-gray-500 dark:text-gray-400">Only Super Admins can manage exchange rates.</p>
      </div>
    );
  }

  function handleSave() {
    updateExchangeRates(draftRates, user?.name ?? "Admin");
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const syncButtonContent = {
    idle:    { text: "Sync Live Rates", icon: "🔄", cls: "bg-emerald-600 hover:bg-emerald-700" },
    syncing: { text: "Syncing…",        icon: "⏳", cls: "bg-emerald-500 cursor-not-allowed opacity-80" },
    success: { text: "Synced!",         icon: "✓",  cls: "bg-emerald-500" },
    error:   { text: "Retry Sync",      icon: "⚠️", cls: "bg-amber-500 hover:bg-amber-600" },
  }[syncStatus];

  return (
    <div className="max-w-3xl space-y-6">

      {/* Live Rates Banner */}
      <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-start gap-3 flex-1">
          <span className="text-emerald-500 text-lg shrink-0 mt-0.5">🌐</span>
          <div>
            <p className="text-emerald-800 dark:text-emerald-300 text-sm font-semibold">
              Live Exchange Rates
              {autoSaved && (
                <span className="ml-2 inline-flex items-center gap-1 text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full font-medium">
                  ✓ Auto-saved to menu!
                </span>
              )}
            </p>
            <p className="text-emerald-700 dark:text-emerald-400 text-xs mt-0.5">
              {fetchedAt
                ? `Auto-synced from open.er-api.com · ${new Date(fetchedAt).toLocaleString()}`
                : "Fetching live rates from open.er-api.com…"}
            </p>
          </div>
        </div>
        <button
          id="sync-rates-btn"
          onClick={fetchLiveRates}
          disabled={syncStatus === "syncing"}
          className={`shrink-0 flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-xl transition-all ${syncButtonContent.cls}`}
        >
          <span>{syncButtonContent.icon}</span>
          {syncButtonContent.text}
        </button>
      </div>

      {/* Error */}
      {syncStatus === "error" && syncError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl px-5 py-3 flex items-center gap-3">
          <span className="text-red-500 shrink-0">⚠️</span>
          <p className="text-red-700 dark:text-red-400 text-sm">{syncError}. You can still edit rates manually.</p>
        </div>
      )}

      {/* Warning banner */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl px-5 py-4 flex items-start gap-3">
        <span className="text-amber-500 text-lg shrink-0">⚠️</span>
        <p className="text-amber-700 dark:text-amber-400 text-sm leading-relaxed">
          <strong>Warning:</strong> Saving exchange rates will immediately affect all displayed prices for customers browsing the public menu.
        </p>
      </div>

      {/* Rates table */}
      <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-[#E5E7EB] dark:border-neutral-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E5E7EB] dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="font-bold text-[#1A1A1A] dark:text-white text-lg" style={{ fontFamily: "var(--font-playfair)" }}>
              Currency Exchange Rates
            </h2>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-0.5">All rates relative to USD (base currency = 1.00)</p>
          </div>
          {liveRates && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live rates loaded
            </span>
          )}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-neutral-900 border-b border-[#E5E7EB] dark:border-neutral-800">
              <tr>
                {["Currency", "Code", "Live Rate", "Save Rate", "Last Saved"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] dark:divide-neutral-800">
              {CURRENCY_META.map((c) => {
                const liveVal = liveRates?.[c.code];
                const changed = liveVal !== undefined && Math.abs(liveVal - (exchangeRates[c.code] ?? 0)) > 0.0001;
                return (
                  <tr key={c.code} className="hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors">
                    <td className="px-5 py-4 font-medium text-[#1A1A1A] dark:text-white whitespace-nowrap">
                      <span className="mr-2">{c.flag}</span>{c.name}
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-mono text-xs bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-lg">{c.code}</span>
                    </td>
                    <td className="px-5 py-4">
                      {syncStatus === "syncing" ? (
                        <span className="text-gray-300 dark:text-gray-600 text-sm animate-pulse">Fetching…</span>
                      ) : liveVal !== undefined ? (
                        <span className={`font-semibold tabular-nums ${changed ? "text-amber-500" : "text-emerald-600 dark:text-emerald-400"}`}>
                          {liveVal.toFixed(4)}
                          {changed && <span className="ml-1 text-[10px] bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded font-bold">CHANGED</span>}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {c.readOnly ? (
                        <span className="text-gray-400 dark:text-gray-500 text-xs italic">Base currency</span>
                      ) : (
                        <input
                          id={`rate-${c.code.toLowerCase()}`}
                          type="number"
                          min="0.0001"
                          step="0.0001"
                          value={draftRates[c.code]}
                          onChange={(e) => setDraftRates((prev) => ({ ...prev, [c.code]: parseFloat(e.target.value) || 0 }))}
                          className="w-32 bg-white dark:bg-neutral-900 text-[#1A1A1A] dark:text-white border border-[#E5E7EB] dark:border-neutral-700 focus:border-[#3B82F6] rounded-xl px-3 py-1.5 text-sm outline-none transition-colors"
                        />
                      )}
                    </td>
                    <td className="px-5 py-4 text-gray-400 dark:text-gray-500 text-xs whitespace-nowrap">
                      {rateHistory.find((h) => h.changes[c.code] !== undefined)
                        ? new Date(rateHistory[0].timestamp).toLocaleDateString()
                        : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden flex flex-col divide-y divide-[#E5E7EB] dark:divide-neutral-800">
          {CURRENCY_META.map((c) => {
            const liveVal = liveRates?.[c.code];
            const changed = liveVal !== undefined && Math.abs(liveVal - (exchangeRates[c.code] ?? 0)) > 0.0001;
            return (
              <div key={c.code} className="p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <div className="font-medium text-[#1A1A1A] dark:text-white flex items-center">
                    <span className="mr-2">{c.flag}</span>{c.name}
                  </div>
                  <span className="font-mono text-xs bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-lg">{c.code}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gray-50 dark:bg-neutral-900 p-3 rounded-xl border border-gray-100 dark:border-neutral-800">
                    <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Live Rate</span>
                    {syncStatus === "syncing" ? (
                      <span className="text-gray-300 text-sm animate-pulse">…</span>
                    ) : liveVal !== undefined ? (
                      <span className={`font-semibold text-sm ${changed ? "text-amber-500" : "text-emerald-600 dark:text-emerald-400"}`}>
                        {liveVal.toFixed(4)}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-sm">—</span>
                    )}
                    {changed && <span className="mt-1 block text-[10px] text-amber-600 dark:text-amber-400 font-bold">CHANGED</span>}
                  </div>
                  <div className="bg-gray-50 dark:bg-neutral-900 p-3 rounded-xl border border-gray-100 dark:border-neutral-800">
                    <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Save Rate</span>
                    {c.readOnly ? (
                      <span className="text-gray-400 text-xs italic">Base</span>
                    ) : (
                      <input
                        id={`rate-mobile-${c.code.toLowerCase()}`}
                        type="number"
                        min="0.0001"
                        step="0.0001"
                        value={draftRates[c.code]}
                        onChange={(e) => setDraftRates((prev) => ({ ...prev, [c.code]: parseFloat(e.target.value) || 0 }))}
                        className="w-full bg-white dark:bg-neutral-800 text-[#1A1A1A] dark:text-white border border-[#E5E7EB] dark:border-neutral-700 focus:border-[#3B82F6] rounded-lg px-2 py-1 text-sm outline-none transition-colors"
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="px-6 py-4 border-t border-[#E5E7EB] dark:border-neutral-800 flex flex-col sm:flex-row items-center gap-3 justify-between">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Rates sourced live from <span className="font-medium">open.er-api.com</span> · Free tier, no API key required
          </p>
          <button
            id="update-rates-btn"
            onClick={handleSave}
            className={`px-6 py-2.5 text-sm font-semibold text-white rounded-xl transition-all ${saved ? "bg-emerald-500" : "bg-[#3B82F6] hover:bg-blue-700"}`}
          >
            {saved ? "✓ Rates Saved!" : "Save Rates to Menu"}
          </button>
        </div>
      </div>

      {/* Rate history */}
      {rateHistory.length > 0 && (
        <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-[#E5E7EB] dark:border-neutral-800 p-6">
          <h3 className="font-bold text-[#1A1A1A] dark:text-white mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
            Rate Change History (last 5)
          </h3>
          <div className="space-y-2">
            {rateHistory.map((entry, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-neutral-900">
                <div className="w-8 h-8 rounded-full bg-[#3B82F6]/10 flex items-center justify-center text-[#3B82F6] text-xs font-bold shrink-0">
                  {entry.changedBy.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1A1A1A] dark:text-white">
                    Updated by <span className="text-[#3B82F6]">{entry.changedBy}</span>
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    {new Date(entry.timestamp).toLocaleString()} ·{" "}
                    {Object.entries(entry.changes).map(([k, v]) => `${k}: ${(v as number).toFixed(4)}`).join(", ")}
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

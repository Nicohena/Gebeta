"use client";

import Link from "next/link";
import Image from "next/image";
import { useMenu } from "@/context/MenuContext";
import AdminStatsCard from "@/components/admin/AdminStatsCard";

export default function AdminDashboardPage() {
  const { menuItems, drinkItems, lastUpdated } = useMenu();

  const activeFood = menuItems.filter((m) => m.visible).length;
  const activeDrinks = drinkItems.filter((d) => d.visible).length;
  const hiddenItems = menuItems.filter((m) => !m.visible).length + drinkItems.filter((d) => !d.visible).length;
  const lastUpdate = lastUpdated
    ? new Date(lastUpdated).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
    : "No changes yet";

  const recentFood = [...menuItems].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 5);
  const recentDrinks = [...drinkItems].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <AdminStatsCard title="Menu Items" value={activeFood} icon="🍔" color="orange" trend={`${menuItems.length} total`} />
        <AdminStatsCard title="Drinks" value={activeDrinks} icon="🍹" color="blue" trend={`${drinkItems.length} total`} />
        <AdminStatsCard title="Hidden Items" value={hiddenItems} icon="👁️" color="red" trend="Not visible to customers" />
        <AdminStatsCard title="Last Updated" value={lastUpdate} icon="🕐" color="green" />
      </div>

      {/* Quick tables */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent food */}
        <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-[#E5E7EB] dark:border-neutral-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-[#1A1A1A] dark:text-white text-lg" style={{ fontFamily: "var(--font-playfair)" }}>
              Recent Menu Items
            </h2>
            <Link href="/admin/menu" className="text-sm text-[#3B82F6] hover:underline font-medium">
              Manage all →
            </Link>
          </div>
          <div className="space-y-3">
            {recentFood.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors">
                <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-gray-100 dark:bg-neutral-800 shrink-0">
                  <Image src={item.image} alt={item.name.en} fill className="object-cover" sizes="40px" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#1A1A1A] dark:text-white text-sm truncate">{item.name.en}</p>
                  <p className="text-gray-400 dark:text-gray-500 text-xs">{item.category}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[#F97316] font-semibold text-sm">${item.priceUSD.toFixed(2)}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.visible ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" : "bg-gray-100 dark:bg-neutral-800 text-gray-400"}`}>
                    {item.visible ? "Live" : "Hidden"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent drinks */}
        <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-[#E5E7EB] dark:border-neutral-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-[#1A1A1A] dark:text-white text-lg" style={{ fontFamily: "var(--font-playfair)" }}>
              Recent Drinks
            </h2>
            <Link href="/admin/drinks" className="text-sm text-[#3B82F6] hover:underline font-medium">
              Manage all →
            </Link>
          </div>
          <div className="space-y-3">
            {recentDrinks.map((drink) => (
              <div key={drink.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors">
                <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-gray-100 dark:bg-neutral-800 shrink-0">
                  <Image src={drink.image} alt={drink.name.en} fill className="object-cover" sizes="40px" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#1A1A1A] dark:text-white text-sm truncate">{drink.name.en}</p>
                  <p className="text-gray-400 dark:text-gray-500 text-xs">{drink.category}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[#F97316] font-semibold text-sm">${drink.priceUSD.toFixed(2)}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${drink.visible ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" : "bg-gray-100 dark:bg-neutral-800 text-gray-400"}`}>
                    {drink.visible ? "Live" : "Hidden"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

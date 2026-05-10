"use client";

import type { StatsCardProps } from "@/types/admin";

const COLOR_MAP = {
  orange: { bg: "bg-[#F97316]/10",        icon: "bg-[#F97316]/15 text-[#F97316]",                                              value: "text-[#F97316]"                         },
  blue:   { bg: "bg-blue-50 dark:bg-blue-900/20",      icon: "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400",          value: "text-blue-600 dark:text-blue-400"       },
  green:  { bg: "bg-emerald-50 dark:bg-emerald-900/20",icon: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400",value: "text-emerald-600 dark:text-emerald-400" },
  red:    { bg: "bg-red-50 dark:bg-red-900/20",        icon: "bg-red-100 dark:bg-red-900/40 text-red-500 dark:text-red-400",              value: "text-red-500 dark:text-red-400"         },
};

export default function AdminStatsCard({ title, value, icon, trend, color }: StatsCardProps) {
  const c = COLOR_MAP[color];
  return (
    <div className={`${c.bg} rounded-2xl p-6 border border-white/50 dark:border-white/5`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">{title}</p>
          <p className={`text-3xl font-bold ${c.value}`} style={{ fontFamily: "var(--font-playfair)" }}>{value}</p>
          {trend && <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">{trend}</p>}
        </div>
        <div className={`${c.icon} w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

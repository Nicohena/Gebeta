"use client";

import type { StatsCardProps } from "@/types/admin";

const COLOR_MAP = {
  orange: { bg: "bg-[#F97316]/10", icon: "bg-[#F97316]/15 text-[#F97316]", value: "text-[#F97316]" },
  blue:   { bg: "bg-blue-50",      icon: "bg-blue-100 text-blue-600",       value: "text-blue-600"  },
  green:  { bg: "bg-emerald-50",   icon: "bg-emerald-100 text-emerald-600", value: "text-emerald-600"},
  red:    { bg: "bg-red-50",       icon: "bg-red-100 text-red-500",         value: "text-red-500"   },
};

export default function AdminStatsCard({ title, value, icon, trend, color }: StatsCardProps) {
  const c = COLOR_MAP[color];
  return (
    <div className={`${c.bg} rounded-2xl p-6 border border-white`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">{title}</p>
          <p className={`text-3xl font-bold ${c.value}`} style={{ fontFamily: "var(--font-playfair)" }}>{value}</p>
          {trend && <p className="text-gray-400 text-xs mt-1">{trend}</p>}
        </div>
        <div className={`${c.icon} w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

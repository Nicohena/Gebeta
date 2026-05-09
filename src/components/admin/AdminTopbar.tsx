"use client";

import { useAdminAuth } from "@/context/AdminAuthContext";

interface AdminTopbarProps {
  title: string;
  onMenuToggle: () => void;
}

export default function AdminTopbar({ title, onMenuToggle }: AdminTopbarProps) {
  const { user } = useAdminAuth();

  return (
    <header className="h-16 bg-white border-b border-[#E5E7EB] flex items-center px-4 sm:px-6 gap-4 sticky top-0 z-30">
      {/* Mobile hamburger */}
      <button
        id="admin-menu-toggle"
        onClick={onMenuToggle}
        className="lg:hidden p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Toggle sidebar"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Title */}
      <h1 className="font-bold text-[#1A1A1A] text-lg flex-1 truncate" style={{ fontFamily: "var(--font-playfair)" }}>
        {title}
      </h1>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          id="view-live-site"
          className="hidden sm:flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#F97316] font-medium transition-colors border border-[#E5E7EB] px-3 py-1.5 rounded-lg hover:border-[#F97316]"
        >
          View Live Site
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 font-medium hidden sm:inline">{user?.name}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${user?.role === "superadmin" ? "bg-[#F97316]/15 text-[#F97316]" : "bg-blue-100 text-blue-600"}`}>
            {user?.role}
          </span>
        </div>
      </div>
    </header>
  );
}

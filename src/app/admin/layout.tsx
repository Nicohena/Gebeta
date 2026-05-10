"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import AdminAuthGuard from "@/components/admin/AdminAuthGuard";
import { NotificationProvider } from "@/context/NotificationContext";
import AdminNotifications from "@/components/admin/AdminNotifications";

const PAGE_TITLES: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/menu": "Menu Items",
  "/admin/drinks": "Drinks",
  "/admin/feedback": "Customer Feedback",
  "/admin/pricing": "Pricing",
  "/admin/exchange-rates": "Exchange Rates",
  "/admin/settings": "Settings",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const title = PAGE_TITLES[pathname] ?? "Admin";

  return (
    <NotificationProvider>
      <AdminAuthGuard>
        <AdminNotifications />
        <div className="min-h-screen bg-gray-50 dark:bg-[#0F0F0F] flex">
          <AdminSidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <div className="flex-1 lg:ml-64 flex flex-col min-h-screen bg-gray-50 dark:bg-[#0F0F0F]">
            <AdminTopbar title={title} onMenuToggle={() => setSidebarOpen(true)} />
            <main className="flex-1 p-6">{children}</main>
          </div>
        </div>
      </AdminAuthGuard>
    </NotificationProvider>
  );
}

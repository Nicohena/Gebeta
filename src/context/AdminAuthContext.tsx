"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { AdminUser, AdminRole } from "@/types/admin";
import { ADMIN_USERS } from "@/data/adminUsers";
import { storage, STORAGE_KEYS } from "@/lib/storage";

interface AdminAuthContextType {
  user: AdminUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = storage.get<AdminUser | null>(STORAGE_KEYS.ADMIN_USER, null);
    if (saved?.token === "demo-token") setUser(saved);
    setMounted(true);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    const found = ADMIN_USERS.find(
      (u) => u.email === email && u.password === password
    );
    if (!found) return false;
    const adminUser: AdminUser = {
      email: found.email,
      name: found.name,
      role: found.role as AdminRole,
      token: "demo-token",
    };
    setUser(adminUser);
    storage.set(STORAGE_KEYS.ADMIN_USER, adminUser);
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    storage.remove(STORAGE_KEYS.ADMIN_USER);
  }, []);

  if (!mounted) {
    return (
      <AdminAuthContext.Provider value={{ user: null, login, logout, isAuthenticated: false }}>
        {children}
      </AdminAuthContext.Provider>
    );
  }

  return (
    <AdminAuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth(): AdminAuthContextType {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}

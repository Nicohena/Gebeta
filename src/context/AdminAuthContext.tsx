"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { AdminUser, AdminRole } from "@/types/admin";
import { createClient, isSupabaseConfigured } from "@/lib/supabase";

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
    let active = true;

    async function loadUser() {
      if (!isSupabaseConfigured()) {
        setMounted(true);
        return;
      }

      try {
        const supabase = createClient();
        const { data, error } = await supabase.auth.getUser();

        if (!active) return;

        if (error) {
          console.warn("Admin auth initialization warning:", error.message);
          setMounted(true);
          return;
        }

        if (data.user?.email) {
          setUser({
            email: data.user.email,
            name:
              data.user.user_metadata?.name ??
              data.user.email.split("@")[0] ??
              "Admin",
            role: "superadmin",
            token: data.user.id,
          });
          setMounted(true);
          return;
        }
      } catch (err) {
        console.warn("Admin auth initialization failed:", err);
      }

      if (active) {
        setMounted(true);
      }
    }

    loadUser();

    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    if (!isSupabaseConfigured()) {
      return false;
    }

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error && data.user?.email) {
        setUser({
          email: data.user.email,
          name:
            data.user.user_metadata?.name ??
            data.user.email.split("@")[0] ??
            "Admin",
          role: "superadmin",
          token: data.user.id,
        });
        return true;
      }
    } catch (err) {
      console.warn("Admin login failed:", err);
    }

    return false;
  }, []);

  const logout = useCallback(() => {
    if (isSupabaseConfigured()) {
      createClient().auth.signOut().catch(() => undefined);
    }
    setUser(null);
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

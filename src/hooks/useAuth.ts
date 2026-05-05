"use client";
import { useAdminAuth } from "@/context/AdminAuthContext";
export function useAuth() {
  return useAdminAuth();
}

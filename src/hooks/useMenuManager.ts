"use client";
import { useMenu } from "@/context/MenuContext";
export function useMenuManager() {
  return useMenu();
}

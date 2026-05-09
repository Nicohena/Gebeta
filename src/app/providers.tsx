"use client";

import { AdminAuthProvider } from "@/context/AdminAuthContext";
import { MenuProvider } from "@/context/MenuContext";
import { LocaleProvider } from "@/context/LocaleContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { FavoritesProvider } from "@/context/FavoritesContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AdminAuthProvider>
        <MenuProvider>
          <FavoritesProvider>
            <LocaleProvider>{children}</LocaleProvider>
          </FavoritesProvider>
        </MenuProvider>
      </AdminAuthProvider>
    </ThemeProvider>
  );
}

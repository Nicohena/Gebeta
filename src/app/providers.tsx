"use client";

import { AdminAuthProvider } from "@/context/AdminAuthContext";
import { MenuProvider } from "@/context/MenuContext";
import { LocaleProvider } from "@/context/LocaleContext";
import { ThemeProvider } from "@/context/ThemeContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AdminAuthProvider>
        <MenuProvider>
          <LocaleProvider>{children}</LocaleProvider>
        </MenuProvider>
      </AdminAuthProvider>
    </ThemeProvider>
  );
}

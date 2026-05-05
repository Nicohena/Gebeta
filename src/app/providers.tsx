"use client";

import { AdminAuthProvider } from "@/context/AdminAuthContext";
import { MenuProvider } from "@/context/MenuContext";
import { LocaleProvider } from "@/context/LocaleContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <MenuProvider>
        <LocaleProvider>{children}</LocaleProvider>
      </MenuProvider>
    </AdminAuthProvider>
  );
}

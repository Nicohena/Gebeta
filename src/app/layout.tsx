import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Panda — Bold Flavors. No Boundaries.",
  description:
    "Panda is a contemporary fusion restaurant serving modern international cuisine — burgers, steaks, pasta, craft cocktails, and artisan desserts.",
  keywords: ["Panda restaurant", "fusion cuisine", "digital menu", "craft cocktails", "modern dining"],
  openGraph: {
    title: "Panda — Bold Flavors. No Boundaries.",
    description: "Modern international fusion. Upscale casual dining.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=DM+Sans:ital,opsz,wght@0,9..40,300..700;1,9..40,300..700&family=Noto+Sans+SC:wght@400;500;700&family=Noto+Sans+Ethiopic:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

// Providers are split to avoid "use client" in layout.tsx (a Server Component)
import Providers from "./providers";

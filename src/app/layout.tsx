import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FaidaHai | Real Estate Dashboard",
  description: "Premium enterprise real estate dashboard for FaidaHai.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="font-sans min-h-full flex flex-col bg-[var(--color-background)] text-[var(--color-foreground)]">{children}</body>
    </html>
  );
}

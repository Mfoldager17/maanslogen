import type { Metadata } from "next";
import { AppShell } from "./components/layout/AppShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "Maanslogen Admin",
  description: "Admin til Maanslogen – kategorier, typer, drikke og attributter",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="da" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}

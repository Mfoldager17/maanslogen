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
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9090";
  return (
    <html lang="da" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        {/* Sæt API-URL fra server (runtime .env.dev i Docker) – læses af api-client.ts i browser */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__MAANSLOGEN_API_URL__ = ${JSON.stringify(apiUrl)};`,
          }}
        />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}

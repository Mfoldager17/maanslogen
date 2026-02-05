import { cookies } from "next/headers";
import type { Metadata } from "next";
import { AppShell } from "./components/layout/AppShell";
import "./globals.css";

const THEME_COOKIE = "maanslogen-admin-theme";

export const metadata: Metadata = {
  title: "Maanslogen Admin",
  description: "Admin til Maanslogen – kategorier, typer, drikke og attributter",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9090";
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get(THEME_COOKIE);
  const theme = themeCookie?.value ?? "";

  return (
    <html lang="da" suppressHydrationWarning data-theme={theme || undefined}>
      <body className="min-h-screen antialiased">
        {/* Sæt API-URL fra server (runtime .env.dev i Docker) – læses af api-client.ts i browser */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__MAANSLOGEN_API_URL__ = ${JSON.stringify(apiUrl)};`,
          }}
        />
        <AppShell initialTheme={theme}>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
